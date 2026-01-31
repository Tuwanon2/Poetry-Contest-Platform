// config.go

package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	AppPort          string
	DatabaseHost     string
	DatabasePort     int
	DatabaseUser     string
	DatabasePassword string
	DatabaseName     string
	DatabaseSSLMode  string
	DatabaseURL      string // เพิ่ม field สำหรับ DATABASE_URL
}

func LoadConfig() (Config, error) {
	// viper.SetEnvPrefix("POSTGRES")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Set default values
	viper.SetDefault("POSTGRES.HOST", "localhost")
	viper.SetDefault("POSTGRES.PORT", 5432)
	viper.SetDefault("POSTGRES.USER", "postgres")
	viper.SetDefault("POSTGRES.PASSWORD", "")
	viper.SetDefault("POSTGRES.DBNAME", "klon")
	viper.SetDefault("POSTGRES.SSLMODE", "disable")

	// Set config values
	dbURL := viper.GetString("DATABASE_URL")
	if dbURL == "" {
		dbURL = os.Getenv("DATABASE_URL")
	}
	config := Config{
		AppPort:          viper.GetString("APP_PORT"),
		DatabaseHost:     viper.GetString("POSTGRES_HOST"),
		DatabasePort:     viper.GetInt("POSTGRES_PORT"),
		DatabaseUser:     viper.GetString("POSTGRES_USER"),
		DatabasePassword: viper.GetString("POSTGRES_PASSWORD"),
		DatabaseName:     viper.GetString("POSTGRES_DBNAME"),
		DatabaseSSLMode:  viper.GetString("POSTGRES_SSLMODE"),
		DatabaseURL:      dbURL,
	}

	return config, nil
}

func (c *Config) GetConnectionString() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.DatabaseHost,
		c.DatabasePort,
		c.DatabaseUser,
		c.DatabasePassword,
		c.DatabaseName,
		c.DatabaseSSLMode)
}
