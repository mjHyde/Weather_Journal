//constants for local server
//empty object to act as endpoint
const projectData = {};
const newData = [];

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


//pointing the code to the project folder
app.use(express.static('Weather Journal')); 
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

app.post('/', (req,res) => {
    let data = req.body
    //how do i make POST route anticipate 3 pieces of data 
    projectData.push(data);
})

//post need to send data with date temp and content
app.post('/', (req,res) => {
    // res.send({'temp': '', 'date': '','content': ''});
    console.log(req.body);
})
