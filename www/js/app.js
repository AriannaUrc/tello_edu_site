//const { response } = require("express");

var istruzioni = [];

function Connect(){
    console.log("Connect")
    fetch('/connect', {method: 'POST'})
}
function TakeOff () {
    console.log("Take off")
    istruzioni.push("takeOff")
    //fetch('/takeOff',  {method: 'POST'})
}
function Land () {
    console.log("Land")
    istruzioni.push("land")
    //fetch('/land',  {method: 'POST'})
}
function Forward () {
    console.log("move")
    istruzioni.push("forward")
    //fetch('/forward',  {method: 'POST'})
}
function RotateRight () {
    console.log("rotate right")
    istruzioni.push("rotateright")
    //fetch('/rotateright',  {method: 'POST'})
}
function RotateLeft () {
    console.log("rotate left")
    istruzioni.push("rotateleft")
    //fetch('/rotateleft',  {method: 'POST'})
}
async function Esegui () {
    //document.getElementById("esegui").disabled = true;

    console.lot("Eseguendo!")
    istruzioni2 = istruzioni
    istruzioni = []
    i=0

    console.log(istruzioni2);
    if(istruzioni2.length>0){
        try{
            fetch('/connect', {method: 'POST'});
        }
        catch(err)
        {
            console.log("Catturato" + err);
        }

        await wait(2000)
        for(i=0;i<istruzioni2.length;i++){
            /*while(!response.ok){
                console.log("Sto aspettando");
            }*/    
            try{
                response = fetch('/'+istruzioni2[i], {method: 'POST'});
            }
            catch(err)
            {
                console.log("Catturato" + err);
            }
            /*setTimeout(function(){
            }, 5000); */
            await wait(8000)  

            console.log(istruzioni2[i] + " fatta.") 
        }
    }

    //document.getElementById("esegui").disabled = false;
}

const wait = (msec) => new Promise((resolve, _) => {
    setTimeout(resolve, msec)});