class Celsius {
  constructor(x) {
    if (typeof x !== "number")
      throw new Error(`Expected input to be a number, received ${typeof x}!`);
    this.value = x;
  }

  // C to F
  toFahrenheit() {
    const outputValue = (this.value * 9) / 5 + 32;
    return Math.round(outputValue * 100) / 100;
  }

  // C to K
  toKelvin() {
    const outputValue = this.value + 273.15;
    return Math.round(outputValue * 100) / 100;
  }

  toString() {
    return `${String(this.value)}°C`;
  }
}

module.exports = Celsius;
