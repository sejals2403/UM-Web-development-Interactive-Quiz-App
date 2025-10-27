const quizData = [
  {id:1,topic:"Geography",question:"Which is the largest ocean on Earth?",options:["Atlantic Ocean","Indian Ocean","Pacific Ocean","Arctic Ocean"],answer:2,hint:"It borders the west coast of the Americas and the east coast of Asia."},
  {id:2,topic:"Science",question:"What is the chemical symbol for water?",options:["H2O","O2","CO2","HO2"],answer:0,hint:"It has two hydrogen atoms and one oxygen atom."},
  {id:3,topic:"Technology",question:"Which language is primarily used for styling web pages?",options:["JavaScript","Python","C++","CSS"],answer:3,hint:"It's not used for logic, but for appearances."},
  {id:4,topic:"Sports",question:"In which sport is the 'term nutmeg' commonly used?",options:["Tennis","Football (Soccer)","Basketball","Cricket"],answer:1,hint:"It refers to passing the ball between an opponent's legs."},
  {id:5,topic:"Entertainment",question:"Which of these is a famous film director?",options:["Serena Williams","Christopher Nolan","Ada Lovelace","Marie Curie"],answer:1,hint:"He directed 'Inception' and 'Interstellar'."}
];

const quizContainer = document.getElementById('quizContainer');
const quizForm = document.getElementById('quizForm');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const submitBtn = document.getElementById('submitBtn');
const timerDisplay = document.getElementById('timerDisplay');
const durationInput = document.getElementById('duration');
const resultEl = document.getElementById('result');

let duration = 120, remaining = duration, timerId = null, started = false;

function formatTime(sec) {
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function renderQuiz() {
  quizContainer.innerHTML = '';
  quizData.forEach((q,idx) => {
    const qEl = document.createElement('section');
    qEl.className = 'question';
    qEl.setAttribute('data-id', q.id);
    qEl.innerHTML = `
      <div class="q-header">
        <div class="q-index">${idx+1}</div>
        <div class="q-text">${q.question}</div>
      </div>
      <div class="options">
        ${q.options.map((opt,i)=>`<div class="option"><label><input type="radio" name="q${q.id}" value="${i}" /><span>${opt}</span></label></div>`).join('')}
      </div>
      <button type="button" class="showHintBtn" data-qid="${q.id}">Show Hint</button>
      <div class="hint" id="hint-${q.id}">${q.hint}</div>
    `;
    quizContainer.appendChild(qEl);
  });

  document.querySelectorAll('.showHintBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const qid = e.target.getAttribute('data-qid');
      const hintEl = document.getElementById(`hint-${qid}`);
      if(hintEl.style.display === 'block'){
        hintEl.style.display = 'none';
        e.target.textContent = 'Show Hint';
      } else {
        hintEl.style.display = 'block';
        e.target.textContent = 'Hide Hint';
      }
    });
  });
}

function startTimer(){
  if(timerId) clearInterval(timerId);
  remaining = duration;
  timerDisplay.textContent = formatTime(remaining);
  timerId = setInterval(() => {
    remaining--;
    timerDisplay.textContent = formatTime(remaining);
    if(remaining <= 0){
      clearInterval(timerId);
      autoSubmit();
    }
  },1000);
}

function stopTimer(){
  if(timerId) clearInterval(timerId);
  timerId = null;
}

function collectAnswers(){
  const answers = {};
  quizData.forEach(q => {
    const sel = document.querySelector(`input[name="q${q.id}"]:checked`);
    answers[q.id] = sel ? Number(sel.value) : null;
  });
  return answers;
}

function showResults(auto=false){
  const answers = collectAnswers();
  let correctCount = 0;

  quizData.forEach(q => {
    const qSection = document.querySelector(`.question[data-id='${q.id}']`);
    qSection.classList.remove('correct','incorrect');
    const selected = answers[q.id];
    if(selected === q.answer){
      correctCount++;
      qSection.classList.add('correct');
    } else {
      qSection.classList.add('incorrect');
    }
  });

  quizForm.classList.add('hidden');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<h2>Results</h2><p class="result-badge">${correctCount} / ${quizData.length} correct</p>`;

  restartBtn.classList.remove('hidden');
  stopTimer();
  started = false;
}

function autoSubmit(){ showResults(true); }

startBtn.addEventListener('click', () => {
  duration = Math.max(30, parseInt(durationInput.value)||120);
  renderQuiz();
  quizForm.classList.remove('hidden');
  resultEl.classList.add('hidden');
  restartBtn.classList.add('hidden');
  startTimer();
  started = true;
});

submitBtn.addEventListener('click', () => { showResults(false); });
restartBtn.addEventListener('click', () => {
  renderQuiz();
  quizForm.classList.remove('hidden');
  resultEl.classList.add('hidden');
  restartBtn.classList.add('hidden');
  startTimer();
  started = true;
});

timerDisplay.textContent = formatTime(Number(durationInput.value||120));
renderQuiz();
