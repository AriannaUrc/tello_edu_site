const express = require('express')
const app = express()
const sdk = require('tellojs')

const waitMedium = 2000
const waitLarge = 2000

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
    console.log('Connecting');
    await sdk.control.connect()
        let battery = await sdk.read.battery() 
        console.log(`Battery: ${battery}`)
        res.sendStatus(200);

        console.log('Connected');
    
});

app.post('/takeOff', async (req, res) => {
    console.log('Taking off...');
    await sdk.control.takeOff()
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    })
    res.sendStatus(200);
    console.log('Took off');
})
app.post('/forward', async (req, res) => {
    console.log('Moving forward...');
    await sdk.control.move.front(100) 
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitMedium);
    })
    res.sendStatus(200);
    console.log('Moved');
})
//flipping right function
app.post('/rotateright', async (req, res) => {
    console.log('rotate right...');
    try{
        await sdk.control.rotate.clockwise(90)
    }catch(error){
        console.log(error);
    }
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitLarge);
    })
    res.sendStatus(200);
    console.log('rotated right');
})

app.post('/rotateleft', async (req, res) => {
    console.log('rotate left...');
    try{
        await sdk.control.rotate.counterClockwise(90)
    }catch(error){
        console.log(error);
    }
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitLarge);
    })
    res.sendStatus(200);
    console.log('rotated left');
})

//landing function
app.post('/land', async (req, res) => { //add try catch
    console.log('landing...');
    try {
        await sdk.control.land()
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitMedium);
    })
    res.sendStatus(200);
    console.log('Landed');
    } 
    
    catch (error) {
        console.log("error");
        res.sendStatus(200);
    }
    
})

app.listen(3000)