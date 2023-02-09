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
	req.Header.Add("Authorization", "Bearer ory_pat_uajYEhCzo0HQZU3SQoiwHSHwS912BRkp")
	req.Header.Add("Cookie", "__cfruid=10ebd9e6630a64193968b216cf7c3e9a1ec54de6-1675711653; __cflb=0pg1SWCwbQFdoVU5oSEaJ3UvKCi76Hf8mv5wuJLj; csrf_token_ffc79f0a1e684531513fd850f0c5cb3297fee0f63647bb3b89ed1c40dad16e17=GQdO8fkCP6n8k3UCyaoXPPqiWCttu+Thvwdng79/G6A=")

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
		FirstName:    oryRegResp.Traits.Username,
		LastName:     "",
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
