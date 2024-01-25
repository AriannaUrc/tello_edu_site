const sdk = require('tellojs')


const main = async () => {

    console.log("connecting...")
    await sdk.control.connect()

    let battery = await sdk.read.battery()                      
    console.log(`Battery: ${battery}`)

    //wait for 2 seconds async
    await new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve()
    }, 1000);
    })

    console.log("waiting to fly...");
   
    await sdk.control.takeOff();

    //wait for 2 seconds async
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 2000);
    })
    
   


    console.log("moving...")
    await sdk.control.move.front(100)

    //wait for 2 seconds async
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 2000);
    })

    await sdk.control.flip.left()

    //wait for 2 seconds async
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 2000);
    })

    await sdk.control.flip.right()
    
    //wait for 2 seconds async
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 2000);
    })


    console.log("back to land...")
    await sdk.control.land()
    


}



main()
    .then(() => console.log('Done'))
    .catch(err => console.error(err));


 