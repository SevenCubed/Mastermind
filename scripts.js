/*TODO:
        - merge lock button and hint pegs
        - proper game state managing
*/
//Variables
let turn = 1,
    secret = [],
    guess = {
        'socket 1': -1,
        'socket 2': -1,
        'socket 3': -1,
        'socket 4': -1 },
    hints = {black: 0, white: 0};
const colors = ['crimson', 'darkolivegreen', 'goldenrod', 'royalblue', 'black', 'ivory']; //red, green, yellow, blue, black, white
//Sets the next sockets as active by adding listeners and resets the guess
function socketInit(){
    let socketDiv = document.getElementById('turn'+turn).getElementsByClassName("socket"),
        lockDiv = document.getElementById('turn'+turn).getElementsByClassName("lock");
    for(i=0;i<4;i++){   
        socketDiv[i].addEventListener('click', socketClick);    
        socketDiv[i].addEventListener('contextmenu', socketRClick);
        socketDiv[i].classList.toggle("activated");    
    }
    lockDiv[0].addEventListener('click', lockClick); //can't use once: true, since that'll softlock if not all pegs are filled on click.
    guess = {
    'socket 1': -1,
    'socket 2': -1,
    'socket 3': -1,
    'socket 4': -1
    }
}
//Writes the guesses to the guess object on a click
function socketClick(){
    let socket = event.target.className.replace(' activated','');
    console.log(socket);
    guess[socket] = (guess[socket]<5) ? guess[socket]+1 : 0;
    event.target.style.backgroundColor = colors[guess[socket]];
    console.log(guess)
}
//See above, but right click
function socketRClick(){
    let socket = event.target.className.replace(' activated','');
    console.log(socket);
    guess[socket] = (guess[socket]>0) ? guess[socket]-1 : 5;
    event.target.style.backgroundColor = colors[guess[socket]];
    console.log(guess)
}
//Locks the current guess, compares to the secret and advances the turn
function lockClick(){
    revealSecret(); //Debugging purposes only!
    if(Object.values(guess).includes(-1)){return alert('Please fill in all the sockets.')}
    checkCode(Object.values(guess));
    document.getElementById('turn'+turn).getElementsByClassName("lock")[0].innerHTML = "✓"
    let socketDiv = document.getElementById('turn'+turn).getElementsByClassName("socket"),
        lockDiv = document.getElementById('turn'+turn).getElementsByClassName("lock");
    for(i=0;i<4;i++){   
        socketDiv[i].removeEventListener('click', socketClick);    
        socketDiv[i].removeEventListener('contextmenu', socketRClick);
        socketDiv[i].classList.toggle("activated");
    }
    lockDiv[0].removeEventListener('click', lockClick);
    hintFill();
    if(hints.black == 4){return gloriousVictory()} //Win
    if(hints.black <= 4 && turn >= 8){return shamefulDisplay()} //Lose
    turn++
    socketInit();
}
//SHAMEFUL DISPLAY
function shamefulDisplay(){
    revealSecret();
    alert('You were unable to crack the code in time. SHAMEFUL DISPLAY!');
}
//A GLORIOUS VICTORY WILL SOON BE YOURS
function gloriousVictory(){
    revealSecret();
    alert(`Congratulations, you have won the game.`);
}
//Reveals the secret code in the top sockets
function revealSecret() {
    for (var i = 0; i < 4; i++) {
        document.getElementsByClassName('secret socket')[i].style.backgroundColor = colors[secret[i]];
        document.getElementsByClassName('secret socket')[i].innerHTML = '';
    }
}
//fills the hints sockets
function hintFill() {
    let hintDiv = document.getElementById('hint'+turn).getElementsByClassName("socket")
    for(i=0;i<hints.black;i++){
        hintDiv[i].style.backgroundColor = "black";
    }
    for(i=hints.black;i<hints.white+hints.black;i++){
        hintDiv[i].style.backgroundColor = "white";
    }
}
//generates a new code
function generateCode() {
    for (i=0;i<4;i++){
    secret[i] = Math.floor(Math.random() * 6); 
    }
    return secret;
}
//compares the guess to the secret
function checkCode(arr){
    let secretCheck = secret.slice(0),
        guessCheck = arr.slice(0);
    hints = {black: 0, white: 0};
    //check for positions
    for (i=0;i<4;i++){
        if(secretCheck[i]==guessCheck[i]){
            console.log(`${secretCheck[i]} is in the correct position`);
            secretCheck[i]=guessCheck[i] = null;
            hints.black++;
        }
    }
    //check for color matches
    for (i=0;i<4;i++){
        if(guessCheck.includes(secretCheck[i]) && secretCheck[i]!=null){
            console.log(`${secretCheck[i]} is in the wrong position`);
            guessCheck[guessCheck.findIndex(n => n == secretCheck[i])] = null; //scrap the first element that matches, so it won't return in future .include checks
            secretCheck[i] = null;
            hints.white++;
        }
    }
    console.log(secretCheck);
    console.log(guessCheck);
    console.log(secret);
    console.log(`There are ${hints.black} pegs in the correct position and an additional ${hints.white} pegs of the right color.`);
}
//First time launch
generateCode();
socketInit();