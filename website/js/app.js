/* Global Variables */
//came with set up code
// Create a new date instance dynamically with JS
// let d = new Date();
// let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


let emptyData = {};
//for the GET/POST route call to use as the URL attribute
const localServer = 'http://localhost:4550/';
//the last part with API key 
const apiKeyNumber = '175c228ba1b034eb1471d0c1f8094853';
//the base part of the url for get city info with zip code 
const baseUrl = 'http://api.openweathermap.org/geo/1.0/zip?zip='
//NOTE: allows for dynamic changes in large scale situtations like with variables
const apiKey = `&appid=${apiKeyNumber}&units=imperial`
//more weather api using the latr/ lon data gathered 
const baseUrlWeather='https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={APIkey}';


//GLOBAL VARIABLES
//need const for entire container to add event listener to date and zipcode
const appContainer = document.getElementById('app');
//made a div just for the needed data to add eventlistener
const neededData = document.getElementById('neededData');
//grab input box to add event listener to
const zipCode = document.getElementById('zip');
//for button selection
const generate = document.getElementById('generate');

// EMPTY DATA/STRING/OBJECTS
//the changing varibale of the zip code 
const zip = [];
//empty array for the date info
const dateData = [];
//empty string for zip to be converted from
let zipString = "";
//variable for weather widget
const weatherData = {};



//NON ASYNC FUNCTIONS
//function to grab date and zip info 
function getData () {
    //grab inner text for zip code input 
    let zipNumber = document.getElementById('zip').value;
    //date info
    if(dateData.length > 0){
        dateData.pop();
    }
    const entryDate = document.getElementById('entryDate').value;
    dateData.push(entryDate);

    //zip info
    //erase current value if it exists
    if(zip.length > 0) {
        zip.pop();
    }
    //checks to make zip code 5 digits
    if(zipNumber.length === 5) {
        //push data into empty array
        zip.push(zipNumber);

        //put zip into empty string global variable
        zipString = zip.toString();
    }
}

function updateWeatherWidget () {
    //grab conditions & icon element
    const iconImage = document.getElementsByClassName('icon')[0].getElementsByTagName('img');
    const conditionsElement = document.getElementsByClassName('conditions');
    const tempData = document.getElementsByClassName('temp');
    const weatherContainer = document.getElementsByClassName('weather');

    //get data to fill weather widget object
    const iconUrl = 'http://openweathermap.org/img/wn/###@2x.png';
    weatherData['conditions']  = emptyData.current.weather[0].description;
    weatherData['currentTemp']  = Math.round(emptyData.current.temp); //F
    weatherData['icon']  = emptyData.current.weather[0].icon;
    //data to use on larger screens
    weatherData['humidity'] = emptyData.current.humidity;//percent
    weatherData['windSpeed']  = Math.round(emptyData.current.wind_speed); //miles/hour
    weatherData['lowTemp']  = Math.round(emptyData.daily[0].temp.min); //F
    weatherData['highTemp']  = Math.round(emptyData.daily[0].temp.max); //F

    //load icon image
    iconImage[0].setAttribute('src', `${iconUrl.replace('###', weatherData.icon)}`);
    //change temp data
    tempData[0].innerText = `${weatherData.currentTemp} °F`;
    //change conditions
    conditionsElement[0].innerText = `${weatherData.conditions}`;
    //reveal weather container once data is updated 
    weatherContainer[0].classList.remove('hidden');
}

//function to call get request to grab data for post?
async function dataEntry() {

    //create variable for text area data entry .. tried as global but wasn't working 
    const content = document.getElementById('feelings').value;
    //create variable for temp
    const temperature = document.getElementsByClassName('temp')[0].innerText;

    //double check to make sure there is an entry
    if(feelings.length === 0) {
        console.log("error, no entry made");
        alert('need to write entry before submitting!');
        return
    }

    //create an object to post to server
    let newEntryData = new Object(); 
        //temp
        newEntryData.temp = temperature;
        //date
        newEntryData.date = dateData;
        //content
        newEntryData.content = content;

    //confirmed that i have a new object with the data collected!
    // console.log(newEntryData); 
    console.log('first check point!')
    await post('/all', newEntryData);
    console.log('second check point!')
    // let anotherEmptyData = {}
    // await post('/', anotherEmptyData)

    //this pushes data straight to entry box
        // //take new entry and input into entries box
        // const dateEntry = document.getElementById('date');
        // const tempEntry = document.getElementById('temp');
        // const contentEntry = document.getElementById('content');
        
        // //fill in new entry with data
        // dateEntry.innerText = newEntryData.date;
        // tempEntry.innerText = newEntryData.temp;
        // contentEntry.innerText = newEntryData.content;
}

//ROUTES
const get = async (url = '') => {
    const res = await fetch(url)
    try {
        const data = await res.json()
        // console.log(data);
        emptyData = data
        return emptyData
    }catch(error) {
        console.log("error", error)
    }
}

const post = async (url = '', data ) => {
    // console.log(data);

    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data), 
        });
    console.log(response);

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    }catch(error) {
        console.log("error", error);
    }
}

const retrieveData = async () =>{
    const request = await fetch('/all');
    try {
    // Transform into JSON
    const allData = await request.json()
    console.log(allData)
    // Write updated data to DOM elements
    document.getElementById('temp').innerHTML = Math.round(allData.temp)+ 'degrees';
    document.getElementById('content').innerHTML = allData.feel;
    document.getElementById("date").innerHTML =allData.date;
    }
    catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

//ASYNC FUNCTIONS

//function for checking if date and zip exists 
async function checkData () {
    const locationText = document.getElementsByClassName('location');
    const loadingImg = document.querySelector('span')
    //will grab data for zip and date
    getData();


    //checking to see if zip exists
    if (zip.length !== 0) {
        loadingImg.classList.remove('hidden');
        //get data and stored into emptyData object
        await get(url = `${baseUrl + zip + apiKey}`)
    }    

    //need to delay name change so computer has time to grab data
    //NOTES: instead of using setTimeout function can change checkData function to async to gain access to the await keyword to "pause" the function need to fill the variable
    
    //To simulate grabbing the Map data 
    setTimeout(() => {
        loadingImg.classList.add('hidden');
        // map image load
    }, 4000);

    //if statement so doesn't change name to nonexistent name
    if (emptyData.name) {
        weatherData['City'] = emptyData.name;
        locationText[0].innerText = weatherData.City;
    }
    
    //TODO:when making async put await instead of setTimeout
    await getWeather();

}

//function to grab weather according to lat/lon location
async function getWeather() {
    //create empty variable
    let weatherUrl = '';
    
    //grab the lat and lon details
    //this doesnt work for some reason
    if (Object.keys(emptyData).length !== 0) {
        // console.log('this worked!')
        let lat = emptyData.lat;
        let lon = emptyData.lon;

        // put together url for more weather details
        if (lat !==0 && lon !==0){
            //need to replace lat/lon/api/and parts to exclude
            weatherUrl = baseUrlWeather.replace('{lat}', `${lat}`).replace('{lon}', `${lon}`).replace('&appid={APIkey}', `${apiKey}`).replace('{part}', 'minutely,hourly,alerts');//.concat('','&units=imperial')        
        }
    
    //this now changes the value of emptyData to the new json reutrn from the GET request
    await get(weatherUrl);

    // update temp and icon area
    updateWeatherWidget();
    }
}

//this 'grabs' 
async function whatever() {
    const dataThis = await fetch ('http://localhost:4550/')
    console.log(dataThis)
}


// TODO:write ana async function to dynamically upate UI

// const updateUI = async () => {
//     // function to GET data from express and update HTML
//     const res = await fetch("/retrieve")
//     try {
//       const data = await res.json()
//       // Now update HTML
//     } catch (e) { throw new Error(e) }
//}
  

//FUTURE TODO: want to add interactive svg of avalanche danger rose
function init() {
//add event listener to the whole page to wait till both zip and date is added
neededData.addEventListener('mouseout', checkData);

//event listener for the entry box button to hit submit 
generate.addEventListener("click", dataEntry);
};

init();
