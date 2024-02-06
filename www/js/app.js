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
function Esegui () {
    //const response = fetch('/connect', {method: 'POST'});
    for(i=0;i<istruzioni.length;i++){
        while(!response.ok){
            console.log("Sto aspettando");
        }    
        response = fetch('/'+istruzioni[i], {method: 'POST'});
        /*setTimeout(function(){
        }, 5000); */      
        console.log(istruzioni[i] + " fatta.") 
    }
    istruzioni = []
}
