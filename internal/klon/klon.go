package klon

import (
	"context"
	"time"
)

// User represents a user in the system
type User struct {
	ID       int       `json:"id"`
	Username string    `json:"username"`
	Password string    `json:"-"`
	FullName string    `json:"full_name"`
	Email    string    `json:"email"`
	Role     string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

// Competition represents a poem competition
type Competition struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Type        string    `json:"type"`
	StartDate   string    `json:"start_date"`
	EndDate     string    `json:"end_date"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

// Applicant represents a user's application to a competition
type Applicant struct {
	ID             int       `json:"id"`
	UserID         int       `json:"user_id"`
	CompetitionID  int       `json:"competition_id"`
	AppliedAt      time.Time `json:"applied_at"`
}

// Work represents a poem submitted to a competition
type Work struct {
	ID          int       `json:"id"`
	ApplicantID int       `json:"applicant_id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	SubmittedAt time.Time `json:"submitted_at"`
}

// Judge represents a judge assigned to a competition
type Judge struct {
	ID            int       `json:"id"`
	UserID        int       `json:"user_id"`
	CompetitionID int       `json:"competition_id"`
	AssignedAt    time.Time `json:"assigned_at"`
}

// Score represents a score given by a judge to a work
type Score struct {
	ID      int       `json:"id"`
	JudgeID int       `json:"judge_id"`
	WorkID  int       `json:"work_id"`
	Score   float64   `json:"score"`
	Comment string    `json:"comment"`
	ScoredAt time.Time `json:"scored_at"`
}

// KlonDatabase is the interface for klon DB operations
// (implementations to be added)
type KlonDatabase interface {
	// User
	GetUserByID(ctx context.Context, id int) (User, error)
	CreateUser(ctx context.Context, user User) (User, error)
	// Competition
	GetCompetitionByID(ctx context.Context, id int) (Competition, error)
	ListCompetitions(ctx context.Context) ([]Competition, error)
	CreateCompetition(ctx context.Context, comp Competition) (Competition, error)
	// Applicant
	ApplyCompetition(ctx context.Context, applicant Applicant) (Applicant, error)
	ListApplicants(ctx context.Context, competitionID int) ([]Applicant, error)
	// Work
	SubmitWork(ctx context.Context, work Work) (Work, error)
	ListWorks(ctx context.Context, competitionID int) ([]Work, error)
	// Judge
	AssignJudge(ctx context.Context, judge Judge) (Judge, error)
	ListJudges(ctx context.Context, competitionID int) ([]Judge, error)
	// Score
	AddScore(ctx context.Context, score Score) (Score, error)
	ListScores(ctx context.Context, workID int) ([]Score, error)
}
