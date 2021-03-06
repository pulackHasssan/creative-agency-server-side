const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = 2000;

require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfohl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send('Welcome to Creative Agency Server Side')
})


client.connect(err => {
  const orderCollection = client.db("creative-agency").collection("customer-order");
  const reviewCollection = client.db("creative-agency").collection("customer-review");
  const adminCollection = client.db("creative-agency").collection("Admin");
  app.post('/addOrder', (req,res)=>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  })

  app.get('/order', (req, res)=>{
    orderCollection.find({email: req.query.email})
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

  //for admin
app.get('/orders', (req, res)=>{
  orderCollection.find({})
  .toArray((error, documents)=>{
    res.send(documents)
  })
})

app.post('/addAdmin', (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    adminCollection.insertOne({name, email})
    .then(result=>{
      res.send(result.insertedCount >0)
    })
})

app.get('/admin', (req,res)=>{
  adminCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.post('/checkAdmin', (req,res)=>{
  const email = req.body.email;
  adminCollection.find({email: email})
  .toArray((err, admin)=>{
    res.send(admin.length > 0)
  })
})

});

app.listen(process.env.PORT || port);
