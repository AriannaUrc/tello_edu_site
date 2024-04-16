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




const telloID = 'TELLO-ED410E'//TELLO-F03CE6';
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

const dgram = require('dgram');
//const { battery } = require('tellojs/src/commands/read');
const telloSocket = dgram.createSocket('udp4');
telloSocket.bind(telloPort);
const TelloWIFIConnect = require('./TelloConnect').TelloWIFIConnect;


telloSocket.on('message', (message, info) => {
    // get the information about server address, port, and size of packet received.
  
    console.log('Address: ', info.address, 'Port: ', info.port, 'Size: ', info.size)
  
    //read message from server
  
    console.log('Message from server', message.toString())
  })

const refresh = async function (){
    try {

        /*telloSocket.send('command', telloPort, telloHost);
         
        telloSocket.send('time?', telloPort, telloHost);
        telloSocket.send('speed?', telloPort, telloHost);   */
        //var battery;
        //telloSocket.listen(telloPort, telloHost, battery)         
        //console.log(`Battery: ${battery}`)

        //telloSocket.send('speed?', telloPort, telloHost);
        Commandrefresh();
        telloSocket.send('battery?', telloPort, telloHost);
         
    } 
    
    catch (error) {
        console.log( "catched in refresh" + error);
    }
}


/*const Commandrefresh = async function (){
    try {
        telloSocket.send('command', telloPort, telloHost);
        console.log("command")
    } 
    
    catch (error) {
        console.log( "catched in refresh" + error);
    }
}*/

//connetiti al wifi e prerara il drone
const beforeStartApi = async function () {
    try {
        await TelloWIFIConnect(telloID);

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        }
        );

        telloSocket.send('command', telloPort, telloHost);

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 4000);
        }
        );

        telloSocket.send('streamon', telloPort, telloHost);
        
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


    } catch (e) {
        console.error(e);
    } 
};



/*app.post('/refresh', async (req, res) => {
    try{
    console.log('refresh data...');
    refresh();

    telloSocket.send('battery?', telloPort, telloHost);      

    } catch(error){
        console.log("Catched while refreshing: " + error)
    } 

})*/

app.post('/takeOff', async (req, res) => {
    try{
    console.log('Taking off...');
    //await sdk.control.takeOff()
    telloSocket.send('takeoff', telloPort, telloHost);
    await wait(waitMedium)
    console.log('took off')
    } catch(error){
        console.log("Catched in take off: " + error)
    } 

})

app.post('/forward', async (req, res) => {
    try{
    console.log('Moving forward...');
    telloSocket.send('forward 100', telloPort, telloHost);
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched in forward: " + error)
    } 
})

app.post('/backward', async (req, res) => {
    try{
    console.log('Moving backward...');
    telloSocket.send('back 100', telloPort, telloHost);
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched in backward: " + error)
    } 
})

app.post('/up', async (req, res) => {
    try{
    console.log('Moving up...');
    telloSocket.send('up 100', telloPort, telloHost);
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched in up: " + error)
    } 
})

app.post('/down', async (req, res) => {
    try{
    console.log('Moving down...');
    telloSocket.send('down 100', telloPort, telloHost);
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched in down: " + error)
    } 
})

app.post('/left', async (req, res) => {
    try{
    console.log('Moving left...');
    telloSocket.send('left 100', telloPort, telloHost);
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched in left: " + error)
    } 
})

app.post('/right', async (req, res) => {
    try{
    console.log('Moving right...');
    telloSocket.send('right 100', telloPort, telloHost);
    await wait(waitMedium)
    console.log('moved')
    } catch(error){
        console.log("Catched in right: " + error)
    } 
})

app.post('/rotateRight', async (req, res) => {
    try{
        console.log('rotate right...');
        telloSocket.send('cw 90', telloPort, telloHost);
        await wait(waitMedium)
        console.log('rotated')
    }
    catch(error)
    {
        console.log("Catched in cw: " + error)
    } 
    
})

app.post('/rotateleft', async (req, res) => {
    try{
        console.log('rotate left...');
        telloSocket.send('ccw 90', telloPort, telloHost);
        await wait(waitMedium)
        console.log('rotated')
    }
    catch(error)
    {
        console.log("Catched ccw: " + error)
    }     
})

//landing function
app.post('/land', async (req, res) => { //add try catch
    try{
    console.log('landing...');
    telloSocket.send('land', telloPort, telloHost);
    await wait(waitMedium)
    console.log('landed')
    } catch(error)
    {
    console.log("Catched in landing: " + error)
    } 
    
})


beforeStartApi()
    .then( () => {
        const port = 3000;
        app.listen(port, function () {
            console.log(`app listening at \x1b[32mport ${port}\x1b[0m`);
        });
        setTimeout(function(){setInterval(Commandrefresh, 5000);}, 10000)

        /*setTimeout(function(){

            telloSocket.send('command', telloPort, telloHost);}, 10000)*/

    })
    .catch((err) => { console.error("main" + err);});

    