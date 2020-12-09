
const FULL_DASH_ARRAY = 283;

var COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

var countdown = 0;
var beepInterval = 0;
let state = "play";

var TIME_LIMIT = countdown;
var timePassed = 0;
var WARNING_THRESHOLD = 0;
var ALERT_THRESHOLD = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;


document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

function beep() {
  let i = 0;
  var audio = document.getElementById('timerAudio'); 
  audio.play();
  beepInterval = setInterval(function(){
    i++;
    audio.play();
    if (i === 5) {
      clearInterval(beepInterval);
    }
  }, 1000);
}


function onTimesUp() {
  clearInterval(timerInterval);
  beep();
}

function startTimer() {
    if (countdown > 0) {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
            if (timeLeft === 0) {
            onTimesUp();
            }
        }, 1000);
    }
 }

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


function pause() {
    clearInterval(timerInterval);
    document.getElementById("toogle").innerHTML = "Play";
}

function play () {
    clearInterval(timerInterval);
    startTimer();
    document.getElementById("toogle").innerHTML = "Pause";
}

function toogle() {
    if (state === "play") {
        pause();
        state = "pause";
    } else if (state === "pause") {
        play();
        state = "play";
    }
}

function start() {
    clearInterval(beepInterval);
    state = "play";
    document.getElementById("toogle").innerHTML = "Pause";
    setRestartPathColor();
    clearInterval(timerInterval);
    TIME_LIMIT = countdown;
    WARNING_THRESHOLD = countdown * 0.5;
    ALERT_THRESHOLD = countdown * 0.25;
    COLOR_CODES = {
        info: {
          color: "green"
        },
        warning: {
          color: "orange",
          threshold: WARNING_THRESHOLD
        },
        alert: {
          color: "red",
          threshold: ALERT_THRESHOLD
        }
      };      
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    startTimer();
}

function stop () {
  clearInterval(beepInterval);
    state = "pause"
    document.getElementById("toogle").innerHTML = "Play";   
    clearInterval(timerInterval);
    if (timeLeft >= 3) {
        TIME_LIMIT = 1;
        timePassed = 0;
        timeLeft = TIME_LIMIT;
        timerInterval = null;
        remainingPathColor = COLOR_CODES.info.color;
        startTimer();
    } else {
        setRestartPathColor();
    };
}

function setRestartPathColor() {
    const { alert, info } = COLOR_CODES;
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(alert.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(info.color);
}

function newtime() {
    countdown = parseInt(document.getElementById('newtimer').value)
    console.log(countdown);
    start();
}

$('.btn-plus, .btn-minus').on('click', function(e) {
    const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
    const input = $(e.target).closest('.input-group').find('input');
    if (input.is('input')) {
      input[0][isNegative ? 'stepDown' : 'stepUp']()
    }
  })