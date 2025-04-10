package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRoutes(r *mux.Router) {
	r.HandleFunc("/users/register", RegisterUser).Methods("POST")
	r.HandleFunc("/users/login", LoginUser).Methods("POST")
	r.HandleFunc("/users/update-password", UpdatePassword).Methods("POST")
	r.HandleFunc("/users", GetAllUsers).Methods("GET")
	r.Handle("/users/{id}", AuthMiddleware(http.HandlerFunc(GetUser))).Methods("GET")

}
