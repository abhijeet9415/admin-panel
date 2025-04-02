package main

import (
	"admin-panel/database"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Initialize MongoDB connection
	database.ConnectDB()
	InitUserDB() // Initialize user collection

	// Get PORT from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8002" // Default for local testing
	}

	// Create Router
	r := mux.NewRouter()
	SetupRoutes(r)

	// Enabling CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}).Handler(r)

	log.Println("User Service running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
