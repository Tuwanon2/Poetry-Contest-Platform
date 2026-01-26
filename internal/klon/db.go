package klon

import (
    "context"
    "database/sql"
    "fmt"
    _ "github.com/lib/pq"
    "time"
)

type PostgresKlonDB struct {
    db *sql.DB
}

func NewPostgresKlonDB(connStr string) (*PostgresKlonDB, error) {
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, fmt.Errorf("failed to open klon db: %v", err)
    }
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(10)
    db.SetConnMaxLifetime(5 * time.Minute)

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := db.PingContext(ctx); err != nil {
        return nil, fmt.Errorf("failed to ping klon db: %v", err)
    }
    return &PostgresKlonDB{db: db}, nil
}

func (p *PostgresKlonDB) Close() error {
    if p.db == nil {
        return nil
    }
    return p.db.Close()
}

func (p *PostgresKlonDB) Ping() error {
    if p.db == nil {
        return fmt.Errorf("db not initialized")
    }
    return p.db.Ping()
}
// GetDB returns the underlying *sql.DB for direct queries
func (p *PostgresKlonDB) GetDB() *sql.DB {
    return p.db
}