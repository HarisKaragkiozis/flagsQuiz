let mainObject={};//An object that contains the country names and flag URLs.
let randomNumbers=[];//A list of random unique numbers
let randomCountries=[];//A list of countries matching the random unique numbers
let choices=[];//An array containing array elements which have the unique countries
let correct=[];//A list of unique countries that are the correct anwsers
let clicks = 0;//How many times the user has clicked on a choice button
let score = 0;//Score count
const mode = $(".mode");
const continent = $(".continent");
let numOfQuestions = 5;//Number of questions asked
let buttons;


$(document).ready(function(){
  //Choose a continent
  continent.click(function(event) {
    let target = event.target.id;
    $(`#${target}`).css("background-color","MediumPurple");
    $(`#${target}`).css("color","white");
    $(".continent").css( 'pointer-events', 'none' );
    //API call based on continent choise
    $.ajax({url:`https://restcountries.eu/rest/v2/region/${target}?fields=name;flag`})
    .done(function importCountries(response){
      $.each(response, function(index, value){
        //check if the country name is smaller than 20 characters
        if(value.name.length<20){
          mainObject[value.name]={name:value.name, flag:value.flag};
        }
      });
    });
    $(".continent").css("opacity","0.2");
    $(".mode").css("opacity","1");
    $(".mode").css( 'pointer-events', 'auto' );
  });
});

//Choose game difficutly
mode.click(function(event) {
  let target = event.target.id;
  let value = document.getElementById(target).getAttribute("data-value");
  $(`#${target}`).css("background-color","MediumPurple");
  $(`#${target}`).css("color","white");
  $(".mode").css( 'pointer-events', 'none' );
  //Create choice buttons depending on difficulty
  switch(value){
    case "1": buttons=2; createButtons(1); break;
    case "2": buttons=4; createButtons(2); break;
  }
  $(".mode").css("opacity","0.2");
});

//Shows the user how many choices they get depending on difficulty
mode.hover(
  function(event){
    let target = event.target.id;
    let difficulty = document.getElementById(target).getAttribute("data-value");
    switch(difficulty){
      case "1": $("#1").html("2 multiple choices"); break;
      case "2": $("#2").html("4 multiple choices"); break;
    }
  },
  function(){
    $("#1").html("");
    $("#2").html("");
  }
);

//Creates choices buttons depening on difficulty mode
var createButtons = function(level){
  const buttonsDiv = $('#buttonsPlace');
  let arr = [];
  switch(level){
    case 1: arr =[[1,2]];
    case 2: arr =[[1,2],[3,4]];
  }
  for(i=0; i<level; i++){
    buttonsDiv.append(`
      <div class="row">
        <div class="col-md-1"></div>
          <div id="button${arr[i][0]}" class="col-md-5 button"></div>
          <div id="button${arr[i][1]}" class="col-md-5 button"></div>
        <div class="col-md-1"></div>
      </div>
    `);
  }
  $("#question").append(`<h3>Question 1 out of ${numOfQuestions}</h3>`);
  //Initializes the fist set of choices
  getCountries(numOfQuestions);
  //Imports events.js after the buttons have been created
  //because otherwise the button click event listener doesn't work
  var imported=document.createElement('script');
  imported.src = 'events.js';
  document.body.appendChild(imported);
}

//Randomizes the countries and choices
function getCountries(questions){
  for(let i=0;i<questions;i++){
    for(let j=0;j<=buttons;j++){
      if(j<buttons){
        (function fillRandomNumbers(){
          var integer = Math.floor(Math.random()*Object.keys(mainObject).length);
          if(randomNumbers.indexOf(integer)===-1){
            randomNumbers.push(integer);
            randomCountries.push(Object.keys(mainObject)[integer]);
          }else{
            fillRandomNumbers();
          }
        })();
      }
      else{
        choices.push(randomCountries.splice(0,buttons));
        //Get 1 out of the random countries to be the correct one
        var int = Math.floor(Math.random()*buttons);
        correct.push(choices[i][int]);
      }
    }
  }
  //Fills the buttons with the random country choices
  for(let i=0;i<buttons;i++){
    $(".button")[i].innerHTML=choices[clicks][i];
  }
  //Places the flag of the correct country
  placeFlag(clicks);
}

//Gets the correct country flag from the API response and places it in the HTML
function placeFlag(index){
  const flagPosition = $('#flagPosition');
  let flagURL = mainObject[correct[index]].flag;
  flagPosition.html(`<img src='${flagURL}'>`);
}