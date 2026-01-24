package klon

import (
	"database/sql"
	"time"
)

type PendingOrganization struct {
	OrganizationID      int       `json:"organization_id"`
	Name                string    `json:"name"`
	Description         string    `json:"description"`
	CoverImage          string    `json:"cover_image"`
	CertificateDocument string    `json:"certificate_document"`
	CreatorUserID       int       `json:"creator_user_id"`
	CreatorUsername     string    `json:"creator_username"`
	Status              string    `json:"status"`
	CreatedAt           time.Time `json:"created_at"`
}

// GetPendingOrganizations - ดึง organizations ที่ status = 'pending'
func (db *PostgresKlonDB) GetPendingOrganizations() ([]PendingOrganization, error) {
	query := `
		SELECT 
			o.organization_id,
			o.name,
			o.description,
			COALESCE(o.cover_image, '') as cover_image,
			COALESCE(o.certificate_document, '') as certificate_document,
			o.creator_user_id,
			COALESCE(u.username, '') as creator_username,
			o.status,
			o.created_at
		FROM organizations o
		LEFT JOIN users u ON o.creator_user_id = u.user_id
		WHERE o.status = 'pending'
		ORDER BY o.created_at DESC
	`

	rows, err := db.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var organizations []PendingOrganization
	for rows.Next() {
		var org PendingOrganization
		err := rows.Scan(
			&org.OrganizationID,
			&org.Name,
			&org.Description,
			&org.CoverImage,
			&org.CertificateDocument,
			&org.CreatorUserID,
			&org.CreatorUsername,
			&org.Status,
			&org.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		organizations = append(organizations, org)
	}

	return organizations, nil
}

// UpdateOrganizationStatus - อัปเดต status ของ organization
func (db *PostgresKlonDB) UpdateOrganizationStatus(organizationID int, status string) error {
	query := `
		UPDATE organizations 
		SET status = $1, updated_at = NOW()
		WHERE organization_id = $2
	`

	result, err := db.db.Exec(query, status, organizationID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
