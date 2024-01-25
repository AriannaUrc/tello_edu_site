const express = require('express')
const app = express()
const sdk = require('tellojs')

const waitMedium = 2000

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
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitMedium);
    })
    res.sendStatus(200);
    console.log('Connected');
});

app.post('/takeOff', async (req, res) => {
    console.log('Taking off...');
    await sdk.control.takeOff()
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitMedium);
    })
    res.sendStatus(200);
    console.log('Took off');
})

app.post('/land', async (req, res) => { //add try catch
    console.log('landing...');
    await sdk.control.land()
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, waitMedium);
    })
    res.sendStatus(200);
    console.log('Landed');
})

app.listen(3000)