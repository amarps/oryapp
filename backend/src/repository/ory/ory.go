package ory

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"oryapp/src/model"
	"os"
	"time"

	"xorm.io/xorm"
)

type (
	Password struct {
		Type        string   `json:"type"`
		Identifiers []string `json:"identifiers"`
		Version     int      `json:"version"`
		Created_at  string   `json:"created_at"`
		Updated_at  string   `json:"updated_at"`
	}

	Webauthn struct {
		Type        string   `json:"type"`
		Identifiers []string `json:"identifiers"`
		Version     int      `json:"version"`
		Created_at  string   `json:"created_at"`
		Updated_at  string   `json:"updated_at"`
	}

	Credentials struct {
		Password Password `json:"password"`
		Webauthn Webauthn `json:"webauthn"`
	}

	Traits struct {
		Email    string `json:"email"`
		Username string `json:"username"`
	}

	OryRegisterResponse struct {
		Id               string      `json:"id"`
		Credentials      Credentials `json:"credentials"`
		Schema_id        string      `json:"schema_id"`
		Schema_url       string      `json:"schema_url"`
		State            string      `json:"state"`
		State_changed_at string      `json:"state_changed_at"`
		Traits           Traits      `json:"traits"`
		Created_at       string      `json:"created_at"`
		Updated_at       string      `json:"updated_at"`
	}
)

func RegisterUser(db *xorm.Engine, id string) (OryRegisterResponse, error) {

	url := fmt.Sprint(os.Getenv("ORY_SDK_URL"), "/admin/identities/", id)
	method := "GET"

	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)

	if err != nil {
		fmt.Println(err)
		return OryRegisterResponse{}, err
	}
	req.Header.Add("Authorization", fmt.Sprint("Bearer ", os.Getenv("ORY_ACCESS_TOKEN")))

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return OryRegisterResponse{}, err
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return OryRegisterResponse{}, errors.New("ory failed to register user")
	}

	var oryRegResp OryRegisterResponse
	err = json.NewDecoder(res.Body).Decode(&oryRegResp)
	if err != nil {
		return oryRegResp, err
	}

	now := time.Now()
	registerUser := model.User{
		Id:           oryRegResp.Id,
		Email:        oryRegResp.Traits.Email,
		Username:     oryRegResp.Traits.Username,
		RegisteredAt: &now,
		UpdatedAt:    &time.Time{},
	}

	_, err = db.Insert(registerUser)
	if err != nil {
		if err.Error() == `pq: duplicate key value violates unique constraint "user_pkey"` {
			return oryRegResp, errors.New("user is already registered")
		}
		return oryRegResp, err
	}

	return oryRegResp, nil
}
