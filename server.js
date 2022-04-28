const cors = require('cors');
const app = require('express')();

app.use(cors());
app.listen(3000,()=>{
    console.log('Listening on 3000');
});
app.get('/', (req, res)=>{
    res.send({res: 'Bienvenido'});
})

app.get('/tramas', async(req,res)=>{
    try {
        const list = await modelTrama.find();
        res.send(list);
    } catch (error) {
        res.send(error);
    }
});

const mqtt = require('mqtt');
const clientMqtt = mqtt.connect('mqtt://test.mosquitto.org');

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



/*const mostrar = async ( )=>{
    const list = await modelTrama.find();
    console.log(list);
}*/


const postTrama = async (temperatura, date) => {
    const trama= new modelTrama({
        name: 'temperatura',
        value: temperatura,
        date: date
    });

    const result = await trama.save();
    console.log('AGREGADO CORRECTAMENTE');
}

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

function message (topic, message){
    console.log(`${topic} - ${parseInt(message)}`);
    postTrama(message, getFecha());
}

clientMqtt.on('connect', connect);
clientMqtt.on('message', message);

module.exports = modelTrama;