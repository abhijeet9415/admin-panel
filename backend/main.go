package main

import (
	"admin-panel/database"
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

	// Get port from environment variable (Render provides this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8002" // Default for local development
	}

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

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, corsHandler))
}
