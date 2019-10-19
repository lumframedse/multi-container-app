const express = require('express');
const redis = require('redis');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys');
const {promisify} = require('util');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const pgClient = new Pool({
    host:keys.pgHost,
    port:keys.pgPort,
    user:keys.pgUser,
    password:keys.pgPassword,
    database:keys.pgDatabase,
});

pgClient.on('error',()=>{
    console.log('lost pg connection');
});

pgClient.query('CREATE TABLE IF NOT EXISTS values ( number INT)').catch(err=> console.log(err));


const redisClient = redis.createClient({
    host:keys.redisHost,
    port:keys.redisPort,
    retry_strategy:()=>1000
});
const getAllHashValues = promisify(redisClient.hgetall).bind(redisClient);

const redisPublisher = redisClient.duplicate();



app.get('/',(req,res)=>{
    res.send('Hi there!')
});

app.get('/values/all',async (req,res)=>{
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.get('/values/current', async (req,res)=>{
    const currentValues = await getAllHashValues('values');
    res.send(currentValues);
});

app.post('/values', async(req,res)=>{
    const index = req.body.index;
    if (parseInt(index)>20){
        return res.status(422).send({error:true,message:'Index value is too high (>20)'})
    }
    redisClient.hset('values',index,'Nothing yet!');
    redisPublisher.publish('insert',index);
    pgClient.query('INSERT INTO values(number) VALUES($1)',[index]);
    res.send({working:true})
})

app.listen(5000, () => console.log('Listening'))