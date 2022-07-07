from flask import Flask, jsonify, request
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost/pythonreactdb"
mongo = PyMongo(app)

CORS(app)

db = mongo.db.users

@app.route("/users", methods=["POST"])
def createUser():
  result = db.insert_one({
    "name": request.json["name"],
    "email": request.json["email"],
    "password": request.json["password"]
  })
  id = result.inserted_id
  return jsonify(str(ObjectId(id)))

@app.route("/users", methods=["GET"])
def getUsers():
  users = []
  for doc in db.find():
    users.append({
      '_id': str(ObjectId(doc["_id"])),
      "name": doc["name"],
      "email": doc["email"],
      "password": doc["password"]
    })
  return jsonify(users)

@app.route("/user/<id>", methods=["GET"])
def getUser(id):
  user = db.find_one({'_id': ObjectId(id)})
  print(user)
  return jsonify({
    '_id': str(ObjectId(user["_id"])),
    "name": user["name"], 
    "email": user["email"],
    "password": user["password"]
  })

@app.route("/users/<id>", methods=["DELETE"])
def deleteUser(id):
  db.delete_one({'_id': ObjectId(id)})
  return jsonify({"message": "User deleted successfully"})

@app.route("/users/<id>", methods=["PUT"])
def updateUser(id):
  db.update_one({'_id': ObjectId(id)}, {
    "$set": {
      "name": request.json["name"],
      "email": request.json["email"],
      "password": request.json["password"]
    }
  })
  return jsonify({"message": "User updated successfully"})

if __name__ == "__main__":
  app.run(debug=True)