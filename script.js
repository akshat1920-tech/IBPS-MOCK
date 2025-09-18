const questions = [
  {
    question: "When the digits of a two-digit number get interchanged, the number thus formed becomes 6 less than the 200% of the original number. Find the original number, if the sum of both the digits is 6.",
    options: ["35", "24", "26", "30", "40"],
    answer: "24"
  },
  {
    question: "The following numbers form a series. Find the odd one out: 421, 405, 382, 343, 291, 226",
    options: ["382", "405", "291", "226", "421"],
    answer: "382"
  },
  {
    question: "The following numbers form a series. Find the odd one out: 24, 29, 39, 56, 80, 119",
    options: ["29", "56", "119", "80", "39"],
    answer: "29"
  }
];

let currentQuestion = 0;
let userAnswers = Array(questions.length).fill(null);
let markedQuestions = [];

const questionPanel = document.getElementById("question-panel");
const navigationPanel = document.getElementById("navigation-panel");
const markedPanel = document.getElementById("marked-panel");

function renderQuestion(index) {
  const q = questions[index];
  questionPanel.innerHTML = `<p><b>Q${index+1}:</b> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    const checked = userAnswers[index] === opt ? "checked" : "";
    questionPanel.innerHTML += `
      <div>
        <input type="radio" name="option" value="${opt}" id="opt${i}" ${checked}>
        <label for="opt${i}">${opt}</label>
      </div>
    `;
  });
}

function renderNavigation() {
  navigationPanel.innerHTML = "";
  markedPanel.innerHTML = "";
  questions.forEach((_, i) => {
    const btn = document.createElement("div");
    btn.classList.add("nav-btn");
    if (markedQuestions.includes(i)) btn.classList.add("marked");
    btn.innerText = i+1;
    btn.addEventListener("click", () => {
      saveAnswer();
      currentQuestion = i;
      renderQuestion(currentQuestion);
      renderNavigation();
    });
    navigationPanel.appendChild(btn);

    // Marked panel
    if (markedQuestions.includes(i)) {
      const mbtn = document.createElement("div");
      mbtn.classList.add("nav-btn","marked");
      mbtn.innerText = i+1;
      mbtn.addEventListener("click", () => {
        saveAnswer();
        currentQuestion = i;
        renderQuestion(currentQuestion);
        renderNavigation();
      });
      markedPanel.appendChild(mbtn);
    }
  });
}

function saveAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  if(selected) userAnswers[currentQuestion] = selected.value;
}

document.getElementById("next-btn").addEventListener("click", () => {
  saveAnswer();
  if(currentQuestion < questions.length-1) currentQuestion++;
  renderQuestion(currentQuestion);
  renderNavigation();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  saveAnswer();
  if(currentQuestion > 0) currentQuestion--;
  renderQuestion(currentQuestion);
  renderNavigation();
});

document.getElementById("mark-btn").addEventListener("click", () => {
  if(!markedQuestions.includes(currentQuestion)) markedQuestions.push(currentQuestion);
  else markedQuestions = markedQuestions.filter(i => i !== currentQuestion);
  renderNavigation();
});

document.getElementById("submit-btn").addEventListener("click", () => {
  saveAnswer();
  let score = 0;
  questionPanel.innerHTML = "";
  navigationPanel.innerHTML = "";
  markedPanel.innerHTML = "";

  questions.forEach((q,i) => {
    const userAns = userAnswers[i];
    let div = document.createElement("div");
    div.innerHTML = `<p><b>Q${i+1}:</b> ${q.question}</p>`;
    q.options.forEach(opt => {
      const span = document.createElement("div");
      span.innerText = opt;
      if(opt === q.answer) span.classList.add("correct");
      if(userAns === opt && userAns !== q.answer) span.classList.add("wrong");
      div.appendChild(span);
    });
    questionPanel.appendChild(div);
    if(userAns === q.answer) score++;
  });

  document.getElementById("result").innerText = `Your score: ${score} / ${questions.length}`;
});

// Timer
function startTimer(duration, display) {
  let timer = duration, minutes, seconds;
  const interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0"+minutes : minutes;
    seconds = seconds < 10 ? "0"+seconds : seconds;
    display.textContent = `Time Left: ${minutes}:${seconds}`;
    if(--timer < 0) {
      clearInterval(interval);
      document.getElementById("submit-btn").click();
      alert("Time's up! Test submitted automatically.");
    }
  }, 1000);
}

window.onload = () => {
  renderQuestion(currentQuestion);
  renderNavigation();
  const fifteenMinutes = 60 * 15;
  const display = document.getElementById("timer");
  startTimer(fifteenMinutes, display);
}
