package handler

import (
	"fmt"
	"oryapp/src/model"

	"xorm.io/xorm"
)

func Query(db *xorm.Engine, qr QueryRequest) ([]model.User, error) {
	qSession := db.Cols(qr.Columns...)
	for i := 0; i < len(qr.Where); i++ {
		qSession = qSession.Where(
			fmt.Sprintf(
				"%s %s ?",
				qr.Where[i].Identifier,
				qr.Where[i].Sign), qr.Where[i].Value)
	}

	users := []model.User{}
	err := qSession.Find(&users)
	if err != nil {
		return users, nil
	}

	return users, nil
}
