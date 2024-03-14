var istruzioni = [];
var active = false;
var priority = false;
var log = document.getElementById("log");

async function Esegui () {
    
    if(!active)
    {
        log.innerHTML = " STA ESEGUENDO";
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
        log.innerHTML = "";
    }
    else
    {
        log.innerHTML = " Sta già facendo altro!! "
        istruzioni = []
        console.log("Sta già facendo altro!!")
    }
    
    
}



async function EseguiPriority (instruction) {
    
    priority = true;
    while(active) //aspettiamo finche il comando precedente finisce
    {
        console.log(".")
        await wait(1000)
    } 
    
    active = true;
    /*console.log("Eseguendo comando Priority!")
    try
    {
        fetch('/connect', {method: 'POST'});
    }
    catch(err)
    {
        console.log("Catturato" + err);
    }*/

    await wait(2000)


    try{
        response = fetch('/'+instruction, {method: 'POST'});
    }
    catch(err)
    {
        console.log("Catturato" + err);
    }

    await wait(8000)  

    console.log(instruction + " fatta.") 
    
    priority = false;
    active = false;
}

const wait = (msec) => new Promise((resolve, _) => {
    setTimeout(resolve, msec)});