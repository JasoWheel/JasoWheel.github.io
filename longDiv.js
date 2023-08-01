//---------begin game setup section-------->>>>>>>>
let quotients = []; //top number
let subtracts =[]; //product
let remainders = []; //duh!! remainders
let yellows = []; //numbers to divide (user inputs)
let gameLength = ""; //number of steps to the end
let begin = document.getElementById("begin"); //button that will be changed
let endBtn = document.getElementById("endBtn"); //button that will be changed
let enterMe1 = document.getElementById("enterMe1"); //notification to enter answer
let greenBox = document.getElementById("r8c2"); //box to keep problem score
let redBox = document.getElementById("r9c2"); //box to keep problem score
gameNameber = "12";

function startGame() { //only on game begin **call dB setup here
  begin.removeAttribute("onclick");
  endBtn.removeAttribute("onclick");
  begin.style.visibility="hidden";
  endBtn.style.visibility="hidden";
  begin.addEventListener("click", submitAnswers);
  begin.innerHTML="Submit";
  endBtn.addEventListener("click", submitAnswers);
  endBtn.innerHTML="Submit";
  enterMe1.innerHTML="Enter Numbers Now!";
  //startNewGame(gameNameber);
  startDivision();
}

//------begin startDivision subsection----------->>>>>>
function startDivision() { //pick numbers and make arrays, then call yellows
  let number = makeBigNumber();
  //let number = 20;
  insertDividend(number);
  let div = makeLittleNumber();
  insertDivisor(div);
  makeQuestion(number, div);
  let len = number.toString().length;
  for (i=len-1; i>-1; i--) { //create number arrays for each step
    let n1 = Math.trunc(number / Math.pow(10, i));
    yellows.push(n1);
    let n2 = Math.trunc(n1/div);
    quotients.push(n2);
    let n3a = n2 * div;
    subtracts.push(n3a);
    let n3b = n1 - n3a;
    remainders.push(n3b);
    let n3 = (n3a) * Math.pow(10, i);
    number = number - n3;
  }
  gameLength = yellows.length;
  //console.log(yellows);
  //console.log(quotients);
  //console.log(subtracts);
  //console.log(remainders);
  makeYellow();
  greenRedBox();
}

function makeBigNumber () {
  let big = 0;
  let size = 0;
  do {size = Math.ceil(8*Math.random());}
    while (size < 2);
  do {big = Math.floor((10**size)*Math.random());}
    while (big < 50 || big > 99999999);
  return big;
}

function insertDividend(number) {
  let qtBoxes = ["r2c3", "r2c4", "r2c5", "r2c6", "r2c7", "r2c8", "r2c9", "r2c10"];
  let len = number.toString().length;
  let arr = Array.from(number.toString());
  for (let i=0; i<len; i++) {
    let insertMe = document.getElementById(qtBoxes[i]);
    insertMe.value = arr[i];
    insertMe.disabled=true;
  }
  for (i=len-1; i<8; i++) {
    let blankMe = document.getElementById(qtBoxes[i]);
    blankMe.disabled=true;
  }
}

let doneLittles = []; //array to track which divide numbers have be used

function makeLittleNumber () {
  let little = 0;
  if (doneLittles.length <11) {
    do {little = Math.floor((13)*Math.random());}
      while (little < 2 || little > 12 || doneLittles.includes(little)==true);
  } else {
    doneLittles = [];
    do {little = Math.floor((13)*Math.random());}
      while (little < 2 || little > 12 || doneLittles.includes(little)==true);
    }
  doneLittles.push(little);
  return little;
}

function insertDivisor(div) {
  let dvBoxes = ["r2c2", "r2c1"];
  let digits = div.toString().length;
  let divArr = Array.from(div.toString());
  divArr.reverse();
  for (let i=digits-1; i>-1; i--) {
    let dBox = document.getElementById(dvBoxes[i]);
    dBox.value  = divArr[i];
    dBox.style.backgroundColor="#ddc2e9";
  } for (i=1; i>-1; i--) {
    let lockMe = document.getElementById(dvBoxes[i]);
    lockMe.disabled=true;
  }
}

let numerator = document.getElementById("numerator");
let denominator = document.getElementById("denominator");
let Fwhole = document.getElementById("Fwhole");
let Fnumer = document.getElementById("Fnumer");
let Fdenom = document.getElementById("Fdenom");
let bigGuy;
let littleGuy;

function makeQuestion(number, div) {
  numerator.innerHTML=number;
  denominator.innerHTML=div;
  Fwhole.innerHTML="?????";
  Fnumer.innerHTML="??";
  Fdenom.innerHTML=div;
  bigGuy = number;
  littleGuy = div;
}

//---------start makeYellow subSection----------->>>>>
let rR = 2; //row values in id's
let cC = 3; //column values in id's
let step = 0; //the current step of the problem
let unLocked = []; //the input id's currently unlocked

function makeYellow() { //insert working numbers, make sorted array id's and string, set listeners, focus
  let yLong = yellows[step].toString().length;
  let yArr = Array.from(yellows[step].toString())
  let yrR = rR;
  let ycC = cC;
  let yCellA = document.getElementById("r1c"+cC);
  unLocked.push(yCellA.id);
  yCellA.style.backgroundColor="#d2d89f";
  yCellA.disabled=false;
  for (i=yLong-1; i>-1; i--) {
    let yCell = document.getElementById("r"+yrR+"c"+ycC);
    yCell.value = yArr[i];
    let yCellB = document.getElementById("r"+(yrR+1)+"c"+ycC);
    unLocked.push(yCellB.id);
    yCellB.style.backgroundColor="#d2d89f";
    yCellB.disabled=false;
    yCellB.style.borderBottomWidth="0.3vw";
    let yCellC = document.getElementById("r"+(yrR+2)+"c"+ycC);
    unLocked.push(yCellC.id);
    yCellC.style.backgroundColor="#d2d89f";
    yCellC.disabled=false;
    ycC--;
  }
  document.getElementById("r"+(yrR+1)+"c"+(ycC)).value = "   -";
  unLocked.sort(sortAlphaNum); //Sorts unlocked input ids for navigating them logically.
  rR = rR+1; //move to next row
  doFinalString();
  setUnlockedChange(); //add event listener to checkFilled()
  nextFocus();
  unLockKeyPad();
  enterMe1.style.visibility="visible";
  return;
}

let One = /r(.*?)c/;
let Two = /[^c]*$/;
function sortAlphaNum(a, b) { //This magic puts focused input id's in order
  let aOne = parseInt(One.exec(a)[1], 10);
  let aTwo = parseInt(Two.exec(a)[0], 10);
  let bOne = parseInt(One.exec(b)[1], 10);
  let bTwo = parseInt(Two.exec(b)[0], 10);
  if (aOne === bOne) {
    return aTwo === bTwo ? 0 : aTwo > bTwo ? 1 : -1;
  } else {
    return aOne > bOne ? 1 : -1;
  }
}

let finalString = ""; //for answer checking

function doFinalString() {
  let rowArray = [];
  for (i=1; i<20; i++) {
    let regEx = new RegExp("^r"+i+"c");
    let arrNew = unLocked.filter(id => regEx.test(id));
    if (arrNew.length > 0) {
      rowArray.push(arrNew);
    }
  }
  finalString = "";
  for (i=0; i<3; i++) {
    let numOne = quotients[step];
    let numTwo = subtracts[step];
    let numThree = remainders[step];
    let numArray = [numOne, numTwo, numThree];
    if (rowArray[i].length === numArray[i].toString().length) {
      finalString = finalString.concat(numArray[i]);
    } else {
      let newNum = numArray[i].toString().padStart(rowArray[i].length, "0");
      finalString = finalString.concat(newNum);
    }
  }
}

function setUnlockedChange() { //create onclick listener to checkFilled for unLocked
  for (i=0; i<unLocked.length; i++) {
    document.getElementById(unLocked[i]).addEventListener("click", checkFilled);
  }
}

function unLockKeyPad() {
  keypads = document.getElementsByName("keypads");
  for (i=0; i<keypads.length; i++) {
    document.getElementById(keypads[i].id).disabled=false;
  }
}
//---------end makeYellow subSection----------->>>>>

function greenRedBox() { //setup problem score boxes each question
  redBox.style.backgroundColor="pink";
  greenBox.style.backgroundColor="#99cd8b";
  redBox.style.color="black";
  greenBox.style.color="black";
  greenBox.style.color="black";
  redBox.value="0";
  greenBox.value="0";
}
//------end startDivision subsection----------->>>>>>
//---------end game setup section-------->>>>>>>>

//---------begin Answering Section-------------->>>>>>>
function submitAnswers() { //disable inputs then call doOneStep
  enterMe1.style.visibility="hidden";
  begin.style.visibility="hidden";
  endBtn.style.visibility="hidden";
  lockKeyPad();
  lockActive();
  doOneStep();
}

let keypads = [];
function lockKeyPad() {
  keypads = document.getElementsByName("keypads");
  for (i=0; i<keypads.length; i++) {
    document.getElementById(keypads[i].id).disabled=true;
  }
}

function lockActive() {
  for (i=0; i<unLocked.length; i++) {
    document.getElementById(unLocked[i]).disabled=true;
    document.getElementById(unLocked[i]).blur();
  }
}

//---------begin doOneStep subSection------->>>
let correct = 0;
let gameCorrect = 0;
let gameMissed = 0;
let missed = 0;
let answered = 0;
let totalProblems = 0;
let correctProblems = 0;
let problemNumber = 1;
let totalPercent = 0;
let problemPercent = 0;
const sleep = delay => new Promise(r => setTimeout(r, delay));

async function doOneStep() { //check, score and prep for next part
  await sleep(300);
  allFilled = "no";
  if (gameLength>1) { //nested promises below
    enterNumbers()
      .then(function() {
        return lockYellows();
        }) .then (function () {
        return makeYellow(); //start next part
        }) //.catch(console.log("promises broken"));
  } else if (gameLength === 1) { //last step
    enterNumbers()
      .then(function() {
        return lockYellows();
        }) .then (function () {
          return loadResetBtn();
          }) //.catch(console.log("promises broken"));
      return; //wait for reset of question
    } else {
    //console.log("It's over... stop pushing the button!") // should not be needed anymore
  }
} //wait for answer input

async function enterNumbers() { //check & score answers then input correct
  let theFinalString = finalString;
  let numCell = "";
  for (i=0; i<theFinalString.length; i++) {
    numCell = document.getElementById(unLocked[i]);
    let CellInput = numCell.value;
    let numValue = theFinalString[i];
    if (CellInput === numValue) {
      correct++;
      gameCorrect++;
      answered++;
      greenBox.value=gameCorrect;
      numCell.style.fontSize="2.1vw";
      numCell.style.color="#183c0e";
      numCell.style.backgroundColor="#99cd8b";
    } else {
      numCell.style.fontSize="2.1vw";
      numCell.style.color="#790000";
      numCell.style.backgroundColor="pink";
      missed++;
      gameMissed++;
      redBox.value=gameMissed;
      answered++
    }
    await sleep(999);
  }
  for (i=0; i<theFinalString.length; i++) {
    numCell = document.getElementById(unLocked[i]);
    let numValue = theFinalString[i];
    numCell.value = numValue;
  }
  await sleep(1000)
  step = step+1;
  gameLength = gameLength - 1;
  cC = cC+1;
  rR = rR+1;
  updateScore();
  //updateGame(answered, correct, missed);
  return;
}

function updateScore() {
  document.getElementById("correct").innerHTML=correct;
  document.getElementById("missed").innerHTML=missed;
  document.getElementById("answered").innerHTML=answered;
  totalPercent = Math.ceil((correct/answered)*100);
  document.getElementById("totalPct").innerHTML=totalPercent+" %";
}

function lockYellows() { //remove event listener, make font back to normal and reset unLocked array
  for (i=0; i<unLocked.length; i++) {
    document.getElementById(unLocked[i]).removeEventListener("click", checkFilled);
    let reLock = document.getElementById(unLocked[i]);
    reLock.style.fontSize="1.8vw";
  }
  unLocked = [];
  return;
}

let resetReady = "no";
function loadResetBtn() { //change buttons from Submit to reset
  begin.removeEventListener("click", submitAnswers); //change buttons to reset
  begin.addEventListener("click", reSet);
  begin.addEventListener("keyup", reSet);
  begin.innerHTML="Next Question";
  endBtn.removeEventListener("click", submitAnswers);
  endBtn.addEventListener("click", reSet);
  endBtn.innerHTML="Next Question";
  begin.style.visibility="visible";
  endBtn.style.visibility="visible";
  document.getElementById("r16c3").disabled=false;
  document.getElementById("r16c3").focus();
  resetReady = "yes";
  if (gameMissed === 0){
    correctProblems++;
    document.getElementById("correctProblems").innerHTML=correctProblems;
  }
  totalProblems++;
  document.getElementById("totalProblems").innerHTML=totalProblems;
  problemPercent = Math.ceil((correctProblems/totalProblems)*100);
  document.getElementById("problemPct").innerHTML=problemPercent+" %";
  makeTheAnswer();
  return;
} //end of problem. Wait for reset click to start next one.

function makeTheAnswer() {
  Fwhole.innerHTML = Math.floor(bigGuy/littleGuy);
  Fnumer.innerHTML= bigGuy % littleGuy;

}
//---------end doOneStep subSection------->>>
//---------end Answering Section-------------->>>>>>>


//---------begin reset section------------->>>
function reSet() { //get ready for and start next problem
  let allBoxes = document.getElementsByName("numBox");
  let manyBoxes = allBoxes.length;
  for (i=0; i<manyBoxes; i++) {
    document.getElementById(allBoxes[i].id).value="";
    allBoxes[i].style.backgroundColor="#f5f5dc";
    allBoxes[i].style.borderBottomWidth="0.05vw";
    allBoxes[i].style.color="blue";
    allBoxes[i].disabled=true;
  }
  unLocked=[];
  quotients = [];
  subtracts =[];
  remainders = [];
  yellows = [];
  gameLength = "";
  finalString = "";
  resetReady = "no";
  rR = 2;
  cC = 3;
  step = 0;
  unLocked = [];
  gameMissed = gameCorrect = 0;
  problemNumber++;
  document.getElementById("problemNumber").innerHTML=problemNumber;
  loadSubmitButton();
  startDivision(); //start new question
}

function loadSubmitButton() { //change buttons from reSet to Submit then hide
  begin.removeEventListener("click", reSet);
  begin.addEventListener("click", submitAnswers);
  begin.innerHTML="Submit";
  endBtn.removeEventListener("click", reSet);
  endBtn.addEventListener("click", submitAnswers);
  endBtn.innerHTML="Submit";
  begin.style.visibility="hidden";
  endBtn.style.visibility="hidden";
}
//---------end reset section------------->>>

//start keyboard and keypad control

let allFilled = "no";

function checkFilled() { //activate submit button when all full
  for (i=0; i<unLocked.length; i++) {
    if (document.getElementById(unLocked[i]).value === "") {
      return;
    }}
   //here change from enterAnswer to submit answer and (already visible)
   begin.style.visibility="visible";
   endBtn.style.visibility="visible";
   enterMe1.style.visibility="hidden";
   allFilled="yes";
}

function nextFocus() { //move cursor to next active input
  let newIndx;
  if (!active) {
    document.getElementById(unLocked[0]).focus();
  } else {
    let lastIndx = (unLocked.length - 1);
    let currentIndx = unLocked.indexOf(active.id);
    if (currentIndx < lastIndx) {
      newIndx = currentIndx + 1;
    } else {
      newIndx = 0;
    }
    document.getElementById(unLocked[newIndx]).focus();
  }
}

function backFocus() { //move cursor to next active input
  let newIndx;
  if (!active) {
    document.getElementById(unLocked[0]).focus();
  } else {
    let lastIndx = (unLocked.length - 1);
    let currentIndx = unLocked.indexOf(active.id);
    if (currentIndx > 0) {
      newIndx = currentIndx - 1;
    } else {
      newIndx = lastIndx;
    }
    document.getElementById(unLocked[newIndx]).focus();
  }
}

let active;
function findActive() { //stores id of input with focus
  active = document.activeElement;
}

function input(e) { //inputs selected number from keypad in focused box
  if (document.getElementById(active.id).disabled===false){
  var myText = document.getElementById(active.id);
  myText.value = e.value;
  nextFocus();
}}

function enterKey(e) { //check answer on enter keyup if active
  if (e.keyCode === 13 && allFilled === "yes") {
    submitAnswers();
  }  else if (resetReady === "yes") {
      reSet();
    } else if (allFilled !== "yes") {
      checkFilled();
      nextFocus();
    } else { nextFocus() }
}

//end keyboard and keypad control

function goHome(){ //go back to pick a game page //New for Db*******
window.location.href = "..//PlayGame.php";
}
