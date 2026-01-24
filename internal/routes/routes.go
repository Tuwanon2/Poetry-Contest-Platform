package routes

import (
    "github.com/gin-gonic/gin"
    "productproject/internal/handlers"
)

// Register registers all API v1 routes using the provided router group and handlers.
func Register(v1 *gin.RouterGroup, kh *handlers.KlonHandlers) {
    // Users
    v1.GET("/users", kh.ListUsers)
    v1.GET("/users/:id", kh.GetUser)
    v1.POST("/users", kh.CreateUser)
    v1.GET("/users/search", kh.SearchUsersByEmail)

    // Contests / public
    v1.GET("/contests", kh.ListContests)
    v1.GET("/contests/:id", kh.GetContest)
    v1.GET("/contests/search", kh.SearchContests)
    v1.GET("/results/:contestId", kh.GetResults)
    
    // Competitions (alias routes for frontend compatibility)
    v1.GET("/competitions", kh.ListContests)
    v1.GET("/competitions/:id", kh.GetContest)
    v1.POST("/competitions", kh.CreateContest)
    v1.PUT("/competitions/:id", kh.UpdateContest)
    v1.DELETE("/competitions/:id", kh.DeleteContest)
    v1.GET("/competitions/:id/submissions", kh.ListSubmissions)
    v1.GET("/competitions/:id/levels", kh.GetCompetitionLevels)

    // Auth
    v1.POST("/auth/login", kh.Login)
    v1.POST("/auth/logout", kh.Logout)
    v1.POST("/auth/google-login", kh.GoogleLogin)

    // Uploads
    v1.POST("/upload", kh.UploadPoster)

    // Submission (Public - สมัครเข้าประกวด)
    v1.POST("/submissions", kh.CreateSubmission)
    v1.GET("/submission/:id", kh.GetSubmission)
    v1.PUT("/submission/:id", kh.UpdateSubmission)
    v1.DELETE("/submission/:id", kh.DeleteSubmission)
    v1.GET("/submission/:id/status", kh.GetSubmissionStatus)
    v1.GET("/submissions/user/:userId", kh.GetUserSubmissions)

    // Profile
    v1.GET("/profile", kh.GetProfile)
    v1.PUT("/profile", kh.UpdateProfile)

    // Manager / organizer routes
    v1.POST("/contests", kh.CreateContest)
    v1.PUT("/contests/:id", kh.UpdateContest)
    v1.DELETE("/contests/:id", kh.DeleteContest)
    v1.GET("/my/contests", kh.MyContests)
    v1.POST("/contests/:id/open", kh.OpenContest)
    v1.POST("/contests/:id/close", kh.CloseContest)
    v1.POST("/contests/:id/co-organizers", kh.AddCoOrganizer)
    v1.DELETE("/coorganizers/:id", kh.RemoveCoOrganizer)
    v1.GET("/contests/:id/submissions", kh.ListSubmissions)
    v1.GET("/contests/:id/progress", kh.ContestProgress)
    v1.POST("/contests/:id/results", kh.PostResults)

    // Judge-specific routes
    v1.GET("/invitations", kh.ListInvitations)
    v1.POST("/invitations/:id/accept", kh.AcceptInvitation)
    v1.GET("/judge/invitations", kh.ListJudgeInvitations)
    v1.POST("/judge/invitations/:id/accept", kh.AcceptJudgeInvitation)
    v1.POST("/judge/invitations/:id/reject", kh.RejectJudgeInvitation)
    v1.GET("/judge/contests", kh.JudgeContests)
    v1.GET("/judge/contests/:id/submissions", kh.JudgeContestSubmissions)
    v1.GET("/judge/submissions/:id", kh.OpenSubmissionForJudge)
    v1.POST("/submissions/:id/score", kh.ScoreSubmission)
    v1.POST("/submissions/:id/comment", kh.CommentSubmission)
    v1.GET("/judge/contests/:id/summary", kh.JudgeContestSummary)

    // Organizations routes
    v1.GET("/organizations/user/:userId", kh.GetUserOrganizations)
    v1.POST("/organizations", kh.CreateOrganization)
    v1.GET("/organizations/:id", kh.GetOrganization)
    v1.GET("/organizations/:id/members", kh.GetOrganizationMembers)
    v1.GET("/organizations/:id/competitions", kh.GetOrganizationCompetitions)
    v1.POST("/organizations/:id/invite", kh.InviteMember)
    v1.PUT("/organizations/members/:memberId/accept", kh.AcceptOrganizationInvitation)
    v1.DELETE("/organizations/members/:memberId/reject", kh.RejectOrganizationInvitation)

    // Organization Assistants (ผู้ช่วยระดับ org - role='assistant')
    v1.GET("/organizations/:id/assistants", kh.GetOrganizationAssistants)
    v1.POST("/organizations/:id/assistants", kh.InviteOrganizationAssistant)
    v1.PUT("/organizations/members/:memberId/permissions", kh.UpdateAssistantPermissions)

    // Competition Judges (กรรมการระดับการประกวด)
    v1.GET("/contests/:id/judges", kh.GetCompetitionJudges)
    v1.POST("/contests/:id/judges", kh.InviteJudge)
    v1.DELETE("/contests/judges/:judgeId", kh.RemoveCompetitionJudge)

    // Admin routes
    v1.GET("/admin/organizations/pending", kh.GetPendingOrganizations)
    v1.PUT("/admin/organizations/:id/status", kh.UpdateOrganizationStatus)
}
