package model

import "time"

type User struct {
	Id           string     `json:"id,,omitempty" xorm:"pk varchar(255) notnull unique 'id'"`
	Email        string     `json:"email,,omitempty" xorm:"varchar(255) notnull unique 'email'"`
	Password     string     `json:"password,,omitempty" xorm:"varchar(255) notnull 'password'"`
	FirstName    string     `json:"first_name,,omitempty" xorm:"varchar(255) notnull 'first_name'"`
	LastName     string     `json:"last_name,,omitempty" xorm:"varchar(255) notnull 'last_name'"`
	RegisteredAt *time.Time `json:"registered_at,,omitempty" xorm:"timestamp 'registered_at'"`
	UpdatedAt    *time.Time `json:"updated_at,,omitempty" xorm:"timestamp 'updated_at'"`
}
