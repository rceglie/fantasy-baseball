window.addEventListener("load", function(){

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      
    delay(5000).then(() => startup());


});

var players = []
var correct = []

var dict = {
    "C": [0],
    "1B": [1],
    "2B": [2],
    "3B": [3],
    "SS": [4],
    "2B/SS": [5],
    "1B/3B": [6],
    "OF": [7,8,9,10,11],
    "UTIL": [12],
    "Bench" : [],
    "IR": []
};

function startup(){

    let runbtn = document.createElement("button");
    runbtn.textContent = "Run";
    runbtn.className = "Button Button--alt Button--custom ml4 action-buttons"; 
    runbtn.onclick = (() => {
        createPlayers()
    });
    document.getElementsByClassName("myTeamButtons").item(0).appendChild(runbtn);

    document.getElementsByClassName("jsx-1110888263 tooltip-text").item(0).textContent = "Limits";

}

function createPlayers(){

    players = []

    const table = document.getElementsByClassName("Table__TBODY").item(0);

    for (let i in table.rows){
        if (i <= table.rows.length - 1){

            let playerName = "";
            let playerPos = [];
            let playerValue = 0;
            let playerPlaying = false;
            let playerSlot = -1;

            let cell = table.rows[i].cells[1];

            if (cell.querySelectorAll('[title="Player"]').length == 0){
                playerName = cell.getElementsByClassName("AnchorLink link clr-link pointer").item(0).textContent;
                playerPos = cell.getElementsByClassName("playerinfo__playerpos").item(0).textContent.split(", ")
                playerPlaying = table.rows[i].cells[3].getElementsByClassName("pro-team-abbrev").length > 0;
                playerSlot = table.rows[i].cells[0].getElementsByClassName("table--cell").item(0).textContent;
                players.push(new Player(playerName, playerPos, playerValue, playerPlaying, playerSlot))
            }

        }
    }

    console.log(players)

    correct = calculate(players)
    console.log(correct)

    stepOne()

}

async function stepOne(){
    
    // Step 1: Move players that are in the wrong spot to the bench

    for (let i = 0; i < players.length; i++){
        //console.log(players[i].slot)
        //console.log(dict[players[i].slot])
        if (!dict[players[i].slot].includes(correct.indexOf(i)) && players[i].slot != "Bench"){
            toBench(players[i]);
            await sleep(1750)
        } else if (players[i].slot != "Bench"){
            players[i].correct = 1
        }
        if (!correct.includes(i) && players[i].slot == "Bench"){
            players[i].correct = 1
        }
    }

    console.log(players)

    console.log("--------------- DONE WITH PART 1 ---------")

    await sleep(2000)

    stepTwo()

}

async function stepTwo(){

    let rows = document.getElementsByClassName("Table__TBODY").item(0).childNodes

    // Step 2: Move bench players into correct position

    let correctOF = 0;
    for (let i = 0; i < players.length; i++){
        if (players[i].slot == "OF" && players[i].correct == 1){
            correctOF++;
        }
    }
    console.log(correctOF)

    for (let i = 0; i < players.length; i++){
        let p = players[i]
        if (p.correct == 0){

            let target;
            let temp = [].slice.call(document.getElementsByTagName("button"))
            for (let j = 0; j < temp.length; j++){
                if (temp[j].ariaLabel != null && temp[j].ariaLabel.includes(players[i].Name)){
                    target = temp[j]
                }
            }
            target.click()
            await sleep(750)

            target = null;

            let seenOF = 0
            // console.log(p)
            for (let j = 0; j < rows.length; j++){
                let slot = rows.item(j).childNodes.item(0).childNodes.item(0).textContent
                if (correct.includes(i) && [7,8,9,10,11].includes(correct.indexOf(i))){ // If player is in correct and correct has them as an outfielder
                    console.log("outfielder")
                    if (slot == "OF"){
                        if (seenOF == correctOF){
                            target = rows.item(j).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0)
                            console.log(target)
                            correctOF++;
                        }
                        seenOF++;
                    }
                }
                else if (correct[dict[slot]] == i && correct.includes(i) ){
                    target = rows.item(j).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0)
                    console.log("found button:")
                    console.log(target)
                }
                //console.log(rows.item(j).childNodes.item(0))
            }

            target.click()
            await sleep(750)
            

        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function allToBench(players){
    for (p of players){
        if (p.slot != "Bench"){
            toBench(p)
            await sleep(1750)
            p.slot = "Bench"
        }
    }
}

async function toBench(player){

    console.log("Moving: ", player)

    await sleep(1000)

    let target;
    let temp = [].slice.call(document.getElementsByTagName("button"))
    for (let i = 0; i < temp.length; i++){
        if (temp[i].ariaLabel != null && temp[i].ariaLabel.includes(player.Name)){
            target = temp[i]
        }
    }
    target.click()

    await sleep(500)

    temp = [].slice.call(document.getElementsByTagName("button"))
    for (let i = 0; i < temp.length; i++){
        if (temp[i].ariaLabel == "Move"){
            target = temp[i];
        }
    }

    target.click()

    console.log("Done")

}