package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("secret_key")

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func GenerateToken(email string) (string, error) {
	expirationTime := time.Now().Add(time.Minute * 10) //10 minute login period
	claims := &Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)

}

//validating token

func ValidateToken(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}
	return claims, nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Register User
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Log received data
	fmt.Println("Received user data:", user)

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)
	user.ID = primitive.NewObjectID()

	// Insert into MongoDB
	result, err := userDB.InsertOne(context.TODO(), user)
	if err != nil {
		//  Log the actual MongoDB error
		fmt.Println("MongoDB InsertOne Error:", err)
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	// Log success
	fmt.Println("User inserted with ID:", result.InsertedID)

	// Send success response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// Login User
func LoginUser(w http.ResponseWriter, r *http.Request) {
	var loginData User
	_ = json.NewDecoder(r.Body).Decode(&loginData)

	// Fetch user from DB
	var user User
	err := userDB.FindOne(context.TODO(), bson.M{"email": loginData.Email}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	// Check Password
	if !CheckPasswordHash(loginData.Password, user.Password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Simulating Token
	token, err := GenerateToken(user.Email)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"token":   token,
		"message": "Login successful",
	}
	json.NewEncoder(w).Encode(response)
}

// JWT Middleware
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}

		// Split "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Unauthorized: Invalid token format", http.StatusUnauthorized)
			return
		}

		tokenString := tokenParts[1]
		claims, err := ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		// Store user email in request header for further use
		r.Header.Set("user_email", claims.Email)
		next.ServeHTTP(w, r)
	})
}

// Forget pasword func
func UpdatePassword(w http.ResponseWriter, r *http.Request) {
	var reqData struct {
		Email       string `json:"email"`
		NewPassword string `json:"new_password"`
	}

	// Decode request
	if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if user exists
	var user User
	err := userDB.FindOne(context.TODO(), bson.M{"email": reqData.Email}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Hash new password
	// hashedPwd, err := HashPassword(reqData.NewPassword)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)
	

	// Update password in DB
	update := bson.M{"$set": bson.M{"password": hashedPassword}}
	_, err = userDB.UpdateOne(context.TODO(), bson.M{"email": reqData.Email}, update)
	if err != nil {
		http.Error(w, "Failed to update password", http.StatusInternalServerError)
		return
	}

	// Success
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Password updated successfully",
	})
}

// Fetch User
func GetUser(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from URL path
	vars := mux.Vars(r)
	userID := vars["id"]

	// Convert userID string to MongoDB ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Find user in database
	var user User
	err = userDB.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Return user as JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Get All Users
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	var users []User
	cursor, err := userDB.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var user User
		if err := cursor.Decode(&user); err != nil {
			http.Error(w, "Error decoding user", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	json.NewEncoder(w).Encode(users)
}
