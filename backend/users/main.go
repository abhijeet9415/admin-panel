package main

import (
	"admin-panel/database"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Initialize MongoDB connection
	database.ConnectDB()
	InitUserDB() // Initialize user collection

	// Create Router
	r := mux.NewRouter()
	SetupRoutes(r)

	//enabling cors
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all origins (change if needed)
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}).Handler(r)

	log.Println("User Service running on port 8002...")
	log.Fatal(http.ListenAndServe(":8002", corsHandler))
}
