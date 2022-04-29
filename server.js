const cors = require('cors');
const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
let count = 0;

//CONEXION MQTT
const mqtt = require('mqtt');
const clientMqtt = mqtt.connect('mqtt://test.mosquitto.org');
clientMqtt.on('connect', connect);

//CONEXION MONGO DB
const mongoose = require('mongoose');

const mongodb_URI = 'mongodb://localhost:27017/tramas_mqtt';

mongoose.connect(mongodb_URI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
  .then(db => console.log(`Conectado a la base de datos ${db.connections[0].name}`))
  .catch(console.log);

  
Schema = mongoose.Schema;

const schema = {
    tramaSchema: new Schema({
        name: {type: String, required: true},
        value: {type: Number,  required: true},
        date:  {type: String, required: true}
    }, {versionKey: false})
};


const modelTrama =  mongoose.model('trama', schema.tramaSchema);

//RUTAS SERVIDOR
app.use(cors());
app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/html/index.html');
})


//CONEXION SOCKET.IO
io.on('connection', (socket)=>{
    console.log('User connected');
    getTramas().then((data)=>{
        socket.emit('vectorTemp', data);
    });
    clientMqtt.on('message', (topic, message)=>{
        console.log(`${topic} - ${parseInt(message,10)}`);
        console.log(count);
        if(count == 9)  {
            count = 0;
            getTramas().then((data)=>{
                socket.emit('vectorTemp', data);
            });
            return;
        }
        count++;
        postTrama(parseInt(message,10), getFecha());
    });
    socket.on('disconnect',()=>console.log('User disconnected'));
    socket.emit('count', count);
    
})


//FUNCIONES MQTT
const postTrama = async (temperatura, date) => {
    const trama= new modelTrama({
        name: 'temperatura',
        value: temperatura,
        date: date
    });

    const result = await trama.save();
    console.log('REGISTRO AGREGADO CORRECTAMENTE');
}

const getTramas = async()=>{
    try {
        let newArray = new Array();
        const list = await modelTrama.find();
        let n = list.length;
        for( let  i= n - 1; i>= n-10; i--){
            newArray.push(list[i]);
        }
        return newArray.reverse();
    } catch (error) {
        res.send(error);
    }
};

function connect() { 
    clientMqtt.subscribe('carg/temperatura', (err)=>{
        if(!err){
            console.log('Conectado a MQTT');
        }
    });
}

function getFecha(){
    let toDay = new Date();
    let fecha = addZero(toDay.getDate())+'/'+addZero(toDay.getMonth())+'/'+addZero(toDay.getFullYear())+' '+ addZero(toDay.getHours())+':'+addZero(toDay.getMinutes());

    return fecha;
}

function addZero (num){
    let newNum = "0";
    if(num < 10){
      newNum += num.toString();
      return newNum
    }
    return num;
  }


server.listen(3000, ()=>{
    console.log('Listing on 3000');
});
module.exports = modelTrama;