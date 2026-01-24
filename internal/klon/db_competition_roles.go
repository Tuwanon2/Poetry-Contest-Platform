package klon

import (
	"context"
	"fmt"
)

// ==================== JUDGES (กรรมการระดับการประกวด) ====================

// GetCompetitionJudges - ดึงกรรมการทั้งหมดในการประกวด (แบบรวม level)
func (p *PostgresKlonDB) GetCompetitionJudges(ctx context.Context, competitionID int) ([]map[string]interface{}, error) {
	query := `
		SELECT j.judge_id, j.user_id, j.level_id, j.status, j.assigned_at,
		       u.username, u.full_name, u.email,
		       l.name as level_name
		FROM judges j
		JOIN users u ON j.user_id = u.user_id
		LEFT JOIN levels l ON j.level_id = l.level_id
		WHERE j.competition_id = $1
		ORDER BY j.assigned_at
	`

	rows, err := p.db.QueryContext(ctx, query, competitionID)
	if err != nil {
		return nil, fmt.Errorf("failed to get competition judges: %w", err)
	}
	defer rows.Close()

	var judges []map[string]interface{}
	for rows.Next() {
		var judgeID, userID, levelID int
		var status, username, fullName, email, levelName string
		var assignedAt interface{}

		err := rows.Scan(&judgeID, &userID, &levelID, &status, &assignedAt,
			&username, &fullName, &email, &levelName)
		if err != nil {
			return nil, fmt.Errorf("failed to scan judge: %w", err)
		}

		judges = append(judges, map[string]interface{}{
			"judge_id":    judgeID,
			"user_id":     userID,
			"level_id":    levelID,
			"status":      status,
			"assigned_at": assignedAt,
			"username":    username,
			"full_name":   fullName,
			"email":       email,
			"level_name":  levelName,
		})
	}

	return judges, nil
}

// InviteCompetitionJudge - เชิญกรรมการเข้าการประกวด (ต้องระบุ level)
func (p *PostgresKlonDB) InviteCompetitionJudge(ctx context.Context, competitionID, userID, levelID, invitedBy int) error {
	query := `
		INSERT INTO judges (competition_id, user_id, level_id, status, invited_by)
		VALUES ($1, $2, $3, 'pending', $4)
		ON CONFLICT (user_id, competition_id, level_id) DO NOTHING
	`
	_, err := p.db.ExecContext(ctx, query, competitionID, userID, levelID, invitedBy)
	if err != nil {
		return fmt.Errorf("failed to invite judge: %w", err)
	}
	return nil
}

// AcceptJudgeInvitation - ยอมรับคำเชิญเป็นกรรมการ
func (p *PostgresKlonDB) AcceptJudgeInvitation(ctx context.Context, judgeID int) error {
	query := `UPDATE judges SET status = 'accepted' WHERE judge_id = $1`
	_, err := p.db.ExecContext(ctx, query, judgeID)
	if err != nil {
		return fmt.Errorf("failed to accept judge invitation: %w", err)
	}
	return nil
}

// RemoveCompetitionJudge - ลบกรรมการออกจากการประกวด
func (p *PostgresKlonDB) RemoveCompetitionJudge(ctx context.Context, judgeID int) error {
	query := `DELETE FROM judges WHERE judge_id = $1`
	_, err := p.db.ExecContext(ctx, query, judgeID)
	if err != nil {
		return fmt.Errorf("failed to remove judge: %w", err)
	}
	return nil
}
