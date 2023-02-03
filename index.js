/* https://css-tricks.com/perfect-full-page-background-image/#awesome-easy-progressive-css3-way */

const endpoints = {
  unsplash: "https://apis.scrimba.com/unsplash/photos/random",
  coingecko: "https://api.coingecko.com/api/v3/coins/",
  weather: "https://apis.scrimba.com/openweathermap/data/2.5/weather",
};
const query = {
  unsplash: "?orientation=landscape&query=nature",
  coingecko: "bitcoin",
};

const time = document.getElementById("time");
const author = document.getElementById("author");
const cryptoTop = document.getElementById("crypto-top");
const cryptoBottom = document.getElementById("crypto-bottom");
const weather = document.getElementById("weather");

async function fetchBackground() {
  const response = await fetch(`${endpoints.unsplash}${query.unsplash}`);
  try {
    const data = await response.json();
    console.log(data.urls.raw);
    // document.body.style.backgroundImage = `url(${data.urls.full})`;
    // document.body.style.backgroundImage = `url(${data.urls.raw})`;
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
    author.textContent = data.user.name;
  } catch (err) {
    console.log(err);
    document.body.style.background = "crimson";
    time.textContent = "Something is wrong! 😥";
  }
}
fetchBackground();

async function fetchMarket() {
  const response = await fetch(`${endpoints.coingecko}${query.coingecko}`);
  try {
    if (!response.ok) throw new Error("Something went wrong!");
    const data = await response.json();
    cryptoTop.innerHTML = `
      <img src="${data.image.large}" alt="${data.name}">
      <span>${data.name}</span>
    `;

    cryptoBottom.innerHTML += `
    <p>24h → $${data.market_data.low_24h.usd}</p>
    <p>24h ⤴ $${data.market_data.current_price.usd}</p>
    <p>24h ⤵ $${data.market_data.high_24h.usd}</p>
    <p>ATH $${data.market_data.ath.usd} USD</p>
    <p>Down ${data.market_data.ath_change_percentage.usd.toFixed(0)}%</p>
    `;
  } catch (err) {
    console.log(err);
    document.body.style.background = "crimson";
    time.textContent = "Oops, something is wrong! 😥";
  }
}
fetchMarket();

/**

 * Queries to include: 
 *     - lat (latitude)
 *     - lon (longitude)
 *     - units (imperial or metric)
 */

async function fetchWeather() {
  // const response = await fetch(
  //   "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=7a6e0c6b7d0b1a8e1c1b1a0a0c0d0e0f"
  // );
  // try {
  //   const data = await response.json();
  //   console.log(data);
  //   weather.innerHTML = `
  //   <p>${data.name}</p>
  //   <p>${data.weather[0].description}</p>
  //   <p>${data.main.temp}</p>
  //   `;
  // } catch (err) {
  //   console.log(err);
  //   document.body.style.background = "crimson";
  //   time.textContent = "Oops, something is wrong! 😥";
  // }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    fetch(`${endpoints.weather}?lat=${latitude}&lon=${longitude}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        weather.innerHTML += `
          <img src='http://openweathermap.org/img/wn/${
            data.weather[0].icon
          }@2x.png' />
          <div class='weather-info'>
            <p>${data.name}, ${data.sys.country}</p>
            <p>${data.weather[0].main} ${data.main.temp.toFixed(0)}°C</p>
          </div>
        `;
      });
  });
}
fetchWeather();

async function updateTime() {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  time.innerHTML = `
    <h1>${date.toLocaleTimeString("en-US", { timeStyle: "short" })}</h1>
    <h3>${date.toLocaleDateString("en-US", options)}</h3>
  `;
  setTimeout(updateTime, 60000);
}
updateTime();
