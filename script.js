let resultCard = document.createElement("DIV");
resultCard.classList.add("card", "text-white", "mb-3");

let resultPercent = document.createElement("DIV");
resultPercent.id = "percent";
resultPercent.className = "card-header";

let resultMessage = document.createElement("DIV");
resultMessage.id = "message";
resultMessage.className = "card-body";

const brideName = document.getElementById("bname");
const groomName = document.getElementById("gname");
const error = document.getElementById("error");

function setError(msg) {
  error.innerText = msg;
}

function renderResult(result) {
  document.getElementById("result").innerHTML = "";
  if (result.percentage >= 51) {
    resultCard.classList.remove("bg-primary");
    resultCard.classList.add("bg-success");
  } else if (result.percentage <= 50) {
    resultCard.classList.remove("bg-success");
    resultCard.classList.add("bg-primary");
  }
  resultPercent.innerText = `${result.percentage}%`;
  resultMessage.innerHTML = `<h5 class="card-title">${result.result}</h5>`;
  resultCard.append(resultPercent, resultMessage);
  document.getElementById("result").appendChild(resultCard);
}

function calculate() {
  if (brideName.value === "" || groomName.value === "") {
    setError("Name field cannot be empty!!!");
  } else {
    fetch(
      `https://love-calculator.p.rapidapi.com/getPercentage?sname=${bname.value.trim()}&fname=${gname.value.trim()}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "love-calculator.p.rapidapi.com",
          "x-rapidapi-key": "bca5fef741msha20a0b8b597d93dp14afdbjsnc0eed58ec116"
        }
      }
    )
      .then((response) => response.json())
      .then((result) => renderResult(result))
      .catch((err) => {
        console.error(err);
      });
  }
}