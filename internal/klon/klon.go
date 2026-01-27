package klon

import (
	"context"
	"database/sql"
	"encoding/json"
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
	Purpose     string    `json:"purpose,omitempty"`
	Type        string    `json:"type"`
	StartDate   string    `json:"start_date"`
	EndDate     string    `json:"end_date"`
	Status      string    `json:"status"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	OrganizerID int             `json:"organizer_id,omitempty"`
	OrganizationID int          `json:"organization_id,omitempty"`
	PosterURL   string          `json:"poster_url,omitempty"`
	Levels      json.RawMessage `json:"levels,omitempty"` // JSON per-level details
	RegistrationStart string    `json:"registration_start,omitempty"`
	RegistrationEnd   string    `json:"registration_end,omitempty"`
	MaxScore    int             `json:"max_score,omitempty"`
	Judges      []map[string]interface{} `json:"judges,omitempty"`
	Assistants  []map[string]interface{} `json:"assistants,omitempty"`
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
	LevelID       int       `json:"level_id"`
	Status        string    `json:"status"` // pending, accepted, rejected
	InvitedBy     int       `json:"invited_by,omitempty"`
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
	SearchUsersByEmail(ctx context.Context, email string) ([]User, error)
	// Auth
	Register(ctx context.Context, user User, password string) (User, error)
	Login(ctx context.Context, username, password string) (User, error)
	GoogleLogin(ctx context.Context, email, fullName, googleID string) (User, error)
	Logout(ctx context.Context, userID int) error
	// Contests
	ListContests(ctx context.Context) ([]Competition, error)
	GetContestByID(ctx context.Context, id int) (Competition, error)
	SearchContests(ctx context.Context, q string) ([]Competition, error)
	// Results
	GetResults(ctx context.Context, contestID int) ([]map[string]interface{}, error)
	// Submissions / works
	CreateSubmission(ctx context.Context, competitionID int, userID *int, name, email, phone, levelName, title, poemType, content, document string) (map[string]interface{}, error)
	GetSubmission(ctx context.Context, submissionID int) (map[string]interface{}, error)
	UpdateSubmission(ctx context.Context, submissionID int, title, content string) (map[string]interface{}, error)
	DeleteSubmission(ctx context.Context, submissionID int) error
	GetSubmissionStatus(ctx context.Context, submissionID int) (map[string]interface{}, error)
	GetUserSubmissions(ctx context.Context, userID int) ([]map[string]interface{}, error)
	// Profile
	GetProfile(ctx context.Context, userID int) (User, error)
	UpdateProfile(ctx context.Context, userID int, updates map[string]interface{}) (User, error)
	// Competition
	GetCompetitionByID(ctx context.Context, id int) (Competition, error)
	ListCompetitions(ctx context.Context) ([]Competition, error)
	CreateCompetition(ctx context.Context, comp Competition) (Competition, error)
	UpdateCompetition(ctx context.Context, id int, comp Competition) (Competition, error)
	DeleteCompetition(ctx context.Context, id int) error
	GetCompetitionLevels(ctx context.Context, competitionID int) ([]map[string]interface{}, error)
	MyContests(ctx context.Context, userID int) ([]Competition, error)
	OpenContest(ctx context.Context, id int) error
	CloseContest(ctx context.Context, id int) error
	AddCoOrganizer(ctx context.Context, competitionID int, userID int) (int, error)
	RemoveCoOrganizer(ctx context.Context, coOrganizerID int) error
	RemoveJudge(ctx context.Context, judgeID int) error
	ListSubmissionsForContest(ctx context.Context, competitionID int) ([]map[string]interface{}, error)
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
	ListJudgeInvitations(ctx context.Context, userID int) ([]map[string]interface{}, error)
	AcceptJudgeInvitation(ctx context.Context, judgeID int) error
	RejectJudgeInvitation(ctx context.Context, judgeID int) error
	AcceptInvitation(ctx context.Context, invitationID int) error
	ListJudgeContests(ctx context.Context, userID int) ([]Competition, error)
	ListJudgeContestSubmissions(ctx context.Context, userID int, competitionID int) ([]map[string]interface{}, error)
	AddComment(ctx context.Context, comment Comment) (Comment, error)
	GetJudgeSummary(ctx context.Context, userID int, competitionID int) (map[string]interface{}, error)

	// Organizations
	GetUserOrganizations(ctx context.Context, userID int) ([]OrganizationWithMember, error)
	CreateOrganization(ctx context.Context, org Organization) (Organization, error)
	GetOrganization(ctx context.Context, orgID int) (Organization, error)
	GetOrganizationMembers(ctx context.Context, orgID int) ([]map[string]interface{}, error)
	InviteOrganizationMember(ctx context.Context, organizationID, userID int) error
	UpdateMemberStatus(ctx context.Context, memberID int, status string) error
	DeleteOrganizationMember(ctx context.Context, memberID int) error
	GetCompetitionsByOrganizationID(ctx context.Context, organizationID int) ([]Competition, error)

	// Organization Assistants (รวมใน organization_members แล้ว, role='assistant')
	GetAssistants(ctx context.Context, orgID int) ([]map[string]interface{}, error)
	InviteAssistant(ctx context.Context, organizationID, userID, invitedBy int, canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition bool) error
	UpdateAssistantPermissions(ctx context.Context, memberID int, canView, canEdit, canViewScores, canAddAssistant, canCreateCompetition bool) error
	CheckUserCanCreateCompetition(ctx context.Context, userID, organizationID int) (bool, error)
	
	// Competition Judges (กรรมการระดับการประกวด)
	CreateJudge(ctx context.Context, judge Judge) (Judge, error)
	GetCompetitionJudges(ctx context.Context, competitionID int) ([]map[string]interface{}, error)
	InviteCompetitionJudge(ctx context.Context, competitionID, userID, levelID, invitedBy int) error
	RemoveCompetitionJudge(ctx context.Context, judgeID int) error

	// Submission Scoring (Judge scoring system)
	GetJudgeLevelsForCompetition(ctx context.Context, userID, competitionID int) ([]map[string]interface{}, error)
	GetJudgeSubmissions(ctx context.Context, userID, competitionID, levelID int) ([]map[string]interface{}, error)
	GetSubmissionDetail(ctx context.Context, submissionID int) (map[string]interface{}, error)
	SaveSubmissionScore(ctx context.Context, judgeID, submissionID int, score float64, comment string) error
	SaveSubmissionScoreWithCriteria(ctx context.Context, judgeID, submissionID int, scores interface{}, totalScore float64, comment string) error
	GetSubmissionScore(ctx context.Context, judgeID, submissionID int) (map[string]interface{}, error)

	// Admin - Organizations
	GetPendingOrganizations() ([]PendingOrganization, error)
	UpdateOrganizationStatus(organizationID int, status string) error
	
	// Database access
	GetDB() *sql.DB
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
