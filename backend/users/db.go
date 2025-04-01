
package main
import (
	"admin-panel/database" // Import centralized database package
	"go.mongodb.org/mongo-driver/mongo"
)


var userDB *mongo.Collection
// GetStoreCollection returns the "messages" collection from MongoDB
func InitUserDB (){
	userDB = database.GetCollection("users")
}
