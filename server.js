const express = require("express");
const bodyParser = require("body-parser");
const supabase = require("@supabase/supabase-js");
const Celsius = require("./units/Celsius");
const Fahrenheit = require("./units/Fahrenheit");
const Kelvin = require("./units/Kelvin");
const cors = require("cors");
const { check, body, validationResult } = require("express-validator");

const app = express();
app.use(bodyParser.json());

const supabaseConn = supabase.createClient(
  "https://wiflelveeszmhaoknpuc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZmxlbHZlZXN6bWhhb2tucHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ4ODEyMzksImV4cCI6MTk3MDQ1NzIzOX0.rpJ6e1VXjh70mnNYK1ZKusO8w8gbSwp8wYw2mOk9riE"
);
app.use(cors());

const sendRecord = async (input, output) => {
  const { data: newRecord } = await supabaseConn
    .from("calculator-history")
    .insert({ input: input, output: output });
  console.log(newRecord);
  return {
    newRecord: newRecord,
  };
};

const getHistory = async () => {
  const { data: history } = await supabaseConn
    .from("calculator-history")
    .select("*")
    .limit(20)
    .order("id", { ascending: false });
  console.log(history);
  return {
    history: history,
  };
};

app.use(express.static(__dirname + "/views"));
app.get("/api/history", (req, res) => {
  getHistory().then((result) => {
    res.status(200).json({
      history: result,
    });
  });
});

app.post(
  "/api/calc",
  [
    body("value").exists().isNumeric(),
    body("tempFrom").custom((value, { req }) => {
      if (req.body.tempFrom == req.body.tempTo) {
        throw new Error("Selected temperature units can't be the same!");
      }
      return true;
    }),
  ],
  (req, res) => {
    console.log(req.body.value, req.body.tempFrom, req.body.tempTo);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(errors);

    const numberInput = Number(req.body.value);

    let temperatureInput;
    let temperatureOutput;

    switch (req.body.tempFrom) {
      case "c":
        temperatureInput = new Celsius(numberInput);
        break;

      case "f":
        temperatureInput = new Fahrenheit(numberInput);
        break;

      case "k":
        temperatureInput = new Kelvin(numberInput);
        break;
    }

    switch (req.body.tempTo) {
      case "c":
        temperatureOutput = new Celsius(temperatureInput.toCelsius());
        break;

      case "f":
        temperatureOutput = new Fahrenheit(temperatureInput.toFahrenheit());
        break;

      case "k":
        temperatureOutput = new Kelvin(temperatureInput.toKelvin());
        break;
    }

    const inputString = temperatureInput.toString();
    const outputString = temperatureOutput.toString();
    sendRecord(inputString, outputString);
    getHistory().then((result) => {
      res.status(200).json({
        inputString: inputString,
        outputString: outputString,
        history: result,
      });
    });
  }
);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(process.env.PORT || 5000);
