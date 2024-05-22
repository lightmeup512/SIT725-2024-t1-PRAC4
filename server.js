var express = require("express")
var app = express()
app.use(express.static(__dirname + '/public')) // Specify public directory
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hassan:7rF30j14IOS44u7K@cluster0.wtxmdcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("Cars").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}


app.post('/api/cars', async (req, res) => {
    let car = req.body;
    let result = await postCar(car);
    client.close();
    res.json({ statusCode: 201, message: 'success', data: result });
});

async function postCar(car) {
    await client.connect();
    let collection = await client.db('Cars').collection('Info');
    return collection.insertOne(car);
}

app.get('/api/cars', async (req, res) => {
    let result = await getAllCars();
    client.close();
    res.json({ statusCode: 201, message: 'success', data: result });
});

async function getAllCars() {
    await client.connect();
    let collection = await client.db('Cars').collection('Info');
    return collection.find().toArray();
}

// Serve index.html file when accessing root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log("App listening to: " + port)
})
