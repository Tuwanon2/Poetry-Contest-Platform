package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "productproject/internal/klon"
)

func (h *KlonHandlers) ListContests(c *gin.Context) {
    cs, err := h.db.ListContests(c.Request.Context())
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, cs)
}

func (h *KlonHandlers) GetContest(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    cobj, err := h.db.GetContestByID(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, cobj)
}

func (h *KlonHandlers) SearchContests(c *gin.Context) {
    q := c.Query("q")
    res, err := h.db.SearchContests(c.Request.Context(), q)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, res)
}

func (h *KlonHandlers) GetResults(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("contestId"))
    results, err := h.db.GetResults(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, results)
}

func (h *KlonHandlers) CreateContest(c *gin.Context) {
    var comp klon.Competition
    if err := c.ShouldBindJSON(&comp); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    created, err := h.db.CreateCompetition(c.Request.Context(), comp)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, created)
}

func (h *KlonHandlers) UpdateContest(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var comp klon.Competition
    if err := c.ShouldBindJSON(&comp); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    updated, err := h.db.UpdateCompetition(c.Request.Context(), id, comp)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, updated)
}

func (h *KlonHandlers) DeleteContest(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.DeleteCompetition(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

func (h *KlonHandlers) MyContests(c *gin.Context) {
    uid, _ := strconv.Atoi(c.Query("user_id"))
    cs, err := h.db.MyContests(c.Request.Context(), uid)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, cs)
}

func (h *KlonHandlers) OpenContest(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.OpenContest(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusOK)
}

func (h *KlonHandlers) CloseContest(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.CloseContest(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusOK)
}

func (h *KlonHandlers) AddCoOrganizer(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req struct{ UserID int `json:"user_id"` }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    cid, err := h.db.AddCoOrganizer(c.Request.Context(), id, req.UserID)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, gin.H{"coorganizer_id": cid})
}

func (h *KlonHandlers) RemoveCoOrganizer(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.RemoveCoOrganizer(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

func (h *KlonHandlers) AddJudge(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req struct{ UserID int `json:"user_id"` }
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    j := klon.Judge{UserID: req.UserID, CompetitionID: id}
    assigned, err := h.db.AssignJudge(c.Request.Context(), j)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusCreated, assigned)
}

func (h *KlonHandlers) RemoveJudge(c *gin.Context) {
    judgeID, _ := strconv.Atoi(c.Param("judgeId"))
    if err := h.db.RemoveJudge(c.Request.Context(), judgeID); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

func (h *KlonHandlers) ListSubmissions(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    subs, err := h.db.ListSubmissionsForContest(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, subs)
}

func (h *KlonHandlers) ContestProgress(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    prog, err := h.db.ContestProgress(c.Request.Context(), id)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, prog)
}

func (h *KlonHandlers) PostResults(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.db.PostResults(c.Request.Context(), id); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusOK)
}

func (h *KlonHandlers) InviteAssistant(c *gin.Context) {
    competitionID, _ := strconv.Atoi(c.Param("id"))
    var req struct {
        UserID          int  `json:"user_id"`
        CanView         bool `json:"can_view"`
        CanEdit         bool `json:"can_edit"`
        CanViewScores   bool `json:"can_view_scores"`
        CanAddAssistant bool `json:"can_add_assistant"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    assistant := klon.Assistant{
        UserID:          req.UserID,
        CompetitionID:   competitionID,
        CanView:         req.CanView,
        CanEdit:         req.CanEdit,
        CanViewScores:   req.CanViewScores,
        CanAddAssistant: req.CanAddAssistant,
        Status:          "pending",
    }

    created, err := h.db.InviteAssistant(c.Request.Context(), assistant)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // TODO: Send email notification to the user
    // For now, we just return success
    c.JSON(http.StatusCreated, created)
}

