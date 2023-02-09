package router

import (
	"net/http"
	"oryapp/app"
	"oryapp/src/router/handler"

	"github.com/go-chi/chi"
)

type router struct {
	httpRouter *chi.Mux
}

func New(app *app.App) *router {
	return &router{
		httpRouter: initRouter(app),
	}
}

func (r *router) Router() *chi.Mux {
	return r.httpRouter
}

func initRouter(app *app.App) *chi.Mux {
	var (
		router = chi.NewRouter()
		h      = handler.InitHandler(app)
	)

	router.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	router.Post("/register/{id}", h.RegisterUser)
	router.Post("/query", h.Query)

	return router
}
