//!INIT 
// Initial Give the ring a color
const FULL_DASH_ARRAY = 283;

var COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: intCountdownTimeThresholdarning
  },
  alert: {
    color: "red",
    threshold: intCountdownTimeThresholdAlert
  }
};

// Variablen

//! INIT VARIABLES
var intCountdownUserinput = 0;
var intPomodoroBreakTime = 0;
var intPomodoroSession = 1;
var intCountdownRandomMin = 5;
var intCountdownRandomMax = 6;

var intCountdownTimePassed = 0;
var intCountdownTimeThresholdarning = 0;
var intCountdownTimeThresholdAlert = 0;
var intCountdownTimeLimit = intCountdownUserinput;

var stringStatePlaypause = "pause";

let timeLeft = intCountdownTimeLimit;
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

// Init: Create Timer Ring
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


// Init: Dont show on init Session Label
document.getElementById("base-session-label").classList.add('base-session__label__display');

//! Buttons

// Startbutton
function button_start() {
  console.log ("Input Button Start pressed")
  func_core_setcountdownsettings();
}

// Stopbutton
function button_stop() {
  console.log ("Input Button Stop pressed")
  stop();
  if (timeLeft == 0) {
    func_core_pomodoro_session_number(1);
  }
}

// Button Pause / Play
function button_pauseplay() {
  if (stringStatePlaypause == "play") {
    console.log ("Input Button Pause pressed");
    func_core_button_pressed_pauseplay ("play");
    console.log("button_pauseplay hat func_core_button_pressed_pauseplay mit pause aufgerufen");
  } else if (stringStatePlaypause == "pause") {
    console.log ("Input Button Play pressed");
    func_core_button_pressed_pauseplay ("pause");
    console.log("button_pauseplay hat func_core_button_pressed_pauseplay mit play aufgerufen");
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

// Toogle Randomtimer
function toogle_randomtimer() {
  randomtimer = document.getElementById('toogle_randomtimer').checked;
  func_core_countdown_random();
}

//! Inputs

// Input Integer Countdown
function input_int_countdown(button) {
  if (button == "+") {
    intCountdownUserinput = parseInt(document.getElementById('input_int_countdown').value) + 1;
  } else if (button == "-") {
    intCountdownUserinput = parseInt(document.getElementById('input_int_countdown').value) - 1;
  } else {
    intCountdownUserinput = parseInt(document.getElementById('input_int_countdown').value)
  }
  console.log('Fomularfeld input_int_countdown neuer Countdown mit: ' + intCountdownUserinput);
}

// Input Integer Countdown Random Max
function input_int_countdown_random_max(button) {
  if (button == "+") {
    intCountdownRandomMax = parseInt(document.getElementById('input_int_countdown_random_max').value) + 1;
  } else if (button == "-") {
    intCountdownRandomMax = parseInt(document.getElementById('input_int_countdown_random_max').value) - 1;
  } else {
    intCountdownRandomMax = parseInt(document.getElementById('input_int_countdown_random_max').value);
  }
  console.log('Fomularfeld input_int_countdown_random_max neuer Countdown Max mit: ' + intCountdownRandomMax);
}

// Input Integer Countdown Random Min
function input_int_countdown_random_min(button) {
  if (button == "+") {
    intCountdownRandomMin = parseInt(document.getElementById('input_int_countdown_random_min').value) + 1;
  } else if (button == "-") {
    intCountdownRandomMin = parseInt(document.getElementById('input_int_countdown_random_min').value) - 1;
  } else {
    intCountdownRandomMin = parseInt(document.getElementById('input_int_countdown_random_min').value);
  }
  console.log('Fomularfeld input_int_countdown_random_max neuer Countdown Min mit: ' + intCountdownRandomMin);
}

// Input Integer Pomodoro Breaks
function input_int_pomodoro_breaks(button) {
  if (button == "+") {
    intPomodoroBreakTime = parseInt(document.getElementById('input_int_pomodoro_breaks').value) + 1;
  } else if (button == "-") {
    intPomodoroBreakTime = parseInt(document.getElementById('input_int_pomodoro_breaks').value) - 1;
  } else {
    intPomodoroBreakTime = parseInt(document.getElementById('input_int_pomodoro_breaks').value);
  }
  console.log('Fomularfeld input_int_pomodoro_breaktimes neuer Break mit: ' + intPomodoroBreakTime);
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

//! HTML Manipulations

// HTML Manipulation - Toogle Pause Play Button
function htmlmanipulation_button_play(htmlmanipulationButtonPlayToogle) {
  if (htmlmanipulationButtonPlayToogle == "pause") {
    document.getElementById("button_pauseplay").innerHTML = "Pause";
  } else if (htmlmanipulationButtonPlayToogle == "play") {
    document.getElementById("button_pauseplay").innerHTML = "Play";
  }
  console.log("Function htmlmanipulation_button_play aufgerufen")
}

// HTML Manipulation - Change Pomodoro Session Number
function htmlmanipulation_pomodoro_session_number (NewNumber) {
  document.getElementById("base-session-label").innerHTML = "Session " + NewNumber;
}

// HTML Manupulation - Open/Close Menu
function htmlmanipulation_settingsMenu(toogle) {
  if (toogle == "open") {
    document.getElementById("myNav").style.width = "100%";
    $("#settingsmenu").show();
  } else if (toogle == "close") {
    document.getElementById("myNav").style.width = "0%";
    $("#settingsmenu").hide();
  }
}

//! Core Functions

//  Function Start Countdown
function func_core_setcountdownsettings() {
  console.log("Function Start ausgeführt");
  //* Vorhandene Beeps löschen mittels Funktion
  func_core_beep("clear");
  if (intCountdownUserinput > 0) {
    // Verhalten ausführen wenn User Input 0 ist.
    console.log("Startfunction hat geprüft ob intCountdownUserinput > 0 ist")
    func_core_button_pressed_pauseplay ("pause");
    setRestartPathColor();
    clearInterval(timerInterval);
    if (hidetimer == false) {
      intCountdownTimeLimit = intCountdownUserinput;
    } else {
      intCountdownTimeLimit = 7;
    }
    intCountdownTimeThresholdarning = intCountdownUserinput * 0.5;
    intCountdownTimeThresholdAlert = intCountdownUserinput * 0.25;
    COLOR_CODES = {
      info: {
        color: "green"
      },
      warning: {
        color: "orange",
        threshold: intCountdownTimeThresholdarning
      },
      alert: {
        color: "red",
        threshold: intCountdownTimeThresholdAlert
      }
    };
    intCountdownTimePassed = 0;
    timeLeft = intCountdownTimeLimit;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    func_core_start_countdown();
  }
}

// Function Core Start Timer
function func_core_start_countdown() {
  if (intCountdownUserinput > 0) {
    if (randomtimer == true) {
      func_core_countdown_random();
      starter();
    } else {
      starter();
    }
    if (hidetimer == true) {
      intCountdownTimePassed = intCountdownTimePassed - intCountdownUserinput + timeLeft;
    }
  }

  
  function starter() {
    timerInterval = setInterval(() => {
      intCountdownTimePassed = intCountdownTimePassed += 1;
      timeLeft = intCountdownTimeLimit - intCountdownTimePassed;
      document.getElementById("base-timer-label").innerHTML = formatTime(
        timeLeft
      );
      setCircleDasharray();
      setRemainingPathColor(timeLeft);
      if (timeLeft === 0) {
        func_core_countdown_onTimesUp();
      }
      if (timeLeft == 5) {
        if (hidetimer == true) {
          func_core_beep("start");
        }
      }

    }, 1000);
  }
}

// Function Action for Play/Pause Button
function func_core_button_pressed_pauseplay(funcCoreButtonPressedPauseplayToogle) {
  console.log ("Core Function func_core_button_pressed_pauseplay aufgerufen");
  if (funcCoreButtonPressedPauseplayToogle == "play") {
    stringStatePlaypause = "pause";
    console.log ("Core Function func_core_button_pressed_pauseplay changed stringStatePlaypause to play");
    htmlmanipulation_button_play("play");
    console.log("func_core_button_pressed_pauseplay hat htmlmanipulation_button_play mit pause aufgerufen");
    clearInterval(timerInterval);
    console.log ("Core Function func_core_button_pressed_pauseplay cleared timerInterval");
  } else if (funcCoreButtonPressedPauseplayToogle == "pause") {
    stringStatePlaypause = "play";
    console.log ("Core Function func_core_button_pressed_pauseplay changed stringStatePlaypause to pause");
    htmlmanipulation_button_play("pause");
    console.log("func_core_button_pressed_pauseplay hat htmlmanipulation_button_play mit play aufgerufen");
    clearInterval(timerInterval);
    console.log ("Core Function func_core_button_pressed_pauseplay cleared timerInterval");
    func_core_start_countdown();
    console.log ("Core Function func_core_button_pressed_pauseplay used function startTimer");
  }
}

// Function Core Sound Beep
function func_core_beep(funcCoreBeepToogle) {
  if (funcCoreBeepToogle == "start") {
    if (sound == true) {
      let i = 0;
      var audio = document.getElementById('timerAudio');
      audio.play();
      beepInterval = setInterval(function () {
        i++;
        if (autorestart == true && hidetimer == false) {
          clearInterval(beepInterval);
        } else {
          if (i >= 4) {
            clearInterval(beepInterval);
          }
        }
        audio.play();
        console.log("beep")
      }, 1000);
    }
  }
  else if (funcCoreBeepToogle == "clear") {
    clearInterval(beepInterval);
    console.log ("Function Clear Beep ausgeführt")
  }
}

// Function Core Change Pomodoro Session Number
function func_core_pomodoro_session_number (corePomodorSessionNumberMathRule) {
  if (corePomodorSessionNumberMathRule == "-") {
    intPomodoroSession--;
    htmlmanipulation_pomodoro_session_number(intPomodoroSession);
  } else if (corePomodorSessionNumberMathRule == "+") {
    intPomodoroSession++;
    htmlmanipulation_pomodoro_session_number(intPomodoroSession);
  } else if (corePomodorSessionNumberMathRule.isInteger = true) {
    intPomodoroSession = corePomodorSessionNumberMathRule;
    htmlmanipulation_pomodoro_session_number(intPomodoroSession);
  }
}

// Function Core Rand Countdown
function func_core_countdown_random() {
  intCountdownUserinput = Math.floor(Math.random() * (intCountdownRandomMax - intCountdownRandomMin + 1)) + intCountdownRandomMin;
  console.log(intCountdownUserinput);
}

// Function Core Countdown TimesUp
function func_core_countdown_onTimesUp() {
  clearInterval(timerInterval);
  if (autorestart == true) {
    stop();
    func_core_setcountdownsettings();
  }
  if (hidetimer == false) {
    func_core_beep("clear");
    func_core_beep("start");
  }
  if (pomodorotimer == true) {
    func_core_pomodoro_session_number("+");
  };
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
  const rawTimeFraction = timeLeft / intCountdownTimeLimit;
  return rawTimeFraction - (1 / intCountdownTimeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function stop() {
  func_core_button_pressed_pauseplay ("play");
  clearInterval(beepInterval);
  clearInterval(timerInterval);
  if (timeLeft >= 1) {
    intCountdownTimeLimit = 1;
    intCountdownTimePassed = 0;
    timeLeft = intCountdownTimeLimit;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    func_core_start_countdown();
  } else {
    setRestartPathColor();
    func_core_pomodoro_session_number(1);
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

$('.btn-plus, .btn-minus').on('click', function (e) {
  const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
  const input = $(e.target).closest('.input-group').find('input');
  if (input.is('input')) {
    input[0][isNegative ? 'stepDown' : 'stepUp']()
  }
})