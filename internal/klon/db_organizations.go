package klon

import (
	"context"
	"fmt"
	"time"
)

type Organization struct {
	OrganizationID      int       `json:"organization_id"`
	Name                string    `json:"name"`
	Description         string    `json:"description"`
	CoverImage          string    `json:"cover_image"`
	CertificateDocument string    `json:"certificate_document"`
	CreatorUserID       int       `json:"creator_user_id"`
	Status              string    `json:"status"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type OrganizationMember struct {
	MemberID         int       `json:"member_id"`
	OrganizationID   int       `json:"organization_id"`
	UserID           int       `json:"user_id"`
	Role                  string    `json:"role"` // creator, assistant, member
	Status                string    `json:"status"`
	CanView               bool      `json:"can_view"`
	CanEdit               bool      `json:"can_edit"`
	CanViewScores         bool      `json:"can_view_scores"`
	CanAddAssistant       bool      `json:"can_add_assistant"`
	CanCreateCompetition  bool      `json:"can_create_competition"`
	InvitedBy             *int      `json:"invited_by"`
	JoinedAt         time.Time `json:"joined_at"`
}

type OrganizationWithMember struct {
	Organization
	MemberID         int    `json:"member_id"`
	MemberStatus     string `json:"member_status"`
	MemberCount      int    `json:"member_count"`
	CompetitionCount int    `json:"competition_count"`
}

// GetUserOrganizations - ดึง organizations ที่ user เป็นสมาชิก
func (p *PostgresKlonDB) GetUserOrganizations(ctx context.Context, userID int) ([]OrganizationWithMember, error) {
	query := `
		SELECT 
			o.organization_id, o.name, o.description, o.cover_image, 
			o.certificate_document, o.creator_user_id, o.status,
			o.created_at, o.updated_at,
			om.member_id,
			om.status as member_status,
			(SELECT COUNT(*) FROM organization_members WHERE organization_id = o.organization_id AND status = 'accepted') as member_count,
			(SELECT COUNT(*) FROM competitions WHERE organization_id = o.organization_id) as competition_count
		FROM organizations o
		JOIN organization_members om ON o.organization_id = om.organization_id
		WHERE om.user_id = $1
		ORDER BY o.created_at DESC
	`

	rows, err := p.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user organizations: %w", err)
	}
	defer rows.Close()

	var orgs []OrganizationWithMember
	for rows.Next() {
		var org OrganizationWithMember
		err := rows.Scan(
			&org.OrganizationID, &org.Name, &org.Description, &org.CoverImage,
			&org.CertificateDocument, &org.CreatorUserID, &org.Status,
			&org.CreatedAt, &org.UpdatedAt,
			&org.MemberID,
			&org.MemberStatus,
			&org.MemberCount, &org.CompetitionCount,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan organization: %w", err)
		}
		orgs = append(orgs, org)
	}

	return orgs, nil
}

// CreateOrganization - สร้าง organization ใหม่
func (p *PostgresKlonDB) CreateOrganization(ctx context.Context, org Organization) (Organization, error) {
	var id int
	err := p.db.QueryRowContext(ctx, `
		INSERT INTO organizations (name, description, cover_image, certificate_document, creator_user_id, status)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING organization_id
	`, org.Name, org.Description, org.CoverImage, org.CertificateDocument, org.CreatorUserID, org.Status).Scan(&id)

	if err != nil {
		return Organization{}, fmt.Errorf("failed to create organization: %w", err)
	}

	org.OrganizationID = id
	org.CreatedAt = time.Now()
	org.UpdatedAt = time.Now()

	// เพิ่ม creator เป็น member อัตโนมัติ (role = creator)
	_, err = p.db.ExecContext(ctx, `
		INSERT INTO organization_members (organization_id, user_id, role, status)
		VALUES ($1, $2, 'creator', 'accepted')
	`, id, org.CreatorUserID)

	if err != nil {
		return Organization{}, fmt.Errorf("failed to add creator as member: %w", err)
	}

	return org, nil
}

// GetOrganization - ดูรายละเอียด organization
func (p *PostgresKlonDB) GetOrganization(ctx context.Context, orgID int) (Organization, error) {
	var org Organization
	err := p.db.QueryRowContext(ctx, `
		SELECT organization_id, name, description, cover_image, certificate_document, 
		       creator_user_id, status, created_at, updated_at
		FROM organizations
		WHERE organization_id = $1
	`, orgID).Scan(
		&org.OrganizationID, &org.Name, &org.Description, &org.CoverImage,
		&org.CertificateDocument, &org.CreatorUserID, &org.Status,
		&org.CreatedAt, &org.UpdatedAt,
	)

	if err != nil {
		return Organization{}, fmt.Errorf("organization not found: %w", err)
	}

	return org, nil
}

// GetOrganizationMembers - ดูสมาชิกของ organization (รวม role และ permissions)
func (p *PostgresKlonDB) GetOrganizationMembers(ctx context.Context, orgID int) ([]map[string]interface{}, error) {
	query := `
		SELECT om.member_id, om.user_id, om.role, om.status, om.joined_at,
		       om.can_view, om.can_edit, om.can_view_scores, om.can_add_assistant, om.can_create_competition,
		       u.username, u.full_name, u.email
		FROM organization_members om
		JOIN users u ON om.user_id = u.user_id
		WHERE om.organization_id = $1
		ORDER BY 
			CASE om.role 
				WHEN 'creator' THEN 1
				WHEN 'assistant' THEN 2
				WHEN 'member' THEN 3
			END,
			om.joined_at
	`

	rows, err := p.db.QueryContext(ctx, query, orgID)
	if err != nil {
		return nil, fmt.Errorf("failed to get organization members: %w", err)
	}
	defer rows.Close()

	var members []map[string]interface{}
	for rows.Next() {
		var memberID, userID int
		var role, status, username, fullName, email string
		var canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition bool
		var joinedAt time.Time

		err := rows.Scan(&memberID, &userID, &role, &status, &joinedAt,
			&canView, &canEdit, &canViewScores, &canAddAssistant, &canCreateCompetition,
			&username, &fullName, &email)
		if err != nil {
			return nil, fmt.Errorf("failed to scan member: %w", err)
		}

		members = append(members, map[string]interface{}{
			"member_id":              memberID,
			"user_id":                userID,
			"role":                   role,
			"status":                 status,
			"joined_at":              joinedAt,
			"can_view":               canView,
			"can_edit":               canEdit,
			"can_view_scores":        canViewScores,
			"can_add_assistant":      canAddAssistant,
			"can_create_competition": canCreateCompetition,
			"username":               username,
			"full_name":              fullName,
			"email":                  email,
		})
	}

	return members, nil
}

// UpdateMemberStatus - อัปเดตสถานะของสมาชิก
func (p *PostgresKlonDB) UpdateMemberStatus(ctx context.Context, memberID int, status string) error {
	_, err := p.db.ExecContext(ctx, `
		UPDATE organization_members
		SET status = $1
		WHERE member_id = $2
	`, status, memberID)

	if err != nil {
		return fmt.Errorf("failed to update member status: %w", err)
	}

	return nil
}

// GetCompetitionsByOrganizationID - ดึงการประกวดทั้งหมดที่ organization จัด
func (p *PostgresKlonDB) GetCompetitionsByOrganizationID(ctx context.Context, organizationID int) ([]Competition, error) {
	query := `
		SELECT 
			competition_id, title, description, poster_url,
			start_date, end_date, organization_id, status,
			created_at, updated_at
		FROM competitions
		WHERE organization_id = $1
		ORDER BY created_at DESC
	`

	rows, err := p.db.QueryContext(ctx, query, organizationID)
	if err != nil {
		return nil, fmt.Errorf("failed to get competitions by organization: %w", err)
	}
	defer rows.Close()

	var competitions []Competition
	for rows.Next() {
		var comp Competition
		err := rows.Scan(
			&comp.ID, &comp.Title, &comp.Description,
			&comp.PosterURL, &comp.StartDate, &comp.EndDate, &comp.OrganizationID,
			&comp.Status, &comp.CreatedAt, &comp.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan competition: %w", err)
		}
		competitions = append(competitions, comp)
	}

	return competitions, nil
}

// InviteMember - เชิญสมาชิกธรรมดา (role = member)
func (p *PostgresKlonDB) InviteMember(ctx context.Context, organizationID, userID, invitedBy int) error {
	query := `
		INSERT INTO organization_members (organization_id, user_id, role, status, invited_by)
		VALUES ($1, $2, 'member', 'pending', $3)
		ON CONFLICT (organization_id, user_id) DO NOTHING
	`
	_, err := p.db.ExecContext(ctx, query, organizationID, userID, invitedBy)
	if err != nil {
		return fmt.Errorf("failed to invite member: %w", err)
	}
	return nil
}

// InviteAssistant - เชิญผู้ช่วย (role = assistant) พร้อมกำหนดสิทธิ
func (p *PostgresKlonDB) InviteAssistant(ctx context.Context, organizationID, userID, invitedBy int, canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition bool) error {
	query := `
		INSERT INTO organization_members 
			(organization_id, user_id, role, status, can_view, can_edit, can_view_scores, can_add_assistant, can_create_competition, invited_by)
		VALUES ($1, $2, 'assistant', 'pending', $3, $4, $5, $6, $7, $8)
		ON CONFLICT (organization_id, user_id) 
		DO UPDATE SET 
			role = 'assistant',
			can_view = EXCLUDED.can_view,
			can_edit = EXCLUDED.can_edit,
			can_view_scores = EXCLUDED.can_view_scores,
			can_add_assistant = EXCLUDED.can_add_assistant,
			can_create_competition = EXCLUDED.can_create_competition,
			invited_by = EXCLUDED.invited_by
	`
	_, err := p.db.ExecContext(ctx, query, organizationID, userID, canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition, invitedBy)
	if err != nil {
		return fmt.Errorf("failed to invite assistant: %w", err)
	}
	return nil
}

// UpdateAssistantPermissions - อัปเดตสิทธิของผู้ช่วย
func (p *PostgresKlonDB) UpdateAssistantPermissions(ctx context.Context, memberID int, canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition bool) error {
	query := `
		UPDATE organization_members
		SET can_view = $1, can_edit = $2, can_view_scores = $3, can_add_assistant = $4, can_create_competition = $5
		WHERE member_id = $6 AND role = 'assistant'
	`
	_, err := p.db.ExecContext(ctx, query, canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition, memberID)
	if err != nil {
		return fmt.Errorf("failed to update assistant permissions: %w", err)
	}
	return nil
}

// InviteOrganizationMember - deprecated, ใช้ InviteMember หรือ InviteAssistant แทน
func (p *PostgresKlonDB) InviteOrganizationMember(ctx context.Context, organizationID, userID int) error {
	query := `
		INSERT INTO organization_members (organization_id, user_id, role, status)
		VALUES ($1, $2, 'member', 'pending')
		ON CONFLICT (organization_id, user_id) DO NOTHING
	`
	_, err := p.db.ExecContext(ctx, query, organizationID, userID)
	if err != nil {
		return fmt.Errorf("failed to invite member: %w", err)
	}
	return nil
}

// DeleteOrganizationMember - ลบสมาชิกออกจาก organization
func (p *PostgresKlonDB) DeleteOrganizationMember(ctx context.Context, memberID int) error {
	query := `DELETE FROM organization_members WHERE member_id = $1`
	_, err := p.db.ExecContext(ctx, query, memberID)
	if err != nil {
		return fmt.Errorf("failed to delete member: %w", err)
	}
	return nil
}

// GetAssistants - ดึงรายการผู้ช่วยทั้งหมด (role = assistant)
func (p *PostgresKlonDB) GetAssistants(ctx context.Context, orgID int) ([]map[string]interface{}, error) {
	query := `
		SELECT om.member_id, om.user_id, om.role, om.status, om.joined_at,
		       om.can_view, om.can_edit, om.can_view_scores, om.can_add_assistant, om.can_create_competition,
		       u.username, u.full_name, u.email
		FROM organization_members om
		JOIN users u ON om.user_id = u.user_id
		WHERE om.organization_id = $1 AND om.role = 'assistant'
		ORDER BY om.joined_at DESC
	`

	rows, err := p.db.QueryContext(ctx, query, orgID)
	if err != nil {
		return nil, fmt.Errorf("failed to get assistants: %w", err)
	}
	defer rows.Close()

	var assistants []map[string]interface{}
	for rows.Next() {
		var memberID, userID int
		var role, status, username, fullName, email string
		var canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition bool
		var joinedAt time.Time

		err := rows.Scan(&memberID, &userID, &role, &status, &joinedAt,
			&canView, &canEdit, &canViewScores, &canAddAssistant, &canCreateCompetition,
			&username, &fullName, &email)
		if err != nil {
			return nil, fmt.Errorf("failed to scan assistant: %w", err)
		}

		assistants = append(assistants, map[string]interface{}{
			"assistant_id":           memberID, // ใช้ member_id เป็น assistant_id
			"member_id":              memberID,
			"user_id":                userID,
			"role":                   role,
			"status":                 status,
			"joined_at":              joinedAt,
			"can_view":               canView,
			"can_edit":               canEdit,
			"can_view_scores":        canViewScores,
			"can_add_assistant":      canAddAssistant,
			"can_create_competition": canCreateCompetition,
			"username":               username,
			"full_name":              fullName,
			"email":                  email,
		})
	}

	return assistants, nil
}

// CheckUserCanCreateCompetition - ตรวจสอบว่า user มีสิทธิ์สร้างการประกวดหรือไม่
func (p *PostgresKlonDB) CheckUserCanCreateCompetition(ctx context.Context, userID, organizationID int) (bool, error) {
	var canCreate bool
	var role string
	query := `
		SELECT role, can_create_competition
		FROM organization_members
		WHERE user_id = $1 AND organization_id = $2 AND status = 'accepted'
	`
	err := p.db.QueryRowContext(ctx, query, userID, organizationID).Scan(&role, &canCreate)
	if err != nil {
		return false, nil // ไม่ใช่สมาชิก
	}

	// creator สร้างได้เสมอ, assistant ต้องมี permission
	if role == "creator" {
		return true, nil
	}
	
	return canCreate, nil
}
