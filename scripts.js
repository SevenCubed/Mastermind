/* 
*/
//Variables
let turn = 1,
    secret = [],
    guess = {
        'socket 1': -1,
        'socket 2': -1,
        'socket 3': -1,
        'socket 4': -1
    },
    hints = { black: 0, white: 0 },
    maxTurns = 12; //declaring it here for debugging and future proofing, should I wish to add difficulties for instance.
const colors = ['crimson', 'darkolivegreen', 'goldenrod', 'royalblue', 'black', 'ivory']; //red, green, yellow, blue, black, white. 

//Sets the next sockets as active by adding listeners and resets the guess
function socketInit() {
    let socketDiv = document.getElementById('turn' + turn).getElementsByClassName("socket"),
        lockDiv = document.getElementById('hint' + turn).getElementsByClassName("lock");
    for (i = 0; i < 4; i++) {
        socketDiv[i].addEventListener('click', socketClick);
        socketDiv[i].addEventListener('contextmenu', socketRClick);
        socketDiv[i].classList.toggle("activated");
    }
    lockDiv[0].addEventListener('click', lockClick); //can't use once: true, since that'll softlock if not all pegs are filled on click.
    lockDiv[0].classList.toggle("activated");
    guess = {
        'socket 1': -1,
        'socket 2': -1,
        'socket 3': -1,
        'socket 4': -1
    }
}
//Writes the guesses to the guess object on a click
function socketClick(event) {
    let socket = event.target.className.replace(' activated', '');
    console.log(event.target)
    guess[socket] = (guess[socket] < 5) ? guess[socket] + 1 : 0;
    event.target.style.backgroundColor = colors[guess[socket]];
}
//See above, but on a right click and in the reverse order
function socketRClick(event) {
    let socket = event.target.className.replace(' activated', '');
    guess[socket] = (guess[socket] > 0) ? guess[socket] - 1 : 5;
    event.target.style.backgroundColor = colors[guess[socket]];
}
//Locks the current guess, compares to the secret and advances the turn
function lockClick() {
    //revealSecret(); //Debugging purposes only!
    if (Object.values(guess).includes(-1)) { return alert('Please fill in all the sockets.') } //check if sockets are filled, abort function if not
    checkCode(Object.values(guess));
    let socketDiv = document.getElementById('turn' + turn).getElementsByClassName("socket"),
        lockDiv = document.getElementById('hint' + turn).getElementsByClassName("lock");
    for (i = 0; i < 4; i++) {
        socketDiv[i].removeEventListener('click', socketClick);
        socketDiv[i].removeEventListener('contextmenu', socketRClick);
        socketDiv[i].classList.toggle("activated");
    }
    lockDiv[0].innerHTML = ""
    lockDiv[0].removeEventListener('click', lockClick);
    lockDiv[0].classList.toggle("activated");
    lockDiv[0].remove('lock');
    hintFill();
    if (hints.black == 4) { return gloriousVictory() } //Win
    if (hints.black <= 4 && turn >= maxTurns) { return shamefulDisplay() } //Lose
    turn++
    socketInit(); //activate the next set of sockets
}
//Loss state
function shamefulDisplay() {
    revealSecret();
    document.getElementById('defeat').style.display = "block";
}
//Win state
function gloriousVictory() {
    revealSecret();
    document.getElementById('victory').style.display = "block";
}
//Reveals the secret code in the top sockets
function revealSecret() {
    for (var i = 0; i < 4; i++) {
        document.getElementsByClassName('secret socket')[i].style.backgroundColor = colors[secret[i]];
        document.getElementsByClassName('secret socket')[i].innerHTML = '';
    }
}
//fills the hint sockets
function hintFill() {
    let hintDiv = document.getElementById('hint' + turn).getElementsByClassName("socket")
    for (i = 0; i < hints.black; i++) {
        hintDiv[i].style.backgroundColor = "black";
    }
    for (i = hints.black; i < hints.white + hints.black; i++) {
        hintDiv[i].style.backgroundColor = "white";
    }
}
//generates a new code
function generateCode() {
    for (i = 0; i < 4; i++) {
        secret[i] = Math.floor(Math.random() * 6);
    }
    return secret;
}
//compares the guess to the secret
function checkCode(arr) {
    let secretCheck = secret.slice(0),
        guessCheck = arr.slice(0);
    hints = { black: 0, white: 0 };
    //check for positions
    for (i = 0; i < 4; i++) {
        if (secretCheck[i] == guessCheck[i]) {
            secretCheck[i] = guessCheck[i] = null;
            hints.black++;
        }
    }
    //check for color matches
    for (i = 0; i < 4; i++) {
        if (guessCheck.includes(secretCheck[i]) && secretCheck[i] != null) {
            guessCheck[guessCheck.findIndex(n => n == secretCheck[i])] = null; //scrap the first element that matches, so it won't return in future .include checks
            secretCheck[i] = null;
            hints.white++;
        }
    }
    console.log(`There are ${hints.black} pegs in the correct position and an additional ${hints.white} pegs of the right color.`);
}
//First time launch
generateCode();
socketInit();
//Testing keybinds
document.addEventListener('keydown', testingKeybinds);
function testingKeybinds(event) {
    console.log(event)
    console.log(event.key)
    console.log(event.target)
    let testDiv = document.getElementById('turn' + turn).getElementsByClassName("socket")
    console.log(testDiv.target)
    if (event.key == 'z') {
        revealSecret();
    }
}