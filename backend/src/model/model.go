package model

import "oryapp/app"

func Sync(app *app.App) {
	err := app.Db().Sync2(new(User))
	if err != nil {
		panic(err)
	}
}
