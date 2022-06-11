const historyClockButton = document.getElementById("historyClockButton");
const historyCloseButton = document.getElementById("historyCloseButton");
const historyButtonSpan = document.getElementById("historyButtonText");
const tableBody = document.getElementById("tableBody");
const errorDiv = document.getElementById("errorDiv");
const errorWrapper = document.getElementById("errorWrapper");

const historyWindow = document.getElementById("historyWindow");
const isHidden = () => historyWindow.classList.contains("visuallyhidden");

function switchHistoryWindow() {
  if (isHidden()) {
    historyButtonSpan.innerHTML = "Hide history ";
    historyWindow.classList.remove("visuallyhidden");
  } else {
    historyWindow.classList.add("visuallyhidden");
    historyButtonSpan.innerHTML = "Show history ";
  }
}

historyClockButton.addEventListener("click", switchHistoryWindow);
historyCloseButton.addEventListener("click", switchHistoryWindow);

// Fill history table function to avoid code duplicate
function fillTable(historyArray) {
  const tr = document.createElement("tr");
  let dateString =
    historyArray.created_at.substring(0, 10) +
    " " +
    historyArray.created_at.substring(11, 16);

  tableBody.appendChild(tr);
  tr.innerHTML =
    `<td>${historyArray.input}</td>` +
    `<td>${historyArray.output}</td>` +
    `<td>${dateString}</td>`;
}

// Filling history table
fetch("api/history")
  .then((response) => response.json())
  .then((response) => {
    // console.log(response.history.history);

    const historyArray = response.history.history;

    historyArray.forEach((history) => {
      fillTable(history);
    });
  });

// Calculator output
const calcOutput = document.getElementById("calculatorOutput");
const handleSubmit = (e) => {
  e.preventDefault();
  // console.log(e);
  const value = e.target[0].value;
  const tempFrom = e.target[1].value;
  const tempTo = e.target[2].value;

  // console.log(value, tempFrom, tempTo);

  const data = {
    value: value,
    tempFrom: tempFrom,
    tempTo: tempTo,
  };

  const postData = async (data, el) => {
    const response = await fetch("api/calc", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok)
          return res.json().then((text) => {
            errorDiv.classList.remove("visuallyhidden");
            errorWrapper.innerHTML = "";
            el.innerHTML = "";

            // console.log(text.errors[0].msg);

            text.errors.map((error) => {
              const li = document.createElement("li");
              li.innerHTML = error.msg;
              errorWrapper.appendChild(li);
            });

            throw new Error(text);
          });
        else {
          errorWrapper.innerHTML = "";
          errorDiv.classList.add("visuallyhidden");
          return res.json();
        }
      })
      .then((res) => {
        el.innerHTML = res.inputString + " = " + res.outputString;

        tableBody.innerHTML = "";

        res.history.history.map((history) => {
          fillTable(history);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  postData(data, calcOutput);
};
