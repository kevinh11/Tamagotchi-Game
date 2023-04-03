
const popup = document.getElementById("popup");
const input = document.getElementById("nameInput")
let petName;

const clock = document.getElementById("clock")
let millisecondsUTC
let canUpdateTime = false
let today

let currentIndex = 0
let musicIdx = 0

let greetingText = document.getElementById("greeting")
const displayImageArray = ["pokemons/pokemon1.png", "shrooms/shroom1.png","golems/golem1.png"]

//time-related functions
function getCurrentTime() {

  hours = today.getHours() 
  minutes = today.getMinutes() 
  seconds = today.getSeconds()
  millisecondsUTC = Date.now()

}

function scaleToGameTime() {
  const timeScale = 100
  let timeDiff = (Date.now() - millisecondsUTC)*timeScale;
  formatTimeDiff(timeDiff)
}

function formatTimeDiff(timediff) {
  //1 hour = 3 600 000 ms, 1 minute = 60 000ms, 1 second = 1000ms
  
  let secondsdiff = timediff/1000
  let minutesdiff = timediff/60000
  let hoursdiff = timediff/3600000
  seconds = Math.floor(seconds + secondsdiff) < 60 ?  Math.floor(seconds + secondsdiff) : 0

  //if seconds diff gets too large, then seconds stop updating because it automatically becomes 0. However, the way to solve this is by resetting
  //
  if ((seconds + secondsdiff) > 60) {
    minutes < 60? minutes++ : minutes = 0
  }

  if ((minutes+ minutesdiff) > 60) {
    hours < 24? hours++ : hours = 0
    minutes = 0
  }

  if(hours>23){
    hours = 0
  }
  
  millisecondsUTC = Date.now()
  setClockText()
  
}

function setClockText() {
  const hoursText = hours < 10 ? `0${hours}` : `${hours}`
  const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`
  clock.textContent = hoursText+":"+minutesText+":"+secondsText


}
let previousGreeting = null
let greeting
function setGreetingAndBg(hours) {
  
  let bgPath;
  if (hours < 12 && hours > 4) {
    greeting = "Good Morning"
    bgPath = "bg/morning.png"
  }

  else if (hours >= 12 && hours <16) {
    greeting = "Good Afternoon"
    bgPath = "bg/afternoon.png"
  }

  else {
    greeting = "Good Night"
    bgPath = "bg/night.jpg"
  }

  greetingText.textContent = greeting
  document.getElementsByTagName("body")[0].style.backgroundImage = `url(${bgPath})`
  handleAudioPlayback(greeting)
}

function handleAudioPlayback(greeting) {
  // check if greeting has changed
  if (greeting != previousGreeting) {
    stopBgm(musicIdx);
    getBgMusicBasedOnTime(greeting)
    playBgMusic(musicIdx);

    previousGreeting = greeting;
  }
}


function getPetName() {
  if (input.value != "") {
    petName = input.value;
    
  }

}

$("#popup-btn").click(()=> {
  if (input.value != "") {
    getPetName()
    $("#nameInput").fadeOut("slow")
    $("#popup-btn").fadeOut("slow")
    $("#Picker").fadeOut("slow")
    printTamagochi()

    document.getElementById("popup").style.zIndex = -1
    document.getElementById("choose-header").style.display = "none"
    document.getElementById("pet-area").style.minHeight = "200px"
    canUpdateTime = true
    return
  }

  alert("please input a name for your pet!")
})
today = new Date()

//update internal/game clock & related stuff

let timeLoopCount = 0;
setInterval(()=> {
  if (canUpdateTime) {
    if (timeLoopCount == 0)
      getCurrentTime()
    
    scaleToGameTime()
    setClockText()
    setGreetingAndBg(hours)
    timeLoopCount++
    survivalTime++
    checkSurvivalTime(survivalTime)

  }
 
},100)


function changeIndex(dir) {
  currentIndex += dir

  if (currentIndex < 0 || currentIndex > 2)
    currentIndex = 0

  switchPreviewImg(currentIndex)
  
}


function switchPreviewImg(idx) {
  const displayImg = document.getElementById("display-img")
  displayImg.src = displayImageArray[idx]

}

const bgMusic = [new Audio ("bgm/sweden.mp3"), new Audio("bgm/birds.mp3"), new Audio ("bgm/afternoon.mp3") ,new Audio("bgm/night.mp3")]

function switchTrack() {
  if (musicIdx < 3) {
    musicIdx++
  }
  else 
    musicIdx = 0
}

function stopBgm(idx) {
  bgMusic[idx].pause()
  bgMusic[idx].currentTime = 0


}

function playBgMusic(idx) {
  bgMusic[idx].loop = 'true'
  bgMusic[idx].play()

}

function getBgMusicBasedOnTime(greeting) {
  switch (greeting) {
    case "Good Morning":
      musicIdx = 1
      break;

    case "Good Night":
      musicIdx = 3
      break;

    default:
      musicIdx = 2
      break;
  }
}

function printTamagochi(){
  NameArea = document.createElement('div');
  Name = document.getElementById('nameInput').value;
  NameArea.id="nameArea"
  NameArea.textContent = Name;

  NameArea.className = 'h3 mt-3';
  document.getElementById('pet-area').appendChild(NameArea);
  tamagochi = document.createElement("img");
  tamagochi.id = 'pet';

  
  if(currentIndex == 1){
    tamagochi.src = "shrooms/shroom1.png";
  }
  else if(currentIndex == 2){
    tamagochi.src = "golems/golem1.png";
  }
  else{
    tamagochi.src = "pokemons/pokemon1.png";
  }


  popup.style.display="none"
  popup.style.background = "none"
  
  document.getElementById('pet-area').appendChild(tamagochi);
}

$("#carousel-left").click(()=> {
  changeIndex(-1)
})

$("#carousel-right").click(()=> {
  changeIndex(1)
})

let currentLevel = 1;
let survivalTime = 0;

function checkSurvivalTime(survivalTime){
  if (survivalTime >= 320 && currentLevel === 1){
    currentLevel = 2;
    if (currentIndex == 1){
      alert(`Congrats! ${petName} has reached level 2!`);
      tamagochi.src = "shrooms/shroom2.png";
      tamagochi.style.width="170px"
      tamagochi.style.height="170px"

    } else if(currentIndex == 2){
      alert(`Congrats! ${petName} has reached level 2!`);
      tamagochi.src = "golems/golem2.png";
      tamagochi.style.width="170px"
      tamagochi.style.height="170px"
    }else{
      alert(`Congrats! ${petName} has reached level 2!`);
      tamagochi.src = "pokemons/pokemon2.png";
      tamagochi.style.width="170px"
      tamagochi.style.height="170px"
    }
  }

  if (survivalTime >= 640 && currentLevel === 2){
    currentLevel = 3;
    if (currentIndex == 1){
      alert(`Congrats! ${petName} has reached level 3!`);
      tamagochi.src = "shrooms/shroom3.png";
      tamagochi.style.width="190px"
      tamagochi.style.height="190px"
    } else if(currentIndex == 2){
      alert(`Congrats! ${petName} has reached level 3!`);
      tamagochi.src = "golems/golem3.png";
      tamagochi.style.width="190px"
      tamagochi.style.height="190px"
    }else{
      alert(`Congrats! ${petName} has reached level 3!`);
      tamagochi.src = "pokemons/pokemon3.png";
      tamagochi.style.width="190px"
      tamagochi.style.height="190px"
    }
  }
}

playBgMusic(musicIdx)
setInterval(()=>{
  if (canUpdateTime)
    survivalTime++;
  checkSurvivalTime(survivalTime);
}, 1000);


