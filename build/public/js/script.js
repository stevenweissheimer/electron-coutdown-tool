//!INIT 
// Initial Give the ring a color
const FULL_DASH_ARRAY = 283;

var COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: int_countdown_time_threshold_warning
  },
  alert: {
    color: "red",
    threshold: int_countdown_time_threshold_alert
  }
};

// Variablen

//! INIT VARIABLES
var countdown = 0;
var int_pomodoro_break_time = 0;
var int_pomodoro_session = 1;
var int_countdown_random_min = 5;
var int_countdown_random_max = 6;

var int_countdown_time_passed = 0;
var int_countdown_time_threshold_warning = 0;
var int_countdown_time_threshold_alert = 0;
var int_countdown_time_limit = countdown;

var state = "play";

let timeLeft = int_countdown_time_limit;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

// Function init Variables
var beepInterval = 0;

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
  console.log ("Input Button Start pressed")
  start();
}

// Stopbutton
function button_stop() {
  console.log ("Input Button Stop pressed")
  stop();
  if (timeLeft == 0) {
    int_pomodoro_session = 1;
    document.getElementById("base-session-label").innerHTML = "Session " + int_pomodoro_session;
  }
}

// Button Pause / Play
function button_pauseplay() {
  if (state === "play") {
    console.log ("Input Button Pause pressed")
    pause();
    state = "pause";
  } else if (state === "pause") {
    console.log ("Input Button Play pressed")
    play();
    state = "play";
  }
}

//! Toogles

//Toogle Pomodoro
function toogle_pomodoro() {
  pomodorotimer = document.getElementById('toogle_pomodoro').checked;
  classmanipulation_session_label ();
}

// Toogle Sound
function toogle_sound() {
  sound = document.getElementById('toogle_sound').checked;
}

// Tootle Auto Restart
function toogle_autorestart() {
  autorestart = document.getElementById('toogle_autorestart').checked;
}

// Toogle Hidetimer
function toogle_hidetimer() {
  hidetimer = document.getElementById('toogle_hidetimer').checked;
  classmanipulation_timer_label ()
}

//! Inputs

// Input Integer Countdown
function input_int_countdown(button) {
  if (button == "+") {
    countdown = parseInt(document.getElementById('input_int_countdown').value) + 1;
  } else if (button == "-") {
    countdown = parseInt(document.getElementById('input_int_countdown').value) - 1;
  } else {
    countdown = parseInt(document.getElementById('input_int_countdown').value)
  }
  console.log('Fomularfeld input_int_countdown neuer Countdown mit: ' + countdown);
}

// Input Integer Countdown Random Max
function input_int_countdown_random_max(button) {
  if (button == "+") {
    int_countdown_random_max = parseInt(document.getElementById('input_int_countdown_random_max').value) + 1;
  } else if (button == "-") {
    int_countdown_random_max = parseInt(document.getElementById('input_int_countdown_random_max').value) - 1;
  } else {
    int_countdown_random_max = parseInt(document.getElementById('input_int_countdown_random_max').value);
  }
  console.log('Fomularfeld input_int_countdown_random_max neuer Countdown Max mit: ' + int_countdown_random_max);
}

// Input Integer Countdown Random Min
function input_int_countdown_random_min(button) {
  if (button == "+") {
    int_countdown_random_min = parseInt(document.getElementById('input_int_countdown_random_min').value) + 1;
  } else if (button == "-") {
    int_countdown_random_min = parseInt(document.getElementById('input_int_countdown_random_min').value) - 1;
  } else {
    int_countdown_random_min = parseInt(document.getElementById('input_int_countdown_random_min').value);
  }
  console.log('Fomularfeld input_int_countdown_random_max neuer Countdown Min mit: ' + int_countdown_random_min);
}

// Input Integer Pomodoro Breaks
function input_int_pomodoro_breaktimes(button) {
  if (button == "+") {
    int_pomodoro_break_time = parseInt(document.getElementById('input_int_pomodoro_breaktimes').value) + 1;
  } else if (button == "-") {
    int_pomodoro_break_time = parseInt(document.getElementById('input_int_pomodoro_breaktimes').value) - 1;
  } else {
    int_pomodoro_break_time = parseInt(document.getElementById('input_int_pomodoro_breaktimes').value);
  }
  console.log('Fomularfeld input_int_pomodoro_breaktimes neuer Break mit: ' + int_pomodoro_break_time);
}


//! DOM Functions

// Manipulation Class Session Label // Show / Hide Session Label
function classmanipulation_session_label () {
  if (pomodorotimer == false) {
    document.getElementById("base-session-label").classList.add('base-session__label__display');
  } else {
    document.getElementById("base-session-label").classList.remove('base-session__label__display');
  }
}

// Manipulation Class Timer Label // Blue Label
function classmanipulation_timer_label () {
  if (hidetimer == true) {
    document.getElementById("base-timer-label").classList.add('blure');
  } else {
    document.getElementById("base-timer-label").classList.remove('blure');
  }
}

//!  Startfunctions

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
    int_pomodoro_session++;
    document.getElementById("base-session-label").innerHTML = "Session " + int_pomodoro_session;
  };
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
      int_countdown_time_passed = int_countdown_time_passed += 1;
      timeLeft = int_countdown_time_limit - int_countdown_time_passed;
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
  countdown = Math.floor(Math.random() * (int_countdown_random_max - int_countdown_random_min + 1)) + int_countdown_random_min;
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
  const rawTimeFraction = timeLeft / int_countdown_time_limit;
  return rawTimeFraction - (1 / int_countdown_time_limit) * (1 - rawTimeFraction);
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
      int_countdown_time_limit = countdown;
    } else {
      int_countdown_time_limit = 7;
    }
    int_countdown_time_threshold_warning = countdown * 0.5;
    int_countdown_time_threshold_alert = countdown * 0.25;
    COLOR_CODES = {
      info: {
        color: "green"
      },
      warning: {
        color: "orange",
        threshold: int_countdown_time_threshold_warning
      },
      alert: {
        color: "red",
        threshold: int_countdown_time_threshold_alert
      }
    };
    int_countdown_time_passed = 0;
    timeLeft = int_countdown_time_limit;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    startTimer();
    if (hidetimer == true) {
      int_countdown_time_passed = int_countdown_time_passed - countdown + timeLeft;
    }
  }
}

function stop() {
  clearInterval(beepInterval);
  state = "pause"
  document.getElementById("button_pauseplay").innerHTML = "Play";
  clearInterval(timerInterval);
  if (timeLeft >= 3) {
    int_countdown_time_limit = 1;
    int_countdown_time_passed = 0;
    timeLeft = int_countdown_time_limit;
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
  int_pomodoro_session = int_pomodoro_session + 1;
  document.getElementById("base-session-label").innerHTML = "Session " + int_pomodoro_session;
  console.log("Test")
}