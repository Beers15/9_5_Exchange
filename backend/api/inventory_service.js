const express = require('express');
const app = express();
const port = 4001;
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());
app.use(cors());

const url = 'mongodb://localhost:27017';
const dbName = '95ExchangeDB';
const client = new MongoClient(url);

client.connect(err => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Connected successfully to inventory server');
    const db = client.db(dbName);

    app.get('/api/populateItems', (req, res) => {
        console.log("itemList fetched");

        db.collection('items').find({}).toArray((err, doc) => {     
            res.send({
                items: doc
            })
        })
    });

    app.post('/api/postItem', (req, res) => {
        console.log("Item has been sent to post api");
        console.log(req.body);
        var validEntry = (req.body.name !== '') && (req.body.description !== '') && (req.body.price !== -1);
        if (validEntry)
            console.log("ALL VALUES ENTERED");

        if (validEntry) {
            db.collection('items').insertOne({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                seller: req.body.seller,
                numTimeSold: 0,
                purchasers: []
            });
            res.send({
                valid: validEntry,
            })
        }
    });

    app.listen(port, () => console.log(`Inventory service listening on port ${port}!`));
});