function Connect(){
    console.log("Connect")
    fetch('/connect', {method: 'POST'})
}
function TakeOff () {
    console.log("Take off")
    fetch('/takeOff',  {method: 'POST'})
}
function Land () {
    console.log("Land")
    fetch('/land',  {method: 'POST'})
}
