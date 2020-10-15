const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nfohl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send('Welcome to Creative Agency Server Side')
})


client.connect(err => {
  const orderCollection = client.db("creative-agency").collection("customer-service-form");
  const reviewCollection = client.db("creative-agency").collection("customer-review");
  app.post('/addOrder', (req,res)=>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  })

  app.get('/order', (req, res)=>{
    orderCollection.find({})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })

  app.post('/addReview', (req,res)=>{
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  })

  app.get('/review', (req,res)=>{
    reviewCollection.find({})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })
});

app.listen(process.env.PORT || 1000);
