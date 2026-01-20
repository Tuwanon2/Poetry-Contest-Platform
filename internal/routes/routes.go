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

    // Auth
    v1.POST("/auth/login", kh.Login)
    v1.POST("/auth/logout", kh.Logout)

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
    v1.POST("/contests/:id/judges", kh.AddJudge)
    v1.DELETE("/judges/:judgeId", kh.RemoveJudge)
    v1.POST("/contests/:id/assistants", kh.InviteAssistant)
    v1.GET("/contests/:id/submissions", kh.ListSubmissions)
    v1.GET("/contests/:id/progress", kh.ContestProgress)
    v1.POST("/contests/:id/results", kh.PostResults)

    // Judge-specific routes
    v1.GET("/invitations", kh.ListInvitations)
    v1.POST("/invitations/:id/accept", kh.AcceptInvitation)
    v1.GET("/judge/contests", kh.JudgeContests)
    v1.GET("/judge/contests/:id/submissions", kh.JudgeContestSubmissions)
    v1.GET("/judge/submissions/:id", kh.OpenSubmissionForJudge)
    v1.POST("/submissions/:id/score", kh.ScoreSubmission)
    v1.POST("/submissions/:id/comment", kh.CommentSubmission)
    v1.GET("/judge/contests/:id/summary", kh.JudgeContestSummary)
}
