/* Global Variables */
//came with set up code
// Create a new date instance dynamically with JS
// let d = new Date();
// let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


let emptyData = {};



//need const for entire container to add event listener to date and zipcode
const appContainer = document.getElementById('app');
//made a div just for the needed data to add eventlistener
const neededData = document.getElementById('neededData');
//grab input box to add event listener to
const zipCode = document.getElementById('zip');


//the base part of the url for get city info with zip code 
const baseUrl = 'http://api.openweathermap.org/geo/1.0/zip?zip='
//the last part with API key 
const apiKey = '&appid=175c228ba1b034eb1471d0c1f8094853'
//more weather api using the latr/ lon data gathered 
const baseUrlWeather='https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={APIkey}';
const apiKeyNumber = '175c228ba1b034eb1471d0c1f8094853';

https://tile.openweathermap.org/map/temp_new/5/8/10.png?appid=175c228ba1b034eb1471d0c1f8094853

//empty data varibale for collecting and setting data globally
//the changing varibale of the zip code 
const zip = [];
//empty array for the date info
const dateData = [];
//empty string for zip to be converted from
let zipString = "";
//empty array for feelings
let entryObject = {};

//should i make an empty object to store data for json response?
const weatherData = {};



const generate = document.getElementById('generate');


//function to call get request to grab data for post?
function dataEntry() {

    //create variable for text area data entry .. tried as global but wasn't working 
    const content = document.getElementById('feelings').value;
    //create variable for temp
    //TODO: will need to change this a bit since I will be getting the info dyncamicly form json
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

    entryObject = newEntryData; 

    //take new entry and input into entries box
    const dateEntry = document.getElementById('date');
    const tempEntry = document.getElementById('temp');
    const contentEntry = document.getElementById('content');
    
    //fill in new entry with data
    dateEntry.innerText = newEntryData.date;
    tempEntry.innerText = newEntryData.temp;
    contentEntry.innerText = newEntryData.content;
}


//routes
const get = async (url = '') => {
    const req = await fetch(url)
    .then(response => response.json())
    .then(data => {
        emptyData = data;
    })
    // console.log(emptyData.lat, emptyData.lon, emptyData.name)
    return emptyData
}

const post = async (url = '', data ) => {
    
    console.log(data);

    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
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


//function for checking if date and zip exists 
function checkData () {
    const locationText = document.getElementsByClassName('location');
    //will grab data for zip and date
    getData();

    //checking to see if zip exists
    if (zip.length !== 0) {
        //get data and stored into emptyData object
        get(url = `${baseUrl + zip + apiKey}`)
    }    

    // need to delay name change so computer has time to grab data
    setTimeout( () => {
        //if statement so doesn't change name to nonexistent name
        if (emptyData.name) {
            weatherData['City'] = emptyData.name;
            locationText[0].innerText = weatherData.City;
        }
    }, 3000)
    

    setTimeout(getWeather, 3000);

}

//function to grab weather according to lat/lon location
function getWeather() {
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
            weatherUrl = baseUrlWeather.replace('{lat}', `${lat}`).replace('{lon}', `${lon}`).replace('{APIkey}', `${apiKeyNumber}`).replace('{part}', 'minutely,hourly,alerts').concat('','&units=imperial');
            // console.log(weatherUrl);
            
        }
    
    //make a get & post call?
    //this now changes the value of emptyData to the new json reutrn from the GET request

    get(url = weatherUrl);

    

    // update temp and icon area
    setTimeout(updateWeatherWidget, 3000)

    //post?
    // post(url = weatherUrl, emptyData);
    //post creates a 'body' from the data I need the icon/ temp 


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





//function to grab date and zip info 
function getData () {
    //grab inner text for zip code input 
    let zipNumber = document.getElementById('zip').value;
    // console.log(zipNumber)
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


//TODO: write javasrcipt for loading icon reference dog webpage
function loading () {

};

//TODO: want to add interactive svg of avalanche danger rose



function init() {
//add event listener to the whole page to wait till both zip and date is added
neededData.addEventListener('mouseout', checkData);





//event listener for the entry box button to hit submit 
generate.addEventListener("click", dataEntry);




};

init();
