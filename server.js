const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Celsius = require("./units/Celsius");
const Fahrenheit = require("./units/Fahrenheit");
const Kelvin = require("./units/Kelvin");

const { check, validationResult } = require("express-validator");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", (req, res) => {
  res.render("index");
});

app.post(
  "/",
  urlencodedParser,
  [
    check("inputValue", "Value must be a number!").exists().isNumeric(),
    check("tempTo", "Selected temperature units can't be the same!").custom(
      (value, { req }) => value != req.body.tempFrom
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array());

      const alert = errors.array();
      res.render("index", {
        alert,
      });
    } else {
      const numberInput = Number(req.body.inputValue);

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

      res.render("index", {
        inputString,
        outputString,
      });
    }
  }
);

app.listen(process.env.PORT || 5000);
