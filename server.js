//constants for local server
//empty object to act as endpoint
let projectData = [];
const newData = [];
// projectData = {
//     'name':"morgan",
//     'age':'30'
// }

//express to run sever and routes
const express = require('express');
// const http = require('http');
//create an instance of express on app
const app = express();

//dependencies
const bodyParser = require('body-parser')

//middleware
const cors = require('cors');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


//pointing the code to the project folder (initialize)
app.use(express.static('website')); 
app.use(express.json());


//constants for local server
const port = 7550;
//create a local server using Node and Express
const server = app.listen(port, listening);
//listening function
function listening () {
    console.log(`server is running on ${port}`);
}


app.get('/', (req,res) => {
    res.send(projectData);
    // console.log(projectData);
})

app.get('/add', (req,res) => {
    res.send(projectData);
    console.log(projectData);
})

//NOTE: might have been an issue with two post calls confusing the network with same credentials
// app.post('/', (req,res) => {
//     let data = req.body
//     //how do i make POST route anticipate 3 pieces of data 
//     projectData.push(data);
//     console.log(req.body);
// })

app.post('/add', (req,res) => {
    // console.log('using the /add post');
    let data = req.body;
    projectData.push(data);
    // console.log(req.body);
    res.send("POST received");
})