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

// Variablen

//! INIT VARIABLES
var countdown = 0;
var beepInterval = 0;
var pomodorobreaktime = 0;
var pomodorosession = 1;
var randommin = 5;
var randommax = 6;

var timePassed = 0;
var WARNING_THRESHOLD = 0;
var ALERT_THRESHOLD = 0;
var TIME_LIMIT = countdown;

var state = "play";

let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

// Functionstates
var sound = true;
var autorestart = false;
var randomtimer = false;
var hidetimer = false;
var pomodorotimer = false;

//! INITS

// Create Timer Ring
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
  <span id="base-session-label" class="base-session__label">Session 1</span>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

// Dont show on init Session Label
document.getElementById("base-session-label").classList.add('base-session__label__display');

//! Buttons

// Startbutton
function button_start() {
  start();
}

// Stopbutton
function button_stop() {
  stop();
  if (timeLeft == 0) {
    pomodorosession = 1;
    document.getElementById("base-session-label").innerHTML = "Session " + pomodorosession;
  }
}

// Button Pause / Play
function button_pauseplay() {
  if (state === "play") {
    pause();
    state = "pause";
  } else if (state === "pause") {
    play();
    state = "play";
  }
}

//! Inputs

// Input Integer Countdown
function input_int_countdown(button) {
  if (button == "+") {
    countdown = parseInt(document.getElementById('newtimer').value) + 1;
  } else if (button == "-") {
    countdown = parseInt(document.getElementById('newtimer').value) - 1;
  } else {
    countdown = parseInt(document.getElementById('newtimer').value)
  }
  console.log(countdown);
  start();
}

// Input Integer Countdown Random Max
function input_int_countdown_random_max(button) {
  if (button == "+") {
    randommax = parseInt(document.getElementById('max').value) + 1;
  } else if (button == "-") {
    randommax = parseInt(document.getElementById('max').value) - 1;
  } else {
    randommax = parseInt(document.getElementById('max').value);
  }
  console.log(randommax);
}

// Input Integer Countdown Random Min
function input_int_countdown_random_min(button) {
  if (button == "+") {
    randommin = parseInt(document.getElementById('min').value) + 1;
  } else if (button == "-") {
    randommin = parseInt(document.getElementById('min').value) - 1;
  } else {
    randommin = parseInt(document.getElementById('min').value);
  }
  console.log(randommin);
}

//!  Startfunctions




function func_pomodoro() {
  pomodorotimer = document.getElementById('toogle-pomodoro').checked;
  if (pomodorotimer == false) {
    document.getElementById("base-session-label").classList.add('base-session__label__display');
  } else {
    document.getElementById("base-session-label").classList.remove('base-session__label__display');
  }
}

function pomodorobreaks_int(button) {
  if (button == "+") {
    pomodorobreaktime = parseInt(document.getElementById('breaks').value) + 1;
  } else if (button == "-") {
    pomodorobreaktime = parseInt(document.getElementById('breaks').value) - 1;
  } else {
    pomodorobreaktime = parseInt(document.getElementById('breaks').value);
  }
  console.log(pomodorobreaktime);
}

function beep() {
  if (sound == true) {
    let i = 0;
    var audio = document.getElementById('timerAudio');
    audio.play();
    beepInterval = setInterval(function () {
      i++;
      audio.play();
      console.log("beep")
      if (i >= 5) {
        clearInterval(beepInterval);
      }
    }, 1000);
  }
}

function func_autorestart() {
  autorestart = document.getElementById('autorestart').checked;
}

function onTimesUp() {
  clearInterval(timerInterval);
  if (autorestart == true) {
    stop();
    start();
  }
  if (hidetimer == false) {
    beep();
  }
  if (pomodorotimer == true) {
    pomodorosession++;
    document.getElementById("base-session-label").innerHTML = "Session " + pomodorosession;
  };
}

function func_sound() {
  sound = document.getElementById('sound').checked;
}

function func_randomtimer() {
  randinteger();
  randomtimer = document.getElementById('randomtimer').checked;
}

function startTimer() {
  if (countdown > 0) {
    if (randomtimer == true) {
      randinteger();
      starter();
    } else {
      starter();
    }
  }

  function starter() {
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
      if (timeLeft == 5) {
        if (hidetimer == true) {
          beep();
        }
      }

    }, 1000);
  }
}

function randinteger() {
  countdown = Math.floor(Math.random() * (randommax - randommin + 1)) + randommin;
  console.log(countdown);
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
  const {
    alert,
    warning,
    info
  } = COLOR_CODES;
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

function func_hidetimer() {
  hidetimer = document.getElementById('hidetimer').checked;
  if (hidetimer == true) {
    document.getElementById("base-timer-label").classList.add('blure');
  } else {
    document.getElementById("base-timer-label").classList.remove('blure');
  }
}

function pause() {
  clearInterval(timerInterval);
  document.getElementById("button_pauseplay").innerHTML = "Play";
}

function play() {
  clearInterval(timerInterval);
  startTimer();
  document.getElementById("button_pauseplay").innerHTML = "Pause";
}

function start() {
  clearInterval(beep);
  if (countdown > 0) {
    clearInterval(beepInterval);
    state = "play";
    document.getElementById("button_pauseplay").innerHTML = "Pause";
    setRestartPathColor();
    clearInterval(timerInterval);
    if (hidetimer == false) {
      TIME_LIMIT = countdown;
    } else {
      TIME_LIMIT = 7;
    }
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
    if (hidetimer == true) {
      timePassed = timePassed - countdown + timeLeft;
    }
  }
}

function stop() {
  clearInterval(beepInterval);
  state = "pause"
  document.getElementById("button_pauseplay").innerHTML = "Play";
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
  const {
    alert,
    info
  } = COLOR_CODES;
  document
    .getElementById("base-timer-path-remaining")
    .classList.remove(alert.color);
  document
    .getElementById("base-timer-path-remaining")
    .classList.add(info.color);
}

function openNav() {
  document.getElementById("myNav").style.width = "100%";
  $("#settingsmenu").show();
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  $("#settingsmenu").hide();
}


$('.btn-plus, .btn-minus').on('click', function (e) {
  const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
  const input = $(e.target).closest('.input-group').find('input');
  if (input.is('input')) {
    input[0][isNegative ? 'stepDown' : 'stepUp']()
  }
})





///// HIER WEITER MACHEN
if (pomodorotimer == true) {
  pomodorosession = pomodorosession + 1;
  document.getElementById("base-session-label").innerHTML = "Session " + pomodorosession;
  console.log("Test")
}