//Runs when a choice is clicked
$(".button").click(function(){
    let target = event.target.id;
    let answer = event.target.innerHTML;
    //Checks is the answer was right or wrong
    if (answer == correct[clicks]){
        score+=1; //raises the score by 1
        $('#'+target).css("background-color","lightgreen");
    }else{
        $('#'+target).css("background-color","pink");
    }
    //Turns the correct answer green to show it to the user in case he chose wrong
    for (let i=0; i<buttons; i++) {
        if( $(".button")[i].innerHTML == correct[clicks]){
            $(".button")[i].style.background = "lightgreen";
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
      $('#question').html(`<h3>Question ${turn} out of ${numOfQuestions}</h3>`);
      //Creates the buttons with the random country choices
      for (let i=0; i<buttons; i++) {
        $(".button")[i].innerHTML = choices[clicks][i];
      }
    }else{
      //Runs once the game is over
      if(!alert('You got '+score+' out of '+numOfQuestions+'. Replay?')){
          window.location.reload();
      }
    }
    //Resets the button colors back
    $('.button').css("background-color","Silver");
    //Enables cursor events
    $("body").css( 'pointer-events', 'auto' );
    //Places the flag of the correct country
    placeFlag(clicks);
}