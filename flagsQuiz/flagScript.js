let countriesWithFlags={};//An object that contains the country names and flag URLs.
let randomNumbers=new Set();//A list of random unique numbers
let randomCountries=[];//A list of countries matching the random unique numbers
let choices=[];//An array containing array elements which have the unique countries
let correct=[];//A list of unique countries that are the correct anwsers
let clicks = 0;//How many times the user has clicked on a choice button
let score = 0;//Score count
let numOfQuestions = 5;//Number of questions  
const continentButton = $(".continent");
const mode = $(".mode");
const checkbox = $("#checkbox");
let continentName;
let difficultyLevel;

$(document).ready(function(){
  //Runs if there is sessionStorage Data saved
  document.querySelector('#checkbox').checked = sessionStorage.getItem('checked');
  if(document.querySelector('#checkbox').checked==true){
    continentButton.toggle();//toggles the continents buttons off
    continentName = sessionStorage.getItem('continentName');
    difficultyLevel = sessionStorage.getItem('difficultyLevel');
    ajaxCall(continentName).then(function(){
      createButtons(difficultyLevel)
    })
  };
});

//Calls an API that gets the country names and flags
function ajaxCall(continent){
  return $.ajax({url:`https://restcountries.com/v2/region/${continent}?fields=name,flags`})
  .then(function(response){
    $.each(response, function(index, value){
      //Filters countries with names smaller than 20 characters
      if(value.name.length<20){
        countriesWithFlags[value.name]={name:value.name, flag:value.flags.svg};
      }
    });
  });
};

//Choose continent
continentButton.click(function(event) {
  continentName = event.target.id;
  ajaxCall(continentName);//Runs API call based on continent choice
  continentButton.toggle();//Toggles the continents buttons off
  $('.collapse').collapse();//Toggles the mode buttons on
});

//Choose game difficutly
mode.click(function(event) {
  mode.toggle();//Toggles off the difficutly buttons (easy, hard)
  let target = event.target.id;
  let dataValue = document.getElementById(target).getAttribute("data-value");
  //difficultyLevel is a string so I need to parse it to make it an integer
  difficultyLevel = parseInt(dataValue);
  //Create 2 or 4 choice buttons depending on difficulty
  createButtons(difficultyLevel);
});

//Activate sessionStorage to save user settings
checkbox.click(function(event){
  if(event.target.checked){
    sessionStorage.setItem("checked", true);
    sessionStorage.setItem("continentName", continentName);
    sessionStorage.setItem("difficultyLevel", difficultyLevel);
  }
  else{
    sessionStorage.clear();
  }
});

//Creates choices buttons depening on difficulty mode
function createButtons(level){
  const buttonsDiv = $('#buttonsPlace');
  let choiceButtons = "";
  for(let i=1; i<=level; i++){
    let appendingButtons =
    `<div class="col-md-6">
      <button id="button${i}" class="btn btn-primary btn-lg btn-block button"></button>
    </div>`;
    choiceButtons+= appendingButtons;
  }
  //Appends the choice buttons on the DOM
  buttonsDiv.append(choiceButtons);
  $("#question").append(`<h1>Question 1 out of ${numOfQuestions}</h1>`);
  //Initializes the choices to fill the buttons
  getCountries(numOfQuestions);
  $("#checkboxDiv").toggle();
  //Runs when a choice is clicked
  $(".button").click(function(event){
    let target = event.target.id;
    let answer = event.target.innerHTML;
    //Checks if the answer was right or wrong
    if (answer == correct[clicks]){
        score+= 1; //raises the score by 1
        $(`#${target}`).css("background-color","SpringGreen");
    }else{
        $(`#${target}`).css("background-color","Salmon");
    }
    //Turns the correct answer green to show it to the user in case he chose wrong
    for (let i=0; i<difficultyLevel; i++) {
        if( $(".button")[i].innerHTML == correct[clicks]){
            $(".button")[i].style.background = "SpringGreen";
        }
    }
    //Disables cursor events
    $("body").css('pointer-events','none');
    //Loads up the next set of choices with some time delay
    setTimeout(next, 1200);
  });
  //Loads the next set of choices
  function next(){
    clicks +=1;
    let turn = clicks+1;
    if(clicks < numOfQuestions){
      $('#question').html(`<h1>Question ${turn} out of ${numOfQuestions}</h1>`);
      //Creates the buttons with the random country choices
      for (let i=0; i<difficultyLevel; i++) {
        $(".button")[i].innerHTML = choices[clicks][i];
      }
    }else{
      //Runs once the game is over
      if(!alert(`You got ${score} out of ${numOfQuestions}. Replay?`)){
          window.location.reload();
      }
    }
    //Resets the button colors back
    $('.button').css("background-color","#337ab7");
    //Enables cursor events
    $("body").css( 'pointer-events', 'auto' );
    //Places the flag of the correct country
    placeFlag(clicks);
  }
}

//Randomizes the countries and choices
function getCountries(questions){
  for(let i=0; i<questions; i++){
    for(let j=0; j<=difficultyLevel; j++){
      if(j<difficultyLevel){
        fillRandomNumbers();
      }
      else{
        choices.push(randomCountries.splice(0,difficultyLevel));
        //Get 1 out of the random chosen countries to be the correct one
        let int = Math.floor(Math.random()*difficultyLevel);
        correct.push(choices[i][int]);
      }
    }
  }
  //Fills the buttons with the random country choices
  for(let i=0; i<difficultyLevel; i++){
    $(".button")[i].innerHTML = choices[clicks][i];
  }
  //Places the flag of the correct country
  placeFlag(clicks);
}

//Creates a set of random numbers to be used by getCountries() to get random countries
function fillRandomNumbers(){
  let integer = Math.floor(Math.random()*Object.keys(countriesWithFlags).length);
  if(!randomNumbers.has(integer)){
    randomNumbers.add(integer);
    randomCountries.push(Object.keys(countriesWithFlags)[integer]);
  }else{
    fillRandomNumbers();
  }
}

//Gets the correct country flag from the API response and places it in the HTML
function placeFlag(index){
  const flagPosition = $('#flagPosition');
  let flagURL = countriesWithFlags[correct[index]].flag;
  flagPosition.html(`<img src='${flagURL}'>`);
}