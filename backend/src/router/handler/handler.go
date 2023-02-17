package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"oryapp/app"
	"oryapp/src/repository/ory"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type Handler struct {
	app *app.App
}

func InitHandler(app *app.App) *Handler {
	return &Handler{
		app: app,
	}
}

func (handler *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var userId = chi.URLParam(r, "id")
	_, err := ory.RegisterUser(handler.app.Db(), userId)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, RegisterResponse{Message: err.Error()})
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, RegisterResponse{Message: "User successfully registered"})
}

func (handler *Handler) Query(w http.ResponseWriter, r *http.Request) {
	var data QueryRequest
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, RegisterResponse{Message: err.Error()})
		return
	}

	fmt.Println(data)

	res, err := Query(handler.app.Db(), data)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, RegisterResponse{Message: err.Error()})
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, res)
}

func (handler *Handler) Columns(w http.ResponseWriter, r *http.Request) {
	res, err := GetColumnsName(handler.app.Db())
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, RegisterResponse{Message: err.Error()})
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, res)
}
