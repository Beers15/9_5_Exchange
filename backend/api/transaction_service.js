const express = require('express');
const app = express();
const port = 4002;
const { MongoClient, ObjectID } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());
app.use(cors());

const KafkaProducer = require('./KafkaProducer');
const producer = new KafkaProducer('myTopic');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = '95ExchangeDB';


client.connect(err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log('Connected successfully to transaction server');
    const db = client.db(dbName);
   
    app.post('/api/transaction', (req, res) => {
        db.collection('items')
            .updateOne({
                "_id": ObjectID(req.body.id)
            },   
            { 
                $inc: {"numTimeSold": 1},
                $push: {"purchasers": req.body.buyer}
            }        
        )
       
        db.collection('transactions').insertOne({
            id: req.body.id,
            name: req.body.name,
            timeOfPurchase: Date.now(),
            buyer: req.body.buyer,
            seller: req.body.seller,
            price: req.body.price,
            description: req.body.description
        })
        .then(
            res.send({
                valid: true
            })
        )
        .catch(
            console.log
        )
        producer.send(JSON.stringify({
            id: req.body.id,
            name: req.body.name,
            timeOfPurchase: Date.now(),
            buyer: req.body.buyer,
            seller: req.body.seller,
            price: req.body.price,
            description: req.body.description
        }));
    })
    //app.listen(port, () => console.log(`Transaction service listening on port ${port}!`)); 
    producer.connect(() => {
        app.listen(port, () => console.log(`Transaction service listening on port ${port}!`));
    })
});
