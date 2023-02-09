package main

import (
	"oryapp/app"
	"oryapp/src/model"
	"oryapp/src/router"
)

func main() {
	m := app.New()
	model.Sync(m)
	r := router.New(m)
	m.Router().Mount("/", r.Router())
	m.Run()
}
