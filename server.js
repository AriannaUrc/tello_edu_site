const express = require('express')
const app = express()
const sdk = require('tellojs')

const waitMedium = 2000
const waitLarge = 4000

app.use(express.static('www'))
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("index")
    //Hello <%= locals.text || 'Default' %>
} )

/*const userRouter = require('./routers/users')
//const postRouter = require('./routers/posts')

app.use('/users', userRouter)
//app.use('/posts', postRouter) */

app.post('/connect', async (req, res) => {
    try{
        console.log('Connecting');
        await sdk.control.connect()
        let battery = await sdk.read.battery() 
        console.log(`Battery: ${battery}`)
        res.sendStatus(200);

        console.log('Connected');

    } catch(error){
        console.log("Catched: " + error)
    } 
    
    
});

app.post('/takeOff', async (req, res) => {
    try{
    console.log('Taking off...');
    await sdk.control.takeOff()
    await wait(waitMedium)
    console.log('took off')
    } catch(error){
        console.log("Catched: " + error)
    } 

})
app.post('/forward', async (req, res) => {
    try{
    console.log('Moving forward...');
    await sdk.control.move.front(100)
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched: " + error)
    } 
})


app.post('/rotateright', async (req, res) => {
    console.log('rotate right...');
    await sdk.control.rotate.clockwise(90)
    await wait(waitMedium)
    console.log('rotated')
})

app.post('/rotateleft', async (req, res) => {
    console.log('rotate left...');
    await sdk.control.rotate.counterClockwise(90)
    await wait(waitMedium)
    console.log('rotated')
    
})

//landing function
app.post('/land', async (req, res) => { //add try catch
    try{
    console.log('landing...');
    await sdk.control.land()
    await wait(waitMedium)
    console.log('landed')
    } catch(error)
    {
    console.log("Catched: " + error)
    } 
    
})

const wait = (msec) => new Promise((resolve, _) => {
    setTimeout(resolve, msec)});

app.listen(3000)


/* try{
    await sdk.control.rotate.counterClockwise(90)
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitMedium);
    })
    res.sendStatus(200);
    console.log('rotated left');
}catch(error){
    console.log(error);
    res.sendStatus(404);
} */