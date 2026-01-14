package klon

import (
    "context"
    "fmt"
    "time"
)

// --- Auth & User related DB methods ---
func (p *PostgresKlonDB) GetUserByID(ctx context.Context, id int) (User, error) {
    var u User
    err := p.db.QueryRowContext(ctx, `SELECT user_id, username, full_name, email, role, created_at FROM users WHERE user_id=$1`, id).Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt)
    if err != nil {
        return User{}, err
    }
    return u, nil
}

func (p *PostgresKlonDB) CreateUser(ctx context.Context, user User) (User, error) {
    var id int
    err := p.db.QueryRowContext(ctx, `INSERT INTO users (username,password_hash,full_name,email,role) VALUES ($1,$2,$3,$4,$5) RETURNING user_id`, user.Username, user.Password, user.FullName, user.Email, user.Role).Scan(&id)
    if err != nil {
        return User{}, fmt.Errorf("failed to create user: %w", err)
    }
    user.ID = id
    user.CreatedAt = time.Now()
    return user, nil
}

func (p *PostgresKlonDB) ListUsers(ctx context.Context) ([]User, error) {
    rows, err := p.db.QueryContext(ctx, `
        SELECT user_id, username, full_name, email, role, created_at
        FROM users
        ORDER BY user_id
        LIMIT 100
    `)
    if err != nil {
        return nil, fmt.Errorf("failed to query users: %w", err)
    }
    defer rows.Close()

    users := make([]User, 0)
    for rows.Next() {
        var u User
        if err := rows.Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt); err != nil {
            return nil, fmt.Errorf("failed to scan user row: %w", err)
        }
        users = append(users, u)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("rows error: %w", err)
    }
    return users, nil
}

func (p *PostgresKlonDB) SearchUsersByEmail(ctx context.Context, email string) ([]User, error) {
    rows, err := p.db.QueryContext(ctx, `
        SELECT user_id, username, full_name, email, role, created_at
        FROM users
        WHERE email ILIKE $1
        ORDER BY user_id
        LIMIT 10
    `, "%"+email+"%")
    if err != nil {
        return nil, fmt.Errorf("failed to search users by email: %w", err)
    }
    defer rows.Close()

    users := make([]User, 0)
    for rows.Next() {
        var u User
        if err := rows.Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt); err != nil {
            return nil, fmt.Errorf("failed to scan user row: %w", err)
        }
        users = append(users, u)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("rows error: %w", err)
    }
    return users, nil
}

func (p *PostgresKlonDB) Register(ctx context.Context, user User, password string) (User, error) {
    var id int
    err := p.db.QueryRowContext(ctx, `
        INSERT INTO users (username,password_hash,full_name,email,role)
        VALUES ($1,$2,$3,$4,$5) RETURNING user_id
    `, user.Username, password, user.FullName, user.Email, user.Role).Scan(&id)
    if err != nil {
        return User{}, fmt.Errorf("failed to register user: %w", err)
    }
    user.ID = id
    return user, nil
}

func (p *PostgresKlonDB) Login(ctx context.Context, username, password string) (User, error) {
    var u User
    err := p.db.QueryRowContext(ctx, `SELECT user_id, username, full_name, email, role, created_at FROM users WHERE (username=$1 OR email=$1) AND password_hash=$2`, username, password).Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt)
    if err != nil {
        return User{}, fmt.Errorf("login failed: %w", err)
    }
    return u, nil
}

func (p *PostgresKlonDB) Logout(ctx context.Context, userID int) error { return nil }

func (p *PostgresKlonDB) GetProfile(ctx context.Context, userID int) (User, error) {
    var u User
    err := p.db.QueryRowContext(ctx, `SELECT user_id, username, full_name, email, role, created_at FROM users WHERE user_id=$1`, userID).Scan(&u.ID, &u.Username, &u.FullName, &u.Email, &u.Role, &u.CreatedAt)
    if err != nil {
        return User{}, err
    }
    return u, nil
}

func (p *PostgresKlonDB) UpdateProfile(ctx context.Context, userID int, updates map[string]interface{}) (User, error) {
    if full, ok := updates["full_name"].(string); ok {
        if _, err := p.db.ExecContext(ctx, `UPDATE users SET full_name=$1 WHERE user_id=$2`, full, userID); err != nil {
            return User{}, err
        }
    }
    if email, ok := updates["email"].(string); ok {
        if _, err := p.db.ExecContext(ctx, `UPDATE users SET email=$1 WHERE user_id=$2`, email, userID); err != nil {
            return User{}, err
        }
    }
    return p.GetProfile(ctx, userID)
}
