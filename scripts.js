//Notes: There are 6^4 = 1296 combinations, so good luck brute force Checking.
//Init
let turn = 1,
    secret = [];
const colors = ['red', 'green', 'yellow', 'blue', 'black', 'white'];
//

guess = {
    'socket 1': -1,
    'socket 2': -1,
    'socket 3': -1,
    'socket 4': -1
}
let targetDiv = document.getElementById('turn'+turn).getElementsByClassName("socket");
console.log(targetDiv)
for(i=0;i<4;i++){
targetDiv[i].addEventListener('click', socketClick);
}

function socketClick(){
    console.log(event.target.className)
    guess[event.target.className] = (guess[event.target.className]<5) ? guess[event.target.className]+1 : 0;
    event.target.style.backgroundColor = colors[guess[event.target.className]];
}

function generateCode() {
    for (i=0;i<4;i++){
    let n =  Math.floor(Math.random() * 6)
    secret[i] = colors[n];
    }
    return secret;
}
function checkCode(arr){
    let secretCheck = secret;
    let guessCheck = arr;
    let hints = {black: 0, white: 0};
    console.log(secret);
    console.log('Checking for position matches')
    for (i=0;i<4;i++){
    //check for positions
        if(secretCheck[i]==guessCheck[i]){
            console.log(`${secretCheck[i]} is in the correct position`);
            secretCheck[i]=guessCheck[i] = null;
            hints.black++;
        }
    }
    console.log(secretCheck);
    console.log(guessCheck);
    console.log('Checking for color matches')
    for (i=0;i<4;i++){
    //check for color matches
        if(guessCheck.includes(secretCheck[i]) && secretCheck[i]!=null){
            console.log(`${secretCheck[i]} is in the wrong position`);
            guessCheck[guessCheck.findIndex(n => n == secretCheck[i])] = null; //scrap the first element that matches, so it won't return in future .include checks
            secretCheck[i] = null;
            hints.white++;
        }
    }
    console.log(secretCheck);
    console.log(guessCheck);
    console.log(`There are ${hints.black} pegs in the correct position and an additional ${hints.white} pegs of the right color.`);
    turn++
}
generateCode();

let arr = ['red', 'blue', 'black', 'blue'];
checkCode(arr);

