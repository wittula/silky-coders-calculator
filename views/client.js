const historyClockButton = document.getElementById("historyClockButton");
const historyCloseButton = document.getElementById("historyCloseButton");
const historyButtonSpan = document.getElementById("historyButtonText");

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
