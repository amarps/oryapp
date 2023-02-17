package handler

import (
	"context"
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

func GetColumnsName(db *xorm.Engine) ([]string, error) {
	rows, err := db.DB().QueryContext(context.Background(), `
	SELECT column_name
		FROM information_schema.columns
   	WHERE table_schema = 'public'
		AND table_name = 'user';
	`)
	if err != nil {
		return []string{}, err
	}
	defer rows.Close()

	columns := []string{}
	for rows.Next() {
		var column string
		err = rows.Scan(&column)
		if err != nil {
			return columns, err
		}
		columns = append(columns, column)
	}

	return columns, nil
}
