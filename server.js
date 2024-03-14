const express = require('express')
const sdk = require('tellojs')
const { spawn } = require('child_process');
const WriteStream = require('stream').Writable;
const unpipe = require('unpipe');


//funzione wait
const waitMedium = 2000
const waitLarge = 4000

const wait = (msec) => new Promise((resolve, _) => {
    setTimeout(resolve, msec)});


/*app.get("/", (req, res) => {
    res.render("index")
    //Hello <%= locals.text || 'Default' %>
} )
const userRouter = require('./routers/users')
//const postRouter = require('./routers/posts')

app.use('/users', userRouter)
//app.use('/posts', postRouter) */




const telloID = 'TELLO-ED4072'//TELLO-F03CE6';
const telloHost = '192.168.10.1';
const telloPort = 8889;

// .\mjpegserver.exe -a 127.0.0.1:9000 -- ffmpeg -i udp://192.168.10.1:11111 -video_size 640x480 -framerate 5 -threads 5 -f mpjpeg -r 5 -q 5  -

// ------------------------------------------------------------
const MjpegCamera = require('mjpeg-camera');
var camera = new MjpegCamera({
    user: '',
    password: '',
    url: 'http://127.0.0.1:9000',
    name: telloID
});
camera.start();
// ------------------------------------------------------------


const app = express();

app.use(express.static('www'))
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("index")
    //Hello <%= locals.text || 'Default' %>
} )

app.get('/check', (req, res) => {
    res.send('ok');
});



const boundary = '--boundandrebound'; // boundary per il multipart, ci serve per separare i frame jpeg
app.get('/stream', (req, res) => {
    
    res.writeHead(200, { 'Content-Type': 'multipart/x-mixed-replace; boundary=' + boundary });

    // ------------------------------------------------------------
    let ws = new WriteStream({ objectMode: true });
    ws._write = async function (chunk, enc, next) {
        let jpeg = chunk.data;

        
        res.write(boundary + '\nContent-Type: image/jpeg\nContent-Length: ' + jpeg.length + '\n\n');
        res.write(jpeg);
        next();
    };

    camera.pipe(ws);
    // ------------------------------------------------------------    

    res.on('close', function () {
        unpipe(camera);
    });

});


//connetiti al wifi e prerara il drone
const beforeStartApi = async function () {
    try {

        const TelloWIFIConnect = require('./TelloConnect').TelloWIFIConnect;

        await TelloWIFIConnect(telloID);

        const dgram = require('dgram');
        const telloSocket = dgram.createSocket('udp4');
        telloSocket.bind(telloPort);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        }
        );
        
        try {
            telloSocket.send('command', telloPort, telloHost);

            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            }
            );

            telloSocket.send('streamon', telloPort, telloHost);
            
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            }
            );

            console.log("ok")       
        } 
        
        catch (error) {
            console.log(error);
        }


    } catch (e) {
        console.error(e);
    }
};



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

app.post('/backward', async (req, res) => {
    try{
    console.log('Moving backward...');
    await sdk.control.move.back(100)
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched: " + error)
    } 
})

app.post('/up', async (req, res) => {
    try{
    console.log('Moving up...');
    await sdk.control.move.up(100)
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched: " + error)
    } 
})

app.post('/down', async (req, res) => {
    try{
    console.log('Moving down...');
    await sdk.control.move.down(100)
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched: " + error)
    } 
})

app.post('/left', async (req, res) => {
    try{
    console.log('Moving left...');
    await sdk.control.move.left(100)
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched: " + error)
    } 
})

app.post('/right', async (req, res) => {
    try{
    console.log('Moving right...');
    await sdk.control.move.right(100)
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched: " + error)
    } 
})

app.post('/rotateRight', async (req, res) => {
    try{
        console.log('rotate right...');
        await sdk.control.rotate.clockwise(90)
        await wait(waitMedium)
        console.log('rotated')
    }
    catch(error)
    {
        console.log("Catched: " + error)
    } 
    
})

app.post('/rotateleft', async (req, res) => {
    try{
        console.log('rotate left...');
        await sdk.control.rotate.counterClockwise(90)
        await wait(waitMedium)
        console.log('rotated')
    }
    catch(error)
    {
        console.log("Catched: " + error)
    }     
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


beforeStartApi()
    .then( () => {
        const port = 3000;
        app.listen(port, function () {
            console.log(`app listening at \x1b[32mport ${port}\x1b[0m`);
        });


    })
    .catch((err) => { console.error(err);});