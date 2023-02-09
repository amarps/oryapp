package handler

type (
	BaseRequest struct {
	}

	RegisterResponse struct {
		Message string `json:"message"`
	}

	Where struct {
		Identifier string `json:"identifier"`
		Sign       string `json:"sign"`
		Value      string `json:"value"`
	}

	QueryRequest struct {
		Table   string   `json:"table"`
		Columns []string `json:"columns"`
		Where   []Where  `json:"where"`
	}
)
