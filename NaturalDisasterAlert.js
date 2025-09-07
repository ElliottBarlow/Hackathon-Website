    import { CountyDataList } from './dataset.js'

    let alertprop = null

    //start of function to know if a natural disaster is close
    fetchWeatherAPI();

    async function fetchWeatherAPI() {
        //Get's the location of all alerts in the country
        const result = await fetch("https://api.weather.gov/alerts?active=true&limit=500")
           .then(response => (response.json()))
           .then(data => {
                alertprop = data.features
                getLocation();
           });
    }

    function getLocation(){
        //checks if geolocation is enabled
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(FindCounty, error);

        } else { 
            console.log("geolocation isn't supported");
        }
    }

    function error() {
        console.log("error")
    }

    async function FindCounty(position) {
        //finds latitude and longitude
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        
        //Finds the county you are in using latitude and longitude
        const result = await fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+lat+"&lon="+lon+"&apiKey=8c0038a78d7c443faff594bbc7177339")
           .then(response => response.json())
           .then(data => {
                let county = data.features[0].properties.county.replace(" County", "")
                //Finds the counties SAME code using a datalist pre created
                let SAMEcode = CountyDataList.get(county)

                console.log("Your SAME code is: "+SAMEcode)

                //goes through each Alert warning
                alertprop.forEach(CurrentElement => {

                    //goes through each SAME code the Alert is located in
                    CurrentElement.properties.geocode.SAME.forEach(CurrentElement2 => {
                        
                        //Uncomment to test Alert System the number is the location of a current alert
                        //SAMEcode = "053013"
                        
                        //Checks if you're in the same county as the Alert
                        if (SAMEcode == CurrentElement2) {
                            console.log("ALERT")
                            const alertText = document.getElementById("ALERtext");
                            alertText.textContent = "WARNING A NATURAL DISASTER IS IN YOUR COUNTY";

                        }
                    })
                });
           });
    }