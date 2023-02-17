package app

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"xorm.io/xorm"
)

type (
	App struct {
		db     *xorm.Engine
		router *chi.Mux
	}
)

func New() *App {
	err := godotenv.Load("../.env")
	if err != nil {
		panic(err)
	}

	return &App{
		db:     initXorm(),
		router: initChi(),
	}
}

func initXorm() *xorm.Engine {
	db, err := xorm.NewEngine("postgres", "postgresql://oryapp:oryapp@localhost:5432/oryapp?sslmode=disable")
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	return db
}

func initChi() *chi.Mux {
	var router = chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		// ExposedHeaders:   []string{"Link"},
		// AllowCredentials: false,
		// MaxAge:           300,
	}))

	return router
}

func (app *App) Db() *xorm.Engine {
	return app.db
}

func (app *App) Router() *chi.Mux {
	return app.router
}

func (app *App) Run() error {
	var port = "8000" // viper.GetString("APP_PORT")
	var host = "0.0.0.0:" + port
	return http.ListenAndServe(host, app.router)
}
