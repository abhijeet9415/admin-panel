package main

import (
	"fmt"
)

func main() {
	// r := mux.NewRouter()

	// //serve static file frontend
	// fs := http.FileServer(http.Dir("frontend"))
	// r.PathPrefix("/").Handler(fs)

	// // Proxy requests to User Service
	// userServiceURL, _ := url.Parse("http://localhost:8002")
	// proxy := httputil.NewSingleHostReverseProxy(userServiceURL)
	// r.PathPrefix("/api/users").Handler(proxy)

	//server running
	fmt.Println("Admin Panel running on port 8000....")
	// log.Fatal(http.ListenAndServe(":8000", r))

}
