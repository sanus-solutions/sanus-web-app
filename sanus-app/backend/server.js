var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cors = require('cors');
var ObjectID = mongodb.ObjectID;

var EMPLOYEES_COLLECTION = "employees";
var CAMERAS_COLLECTION = "cameras";
var MAP_COLLECTION = "map";

var app = express();
app.use(bodyParser.json());
app.use(cors()); 

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://192.168.1.3:27017/daycares", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Employee API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/api/employees"
 *    GET: finds all employees
 */
app.get("/api/employees", function(req, res) {
    db.collection(EMPLOYEES_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get employees.");
        } else {
          res.status(200).json(docs);
        }
    });
});

/*  "/api/locate"
 *   GET: locate last room person was inside by name
 *   Params: staff_id (aka name)
 */

app.get("/api/locate", function(req, res) {
  db.collection(MAP_COLLECTION).findOne({ staff_id: req.query.staff_id }, {sort:{$natural:-1}}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
});