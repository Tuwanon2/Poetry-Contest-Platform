package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "productproject/internal/klon"
)

// Invite judge to a contest for a specific level
func (h *KlonHandlers) InviteJudge(c *gin.Context) {
    contestID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid contest id"})
        return
    }

    var req struct {
        UserID    int `json:"user_id" binding:"required"`
        LevelID   int `json:"level_id" binding:"required"`
        InvitedBy int `json:"invited_by" binding:"required"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    judge := klon.Judge{
        UserID:       req.UserID,
        CompetitionID: contestID,
        LevelID:      req.LevelID,
        Status:       "pending",
        InvitedBy:    req.InvitedBy,
    }

    created, err := h.db.CreateJudge(c.Request.Context(), judge)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, created)
}

// ListJudgeInvitations - Get pending judge invitations from judges table
func (h *KlonHandlers) ListJudgeInvitations(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    invs, err := h.db.ListJudgeInvitations(c.Request.Context(), uid)
    if err != nil { 
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return 
    }
    c.JSON(http.StatusOK, invs)
}

// AcceptJudgeInvitation - Accept a judge invitation (update status)
func (h *KlonHandlers) AcceptJudgeInvitation(c *gin.Context) {
    judgeID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid judge id"})
        return
    }

    err = h.db.AcceptJudgeInvitation(c.Request.Context(), judgeID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Invitation accepted"})
}

// RejectJudgeInvitation - Reject a judge invitation (update status)
func (h *KlonHandlers) RejectJudgeInvitation(c *gin.Context) {
    judgeID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid judge id"})
        return
    }

    err = h.db.RejectJudgeInvitation(c.Request.Context(), judgeID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Invitation rejected"})
}

func (h *KlonHandlers) ListInvitations(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    invs, err := h.db.ListInvitations(c.Request.Context(), uid)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, invs)
}

func (h *KlonHandlers) AcceptInvitation(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.AcceptInvitation(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusOK)
}

func (h *KlonHandlers) JudgeContests(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    cs, err := h.db.ListJudgeContests(c.Request.Context(), uid)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, cs)
}

func (h *KlonHandlers) JudgeContestSubmissions(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    cid, _ := strconv.Atoi(c.Param("id"))
    subs, err := h.db.ListJudgeContestSubmissions(c.Request.Context(), uid, cid)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, subs)
}

func (h *KlonHandlers) OpenSubmissionForJudge(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    w, err := h.db.GetSubmission(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, w)
}

func (h *KlonHandlers) ScoreSubmission(c *gin.Context) {
    wid, _ := strconv.Atoi(c.Param("id"))
    var req struct{ JudgeID int `json:"judge_id"`; Score float64 `json:"score"`; Comment string `json:"comment"` }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    s := klon.Score{JudgeID: req.JudgeID, WorkID: wid, Score: req.Score, Comment: req.Comment}
    sc, err := h.db.AddScore(c.Request.Context(), s)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, sc)
}

func (h *KlonHandlers) CommentSubmission(c *gin.Context) {
    wid, _ := strconv.Atoi(c.Param("id"))
    var req struct{ JudgeID int `json:"judge_id"`; Content string `json:"content"` }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    cm := klon.Comment{WorkID: wid, JudgeID: req.JudgeID, Content: req.Content}
    created, err := h.db.AddComment(c.Request.Context(), cm)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, created)
}

func (h *KlonHandlers) JudgeContestSummary(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    cid, _ := strconv.Atoi(c.Param("id"))
    out, err := h.db.GetJudgeSummary(c.Request.Context(), uid, cid)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, out)
}
