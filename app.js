const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
const URI = process.env.mongo_url;
const connectDB = async () => {
  await mongoose.connect(
    URI,
    { useUnifiedTopology: true },
    { useNewUrlParser: true },
    { useUnifiedTopology: true },
    { useFindAndModify: false },
    { useCreateIndex: true }
  );
  console.log("connected");
};
connectDB();
app.use(cors());
var sensorDataSchema = mongoose.Schema(
  {
     dateTime: String,
     temp: String,
     humidity: String,
     co2: String,
     nh3:String,
     hardwareID: String,
     mac: String
  },
  { collection: "devicetest" }
);
const sensor = mongoose.model("devicetest", sensorDataSchema);

app.get("/all", function (req, res) {
  console.log("sent");
  sensor.find({}, function (err, sendata) {
    if (err) {
      console.log(err);
    } else {
      res.json(sendata);
    }
  });
});

app.get("/id", function (req, res) {
  sensor.distinct("mac", function (err, sendata) {
    if (err) {
      console.log(err);
    } else {
      res.json(sendata);
    }
  });
});

app.post("/getone", function (req, res) {
  const id = req.body.id;
  console.log(id);
  sensor.find({ mac: id }, function (err, sendata) {
    if (err) {
      console.log(err);
    } else {
      res.json(sendata);
    }
  });
});

app.post("/putdata", function (req, res) {
  
  const data = req.body.data;

    sensor.create(data);
    res.send("sent");
  }

);

app.listen(process.env.PORT || 9000);
