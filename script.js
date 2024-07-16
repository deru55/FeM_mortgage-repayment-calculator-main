const amount = document.getElementById("mAmount-input");
const term = document.getElementById("mTerm-input");
const interestRate = document.getElementById("mInterestRate-input");
const formElements = document.querySelectorAll("[data-type=form-element]");
const formInputsNumber = document.querySelectorAll(
  "input[data-type=form-element][type=text]"
);
const formInputsRadio = document.querySelectorAll(
  "input[data-type=form-element][type=radio]"
);
const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");
const homeState = document.getElementById("home-state");
const resultsState = document.getElementById("results-state");

resetBtn.addEventListener("click", () => {
  amount.value = "";
  term.value = "";
  interestRate.value = "";
  const errorMsgs = document.querySelectorAll(".invalid-msg");
  errorMsgs.forEach((item) => {
    item.textContent = "";
  });
  formInputsNumber.forEach((item) => {
    item.parentElement.classList.remove("clr-error");
  });
  showHomeState();
});

calculateBtn.addEventListener("click", () => {
  let isFormValid = true;

  formElements.forEach((item) => {
    if (item.validity.valueMissing) {
      isFormValid = false;
      showHomeState();
      showError(item, "This field is required");
    }
  });

  if (isFormValid && document.getElementById("rd1").checked)
    calculateFunction();
});

const resetInvalidMsg = (item) => {
  item.addEventListener("input", () => {
    const invalidMsg = document.getElementById(`invalid-msg--${item.id}`);

    invalidMsg.textContent = "";
    item.parentElement.classList.remove("clr-error");
  });
};

const preventKeyPress = (item) => {
  const allowedCharsRegex = /[0-9\.]+/;
  const justNumbersRegex = /[0-9]+/;
  item.addEventListener("keypress", (e) => {
    if (item.id === "mTerm-input" && !justNumbersRegex.test(e.key)) {
      e.preventDefault();
    } else {
      if (!allowedCharsRegex.test(e.key)) {
        e.preventDefault();
      }
    }
  });
};

const formatNoCommas = (item) => {
  return item.value.replace(/[,\s]/g, "");
};

const matchRegex = (item) => {
  let givenNumber = formatNoCommas(item);
  let regex = /(\d+)?(\.\d*)?/;
  return givenNumber.match(regex);
};

const formatToCurrency = (item) => {
  item.addEventListener("input", (e) => {
    let match = matchRegex(item);

    let nfObject = new Intl.NumberFormat("en-GB");
    let output = `${match[1] !== undefined ? nfObject.format(match[1]) : ""}${
      match[2] !== undefined ? match[2] : ""
    }`;

    item.value = output;
  });

  item.addEventListener("change", (e) => {
    let match = matchRegex(item);

    if (match[1] === undefined && /^\./.test(match[2])) {
      let output = `0${match[2]}`;
      item.value = output;
    }
  });
};

formInputsNumber.forEach((item) => {
  resetInvalidMsg(item);
  preventKeyPress(item);
  formatToCurrency(item);
});

formInputsRadio.forEach((item) => {
  item.addEventListener("change", () => {
    const radioButtons = document.querySelectorAll(
      "[data-type=form-element][type=radio]"
    );
    const invalidMsg = document.getElementById(`invalid-msg--${item.name}`);

    invalidMsg.textContent = "";

    for (let radio of radioButtons) {
      if (radio.checked) {
        radio.parentElement.classList.add("checked");
      } else {
        radio.parentElement.classList.remove("checked");
      }
    }
  });
});

const calculateFunction = () => {
  const amountValue = Number(formatNoCommas(amount));
  const termValue = Number(formatNoCommas(term));
  const interestRateValue = Number(formatNoCommas(interestRate));
  const r = interestRateValue / 100 / 12;
  const n = termValue * 12;

  const monthlyPayment = (amountValue * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const totalTerm = monthlyPayment * 12 * termValue;

  showResults(monthlyPayment, totalTerm);
};

const showResults = (monthly, total) => {
  const monthlyRepaymentsSpan = document.getElementById("monthly-repayments");
  const totalTermSpan = document.getElementById("total-term");

  showResultsState();
  if (monthly.toFixed(2).length > 9) {
    monthlyRepaymentsSpan.classList.add("small-fs");
  } else {
    monthlyRepaymentsSpan.classList.remove("small-fs");
  }

  monthlyRepaymentsSpan.textContent =
    "£" + Number(monthly.toFixed(2)).toLocaleString("en-GB");
  totalTermSpan.textContent =
    "£" + Number(total.toFixed(2)).toLocaleString("en-GB");
};

const showError = (item, errorTxt) => {
  if (item.type === "radio") {
    const invalidMsg = document.getElementById(`invalid-msg--${item.name}`);

    invalidMsg.textContent = errorTxt;
  } else {
    const invalidMsg = document.getElementById(`invalid-msg--${item.id}`);

    invalidMsg.textContent = errorTxt;
    item.parentElement.classList.add("clr-error");
  }
};

const showHomeState = () => {
  homeState.classList.remove("hidden");
  resultsState.classList.add("hidden");
};

const showResultsState = () => {
  homeState.classList.add("hidden");
  resultsState.classList.remove("hidden");
};
