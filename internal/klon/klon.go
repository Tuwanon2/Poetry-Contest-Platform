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
	OrganizerID int       `json:"organizer_id,omitempty"`
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
	ListUsers(ctx context.Context) ([]User, error)
	// Auth
	Register(ctx context.Context, user User, password string) (User, error)
	Login(ctx context.Context, username, password string) (User, error)
	Logout(ctx context.Context, userID int) error
	// Contests
	ListContests(ctx context.Context) ([]Competition, error)
	GetContestByID(ctx context.Context, id int) (Competition, error)
	SearchContests(ctx context.Context, q string) ([]Competition, error)
	// Results
	GetResults(ctx context.Context, contestID int) ([]map[string]interface{}, error)
	// Submissions / works
	CreateSubmission(ctx context.Context, userID int, contestID int, title, content string) (Work, error)
	GetSubmission(ctx context.Context, workID int) (Work, error)
	UpdateSubmission(ctx context.Context, workID int, title, content string) (Work, error)
	DeleteSubmission(ctx context.Context, workID int) error
	GetSubmissionStatus(ctx context.Context, workID int) (map[string]interface{}, error)
	// Profile
	GetProfile(ctx context.Context, userID int) (User, error)
	UpdateProfile(ctx context.Context, userID int, updates map[string]interface{}) (User, error)
	// Competition
	GetCompetitionByID(ctx context.Context, id int) (Competition, error)
	ListCompetitions(ctx context.Context) ([]Competition, error)
	CreateCompetition(ctx context.Context, comp Competition) (Competition, error)
	UpdateCompetition(ctx context.Context, id int, comp Competition) (Competition, error)
	DeleteCompetition(ctx context.Context, id int) error
	MyContests(ctx context.Context, userID int) ([]Competition, error)
	OpenContest(ctx context.Context, id int) error
	CloseContest(ctx context.Context, id int) error
	AddCoOrganizer(ctx context.Context, competitionID int, userID int) (int, error)
	RemoveCoOrganizer(ctx context.Context, coOrganizerID int) error
	RemoveJudge(ctx context.Context, judgeID int) error
	ListSubmissionsForContest(ctx context.Context, competitionID int) ([]Work, error)
	ContestProgress(ctx context.Context, competitionID int) (map[string]int, error)
	PostResults(ctx context.Context, competitionID int) error
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

	// Invitations & comments (judge workflows)
	ListInvitations(ctx context.Context, userID int) ([]Invitation, error)
	AcceptInvitation(ctx context.Context, invitationID int) error
	ListJudgeContests(ctx context.Context, userID int) ([]Competition, error)
	ListJudgeContestSubmissions(ctx context.Context, userID int, competitionID int) ([]Work, error)
	AddComment(ctx context.Context, comment Comment) (Comment, error)
	GetJudgeSummary(ctx context.Context, userID int, competitionID int) (map[string]interface{}, error)
}

// Invitation represents an invitation sent to a user to be a judge
type Invitation struct {
    ID            int       `json:"id"`
    CompetitionID int       `json:"competition_id"`
    FromUserID    int       `json:"from_user_id"`
    ToUserID      int       `json:"to_user_id"`
    Status        string    `json:"status"`
    CreatedAt     time.Time `json:"created_at"`
}

// Comment represents a comment left by a judge on a work
type Comment struct {
    ID        int       `json:"id"`
    WorkID    int       `json:"work_id"`
    JudgeID   int       `json:"judge_id"`
    Content   string    `json:"content"`
    CreatedAt time.Time `json:"created_at"`
}
