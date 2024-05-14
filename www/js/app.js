//const { Actor } = require("git");

var istruzioni = [];
var active = false;
var priority = false;
var log = document.getElementById("logDoc");
//var log = document.getElementsByTagName("span")

async function Esegui () {
    
    if(!active)
    {
        //log.innerHTML = " STA ESEGUENDO";
        active = true;
        
        console.log("Eseguendo!")
        istruzioni2 = istruzioni
        istruzioni = []
        i=0
    
        console.log(istruzioni2);
        if(istruzioni2.length>0){
            /*try{
                fetch('/connect', {method: 'POST'});
            }
            catch(err)
            {
                console.log("Catturato" + err);
            }*/
    
            await wait(2000)
            for(i=0;i<istruzioni2.length && !priority;i++){
                try{
                    response = fetch('/'+istruzioni2[i], {method: 'POST'});
                    //log.innerHTML = " STA ESEGUENDO: " + istruzioni2[i];
                }
                catch(err)
                {
                    console.log("Catturato" + err);
                }

                await wait(8000)  
    
                console.log(istruzioni2[i] + " fatta.") 
            }
        }
        active = false;
        //log.innerHTML = "";
        return true;
    }
    else
    {
        
        //log.innerHTML = " Sta già facendo altro!! "
        istruzioni = []
        console.log("Sta già facendo altro!!")
        return false;
    }
    
    
}

var waitQueue = []

async function EseguiPriority (instruction) {
    
    //priority = true;
    if(instruction != "emergency") //aspettiamo finche il comando precedente finisce
    {
        if(active && !priority) //se un comando non di priorita sta venendo eseguito aspetta
        {
            priority = true;
            await wait(8000);
        }
        waitQueue.unshift(instruction) //inserisci comando nella coda di attesa
        return
    } 
    {
        //E un emergenza!!!!!
        fetch('/emergency', {method: 'POST'})
    }
    
    /*active = true;

    try{
        response = fetch('/'+instruction, {method: 'POST'});
        log.innerHTML = " STA ESEGUENDO: " + instruction;
    }
    catch(err)
    {
        console.log("Catturato" + err);
    }

    await wait(8000)  

    console.log(instruction + " fatta.") 
    log.innerHTML = " ";
    priority = false;
    active = false;*/
}


async function refresh(){

    console.log(waitQueue)
    if(waitQueue.length != 0) //se ci sono comandi
    {
        priority = true; //inizia a eseguire
        active = true;
        /*for(i=0; i<waitQueue.length; i++)
        {*/
        try
        {
            var command = waitQueue.pop();
            response = fetch('/'+ command, {method: 'POST'});
            log.innerHTML = " STA ESEGUENDO: " + command;
            log.innerHTML += "<br><br>" + waitQueue;

            await wait(10000)  

            console.log(command + " fatta.") 
            log.innerHTML = "Fatto";
            log.innerHTML += "<br><br>" + waitQueue;
        }
        catch(err)
        {
            console.log("Catturato" + err);
        }

            
        //}
        active = false;
        priority = false;
    }
    else{
        await wait(1000);
    }
    refresh()
}

//setTimeout(function(){setInterval(refresh, 10000);}, 5000)

setTimeout(refresh, 3000)
  
const wait = (msec) => new Promise((resolve, _) => {
    setTimeout(resolve, msec)});