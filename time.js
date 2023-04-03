const clock = document.getElementById("clock")
let today = new Date()
let millisecondsUTC;

//all time-related functions
function getCurrentTime(today) {

  hours = today.getHours() 
  minutes = today.getMinutes() 
  seconds = today.getSeconds()

  millisecondsUTC = Date.now()

}
function scaleToGameTime() {
  const timeScale = 20
  let timeDiff = (Date.now() - millisecondsUTC)*timeScale;
  formatTimeDiff(timeDiff)
}

function formatTimeDiff(timediff) {
  //1 hour = 3 600 000 ms, 1 minute = 60 000ms, 1 second = 1000ms
  let diffminutes = timediff/60000
  let diffseconds = timediff/60000


  console.log(diffhours)
  minutes = Math.floor(minutes+ diffminutes) < 60 ? Math.floor(minutes+ diffminutes) : 0
  seconds = Math.floor(seconds + diffseconds) < 60? Math.floor (seconds + diffseconds) : 0

  if (minutes == 0)
    hours = hours < 24? ++hours : 0;

}

function setClockText() {
  const hoursText = hours < 10 ? `0${hours}` : `${hours}`
  const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`
  clock.textContent = hoursText+":"+minutesText+":"+secondsText


}

//update internal/game clock
setInterval(()=> {
  scaleToGameTime()
  setClockText()
},1000)
