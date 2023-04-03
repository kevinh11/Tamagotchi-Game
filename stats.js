const statButtons = document.querySelector(".stats-buttons")
const health = document.getElementById("health")
const energy = document.getElementById("rest")
const fun = document.getElementById("fun")
const hunger = document.getElementById("hunger") 

const healthButton = document.getElementById("healthButton")
const funButton = document.getElementById("funButton")
const sleepButton = document.getElementById("sleepButton")
const restButton = document.getElementById("restButton")
const hungerButton = document.getElementById("hungerButton") 

const petArea = document.getElementById("pet-area")
let pet;
let drainEnabled = false;


//define stat calculation values
const idleHealthDropOff = 2
const idleRestDropOff = 2
const idleHungerDropOff = 2
const idleFunDropOff = 1 //new addition

const baseSleepIncrease = 40
const baseHealthIncrease = 40
const baseFoodIncrease = 50

const canUpdateStat = false
let miniGameOver = true

const sfxArray = [new Audio("sfx/eatsound.mp3"), new Audio("sfx/coin.mp3"), new Audio("sfx/sleep.mp3"), new Audio("sfx/death.mp3"), new Audio("sfx/lmao.mp3"), new Audio("sfx/heal.mp3")]



function changeStatBarColor(statBar) {
  const statValue = statBar.ariaValueNow 
  const critical = 25
  const good = 75

  if (statValue <= critical) {
    statBar.style.backgroundColor="red"
  }

  else if (statValue >= critical && statValue <= good) {
    statBar.style.backgroundColor="yellow"
  }

  else {
    statBar.style.backgroundColor="green"
  }
}

function checkBarStatus() {

  const allstats = Array.from(document.getElementsByClassName("progress-bar"))

  allstats.forEach((stat)=> {
    changeStatBarColor(stat)
  })
}


function dropStat(stat, value) {
  let currentPercent = stat.ariaValueNow
  if (currentPercent > 0) {
    stat.style.width = `${currentPercent-value}%`
    stat.ariaValueNow = currentPercent - value
  }


}

function increaseStat(stat, value) {
  let currentPercent = stat.ariaValueNow;
  if (parseInt(currentPercent) + parseInt(value) <= 100) {
    stat.ariaValueNow = parseInt(currentPercent) + parseInt(value)
  }

  else {
    stat.ariaValueNow = 100
    
  }

  stat.style.width = `${stat.ariaValueNow}`

}

function getRandomInRange(min,max) {
  return (Math.random() * (max-min)) + max
}

const illustrationArray = ["items/food.png", "items/sleep.png", "items/heal.png"]

function addIllustration(idx) {
  let illustration = document.createElement("img")
  const illustrationOffset = 100

  illustration.src = illustrationArray[idx]
  illustration.classList.add("illustration")

  let petRect = pet.getBoundingClientRect()

  illustration.style.position="absolute"
  illustration.style.top = petRect.top - illustrationOffset
  illustration.style.right = petRect.right + illustrationOffset

  petArea.appendChild(illustration)

  setTimeout(()=> {
    petArea.removeChild(illustration)
  },1000)

  
}

function getSleep() {
  const currentEnergyValue = rest.ariaValueNow
  const sleepQuality = getRandomInRange(0.7,1) * (health.ariaValueNow/100)  
  const sleepValue = baseSleepIncrease

  increaseStat(rest,sleepValue)
  increaseStat(health, (baseHealthIncrease * sleepQuality))
  addIllustration(1)
}



function getEat(){
  const currentHungerValue = hunger.ariaValueNow
  const foodQuality = getRandomInRange(0.8, 1) * (hunger.ariaValueNow/100)//eating got buffed
  const foodValue = baseFoodIncrease * foodQuality

  addIllustration(0)
  increaseStat(hunger, foodValue)
  increaseStat(health, (baseHealthIncrease * foodQuality))
  increaseStat(fun, foodValue/2)      
  dropStat(rest, 5)
  


}

function getHealth(){
  const currentHealthValue = health.ariaValueNow
  const healQuality = getRandomInRange(0.7, 1) * (health.ariaValueNow/100)
  const healValue = baseHealthIncrease * healQuality

  addIllustration(2)
  increaseStat(health, healValue)
  dropStat(fun, (healValue/2))

}
//making a stack of food items
let foodArray = []


//minigame plays for twenty seconds
let gameTimer = 20000
let gamePoints = 0

function detectMobile() {

  if (window.innerWidth < 800) {
    console.log("mobile")
    return true
  }

  return false
}

function addFoodItems() {
  const food = document.createElement("img")
  food.src = "items/food.png"//tell me if food is too ambigous looking
  food.style.position = "absolute"

  let foodMaxX = detectMobile() ? 50 : 400
  let foodMinX = detectMobile() ? 0 : 250


  food.style.top= `${getRandomInRange(15,120)}px`
  food.style.right = `${getRandomInRange(foodMinX,foodMaxX)}px`
  
  food.style.width = "20px"
  food.style.height="20px"
  petArea.appendChild(food)
  
  foodArray.push(food)

  setInterval(()=> {

    if (detectCollision(food,pet)) {
      petArea.removeChild(food)
      gamePoints += 1
      increaseStat(fun, 15)
      playSfx(1)

      displayMiniGamePoints()
    }
    
  },100)
  
  
}


function playSfx(sfxIdx){
  sfxArray[sfxIdx].play()

}

function deleteFoodItem() {

  if (foodArray.length > 0) {
    if (petArea.children[2])
      petArea.removeChild(petArea.children[2])
  }

}

function detectCollision(currObj, pet) {
  let objRect = currObj.getBoundingClientRect()
  let petRect = pet.getBoundingClientRect()

  if (objRect.bottom <= petRect.top) {
    if (objRect.left >= petRect.left && objRect.right <= petRect.right) {
      return true
    }
  }

  if (objRect.top <= petRect.bottom) {
    if (objRect.left >= petRect.left && objRect.right <= petRect.right) {
      return true
    }
  }

  return false
 
}

function controlPet(command) {
  let moveX = 0, moveY = 0;
  let petDir = 1;
  const moveSpeed = 20;
  switch(command) {
    case "up":
      moveY = -moveSpeed;
      moveX = 0
      break;

    case "down":
      moveY = moveSpeed;
      moveX = 0
      break;

    case "left":
      moveX = -moveSpeed;
      moveY = 0
      petDir = "0deg"
      break;

    case "right":
      moveX = moveSpeed;
      moveY = 0
      petDir = "-180deg"
      break;
  }

  const petTop = pet.offsetTop
  const petLeft = pet.offsetLeft
  const boundingRect = petArea.getBoundingClientRect()
  const rightBoundary = boundingRect.right - boundingRect.left
  const bottomBoundary = boundingRect.bottom - boundingRect.top

  let newTop
  let newLeft
  const petHeight = 40


  if ((petTop + moveY) < 0)
    newTop = 0
  else if ((petTop+ moveY) > bottomBoundary)
    newTop = bottomBoundary - petHeight
  else
    newTop = petTop + moveY


  if ((petLeft + moveX < 0))
    newLeft = 0
  else if ((petLeft + moveX) > rightBoundary) 
    newLeft = rightBoundary
  else 
    newLeft = petLeft + moveX

  pet.style.top = `${newTop}px`;
  pet.style.left = `${newLeft}px`;  
  pet.style.transform =`rotateY(${petDir})`


}

function displayMiniGamePoints(){
  document.getElementById("pointsText").textContent = `Total points : ${gamePoints}`
  
}


function keyboardListener(event) {
  switch (event.keyCode) {
    case 37:
      controlPet("left")
      break;

    case 38:
      controlPet("up")
      break;

    case 39:
      controlPet("right")
      break

    case 40:
      controlPet("down")
      break;
  }
}

function resetMinigameState() {

  $(".gamepad").fadeOut("slow")

  pet = document.getElementById("pet")
  pet.style.position = "static"
  pet.style.top = "0px"
  pet.style.left =  detectMobile()? `${petArea.style.width/2 + pet.style.width/2}px` : "50px"

  pet.style.translateY = "0deg"

  Array.from(statButtons.children).forEach((sb)=> {
    sb.style.display = "flex"
  })

  $("#pointsText").fadeOut()
  hideShowClock("show")
  $("#nameArea").fadeIn()

  
}

function hideShowClock(arg) {
  const clock = document.getElementById("time")

  Array.from(clock.children).forEach((c)=> {
    c.style.display = arg == "show" ? "block" : "none"
  })
}



function playGame() {
  miniGameOver = false
  const foodInterval = setInterval(addFoodItems, 2000)
  const gamepad = document.querySelector(".gamepad")
  const statButtons = document.querySelector(".stats-buttons")

  Array.from(statButtons.children).forEach((sb)=> {
    sb.style.display = "none"
  })
  gamepad.style.display = "flex"
  gamepad.style.position="static"

  $("#pointsText").fadeIn()
  $(".gamepad").fadeIn()
  $("#nameArea").fadeOut()

  hideShowClock("hide")
  pet = document.getElementById("pet")
  setInterval(deleteFoodItem,4000)

  document.addEventListener("keydown", keyboardListener)

  let timerInterval = setInterval(()=> {
    if (gameTimer >= 0) {
      gameTimer -= 100
    }

    else { 
      clearInterval(timerInterval)
      clearInterval(foodInterval)
      document.removeEventListener("keydown",keyboardListener)
      alert("minigame has finished playing")
      resetMinigameState()
      gameTimer= 20000
    }
   
  },100)

  pet.style.position = "absolute"
  pet.style.top = "0px"

}

function checkDeath() {
  if (hunger.ariaValueNow <= 0 || health.ariaValueNow <= 0 || energy.ariaValueNow <=0) {
    resetMinigameState()
    pet.style.transform = "rotateY(0deg)"
    pet.src = "items/dead.png"
    playSfx(3)
    clearInterval(gameInterval)
    alert("your pet has died :(")
    playSfx(4)
    setTimeout(()=> {
      location.reload()
    },2000)

    statButtons.style.pointerEvents = "none"
  }
}

checkBarStatus()

let gameInterval = setInterval(()=> {

  if (document.getElementById("pet")) {
    pet = document.getElementById("pet")
    drainEnabled = true
  }
  
    

  if (drainEnabled) {
    dropStat(health,idleHealthDropOff)
    dropStat(energy,idleRestDropOff)
    dropStat(fun, idleFunDropOff)//this and hunger was a forgotten addition
    dropStat(hunger, idleHungerDropOff)
    checkBarStatus()
    checkDeath()

  }


  
 
},1000)

$("#pointsText").fadeOut()


$("#restButton").click(()=> {
  getSleep()
  playSfx(2)
})

$("#hungerButton").click(()=> {
  getEat()
  playSfx(0)
})

$("#healthButton").click(()=> {
  getHealth()
  playSfx(5)
})

$("#funButton").click(()=> {
  $("#pet").animate({
    width:"80px",
    height:"80px",
    
  })
  playGame()
})
//gamepad controls
$("#up").mousedown(()=> {
  controlPet("up")
})

$("#down").mousedown(()=> {
  controlPet("down")
})

$("#left").mousedown(()=> {
  controlPet("left")
})

$("#right").mousedown(()=> {
  controlPet("right")
})

