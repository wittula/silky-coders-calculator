class Fahrenheit {
  constructor(x) {
    if (typeof x !== "number")
      throw new Error(`Expected input to be a number, received ${typeof x}!`);
    this.value = x;
  }

  // F to C
  toCelsius() {
    const outputValue = ((this.value - 32) * 5) / 9;
    return Math.round(outputValue * 100) / 100;
  }

  // F to K
  toKelvin() {
    const outputValue = ((this.value - 32) * 5) / 9 + 273.15;
    return Math.round(outputValue * 100) / 100;
  }

  toString() {
    return `${String(this.value)}°F`;
  }
}

module.exports = Fahrenheit;
