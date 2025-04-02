package main

import (
	"admin-panel/database"
	// "admin-panel/users"
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
	users.InitUserDB() // Ensure this function is correctly imported

	// Get PORT from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable not set")
	}

	// Debug: Print the PORT variable
	fmt.Println("Using PORT:", port)

	// Create Router
	r := mux.NewRouter()
	users.SetupRoutes(r) // Ensure this function is correctly imported

	// Enabling CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}).Handler(r)

	// Start the server with the assigned PORT
	log.Println("User Service running on port", port)
	err := http.ListenAndServe("0.0.0.0:"+port, corsHandler) // 🚀 Bind to 0.0.0.0 instead of localhost
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}