/* 
<h2 class="card__title">Concordia, Entre Rios</h2>*/
/* ${(Ciudad, Provincia, Pais)} */
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Api de OpenWeatherMap
const getWeatherData = () => {
  const api_key = "3628272f4c97c126c5f70ddc2a9a7bc1";

  // Get the Coordinates
  navigator.geolocation.getCurrentPosition((geo) => {
    const { longitude, latitude } = geo.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&lang=es&units=metric&appid=${api_key}`
    )
      .then((e) => {
        return e.json();
      })
      .then((e) => {
        showWeatherData(e);
        const nextFiveDays = e.daily.splice(0, 5); // Next five days
        addElementsDom(nextFiveDays);
      });
  });
};

// Recibe un 'Array de Objects' y lo deplega en el 'Document'
// Forecast for the next few days
const addElementsDom = (newArr) => {
  const $container_cards = document.querySelector(".card-cont-items"), // Le agrego los Items desde el Template
    $templateEl = document.querySelector("template").content, // El Template
    $fregment = document.createDocumentFragment(); // Se crea un objeto DocumentFragment vacio

  //(date, Temp-Max y Temp-Min)
  let i = 1;
  newArr.forEach((item) => {
    let date = getDateItems(i);

    i = i + 1;
    $templateEl.querySelector(
      ".card__date"
    ).textContent = `${date.dayName} ${date.day}`;
    $templateEl.querySelector(
      ".card__temp-max"
    ).textContent = `${item.temp.max}°`;
    $templateEl.querySelector(
      ".card__temp-min"
    ).textContent = `${item.temp.min}°`;
    $templateEl.querySelector(".card__descrip").textContent = `${capitalize(
      item.weather[0].description
    )}`;

    let $clone = document.importNode($templateEl, true);
    $fregment.appendChild($clone);
  });

  $container_cards.appendChild($fregment);
};

// Get Items Dates
const getDateItems = (i) => {
  const today = new Date();
  const tomorrow = new Date(today);

  const unixTimestamp = tomorrow.setDate(tomorrow.getDate() + i);
  console.log("unixTimestamp", unixTimestamp);
  let date = new Date(unixTimestamp);
  const numeroDia = date.getDay();

  return (date = {
    dayName: dayNames[numeroDia],
    day: date.getDate(),
  });
};

// Today's Forecast
const showWeatherData = (data) => {
  const cardToday = document.querySelector(".card__today");
  let { weather, humidity, pressure, sunrise, sunset, wind_speed, temp } =
    data.current;
  let { timezone } = data;

  cardToday.innerHTML = `
  <h2 class="card__place">Tiempo en ${timezone}</h2>
  <ul class="card-cont-today">
    <li class="card__descrip">${capitalize(weather[0].description)}</li>
    <li class="card__probability">${temp}°</li>
    <li class="card__humidity">Humedad: ${humidity}%</li>
    <li class="card__pressure">Presión: ${pressure} mb</li>
    <li class="card__wind">Viento: ${wind_speed} km/h</li>
    <li class="card__sunrise">Alba: ${window
      .moment(sunrise * 1000)
      .format("HH:mm a")}</li>
    <li class="card__sunset">Ocaso: ${window
      .moment(sunset * 1000)
      .format("HH:mm a")}</li>
  </ul>`;
};

const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};

// Real-time hour and minutes
const getDate = () => {
  const dayEl = document.querySelector(".card__time-day");
  const timeEl = document.querySelector(".card__time-clock");

  setInterval(() => {
    const time = new Date();
    const month = time.getMonth(); // Mes
    const date = time.getDate(); // Numero del Dia
    const day = time.getDay(); // Nombre del Dia contiene [0..6]
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const amPm = hour >= 12 ? "PM" : "AM";
    let min = minute < 10 ? "0" + minute : minute;
    let sec = second < 10 ? "0" + second : second;

    timeEl.innerHTML = `${hour} :  ${min} : ${sec}`;
    dayEl.innerHTML = `${dayNames[day]}, ${date} ${monthNames[month]}`;
  }, 1000);
};

(function main() {
  getDate();
  getWeatherData();
})();
