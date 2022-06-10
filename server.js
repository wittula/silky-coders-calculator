const express = require("express");
const bodyParser = require("body-parser");
//import { createClient } from '@supabase/supabase-js'
const supabase = require("@supabase/supabase-js");
const Celsius = require("./units/Celsius");
const Fahrenheit = require("./units/Fahrenheit");
const Kelvin = require("./units/Kelvin");
const cors = require("cors");
const { inputValidation } = require("./validation.js");

const app = express();
app.use(bodyParser.json());

const supabaseConn = supabase.createClient(
  "https://wiflelveeszmhaoknpuc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZmxlbHZlZXN6bWhhb2tucHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ4ODEyMzksImV4cCI6MTk3MDQ1NzIzOX0.rpJ6e1VXjh70mnNYK1ZKusO8w8gbSwp8wYw2mOk9riE"
);
app.use(cors());

// const sendRecord = async() => {
//   const {data: newRecord} = await supabaseConn
//   .from('calculator-history')
//   .insert({input: "123", output: "321"})
//   console.log(newRecord)
//   return{
//     newRecord: newRecord
//   }
//   }

// sendRecord();

app.use(express.static(__dirname + "/views"));
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/api/calc", inputValidation, (req, res) => {
  console.log(req.body.value, req.body.tempFrom, req.body.tempTo);

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

  res.status(200).json({
    inputString: inputString,
    outputString: outputString,
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.post(
//   "/",
//   urlencodedParser,
//   [
//     check("inputValue", "Value must be a number!").exists().isNumeric(),
//     check("tempTo", "Selected temperature units can't be the same!").custom(
//       (value, { req }) => value != req.body.tempFrom
//     ),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       // return res.status(422).jsonp(errors.array());

//       const alert = errors.array();
//       res.render("index", {
//         alert,
//       });
//     } else {
//       const numberInput = Number(req.body.inputValue);

//       let temperatureInput;
//       let temperatureOutput;

//       switch (req.body.tempFrom) {
//         case "c":
//           temperatureInput = new Celsius(numberInput);
//           break;

//         case "f":
//           temperatureInput = new Fahrenheit(numberInput);
//           break;

//         case "k":
//           temperatureInput = new Kelvin(numberInput);
//           break;
//       }

//       switch (req.body.tempTo) {
//         case "c":
//           temperatureOutput = new Celsius(temperatureInput.toCelsius());
//           break;

//         case "f":
//           temperatureOutput = new Fahrenheit(temperatureInput.toFahrenheit());
//           break;

//         case "k":
//           temperatureOutput = new Kelvin(temperatureInput.toKelvin());
//           break;
//       }

//       const inputString = temperatureInput.toString();
//       const outputString = temperatureOutput.toString();

//       res.render("index", {
//         inputString,
//         outputString,
//       });
//     }
//   }
// );

app.listen(process.env.PORT || 5000);
