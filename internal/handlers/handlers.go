package handlers

import "productproject/internal/klon"

type KlonHandlers struct {
    db klon.KlonDatabase
}

func NewKlonHandlers(db klon.KlonDatabase) *KlonHandlers {
    return &KlonHandlers{db: db}
}
