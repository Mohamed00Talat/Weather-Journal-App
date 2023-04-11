/* Global Variables */
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";
const key = "&appid=06f8dc466efbb4ca2643f785d8938994&units=metric";
const zipcode = document.getElementById("zip");

const button = document.getElementById("generate");
const error = document.getElementById("error");

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

// Add event listener on the generate button
button.addEventListener("click", mainFunction);

function mainFunction(e) {
  getWeatherData(baseUrl, zipcode.value, key).then((data) => {
    const feelings = document.getElementById("feelings").value;

    // Show error message to user
    if (data.cod != 200) {
      error.innerHTML = data.message;
      setTimeout(() => (error.innerHTML = ""), 2000);

      // return promises and get the data from the api object
    } else {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      const clientData = {
        newDate,
        temp,
        description,
        city,
        feelings,
      };

      postData(clientData);
      updateUI();

      document.getElementById("icon").style.display = "flex";
      document.getElementById("entryHolder").style.opacity = 1;
    }
  });
}

// function to get Api data
const getWeatherData = async (baseUrl, zipcode, key) => {
  const res = await fetch(baseUrl + zipcode + key);

  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

// send post request to the server and post data
const postData = async (data) => {
  const req = await fetch("/add", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    throw error;
  }
};

// updating UI
const updateUI = async () => {
  const request = await fetch("/all");
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    // Write updated data to DOM elements
    document.getElementById("temp").innerHTML =
      Math.round(allData.temp) + "&#x2103";
    document.getElementById("content").innerHTML = `Mood: ${allData.feelings}`;
    document.getElementById("date").innerHTML = allData.newDate;
    document.getElementById("city").innerHTML = `City Name: ${allData.city}`;
    document.getElementById("description").innerHTML = allData.description;
    document.querySelector("h2").innerHTML = `Weather In ${allData.city}`;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};
