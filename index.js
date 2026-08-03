const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/tring-bro-on-stardance-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/tring-bro-on-stardance-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`this bot was made by himanshu singh 
Available Commands:
/tring-bro-on-stardance-ping - Check bot latency
/tring-bro-on-stardance-catfact - Get a cat fact
/tring-bro-on-stardance-joke - Get a joke
/tring-bro-on-stardance-weather - Get current weather for a city`
  });
});

app.command("/tring-bro-on-stardance-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/tring-bro-on-stardance-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

//-------------------- WEATHER --------------------//

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: Moderate",
  55: "Drizzle: Dense intensity",
  56: "Freezing drizzle: Light",
  57: "Freezing drizzle: Dense intensity",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy intensity",
  66: "Freezing rain: Light",
  67: "Freezing rain: Heavy intensity",
  71: "Snow fall: Slight",
  73: "Snow fall: Moderate",
  75: "Snow fall: Heavy intensity",
  77: "Snow grains",
  80: "Rain showers: Slight",
  81: "Rain showers: Moderate",
  82: "Rain showers: Violent",
  85: "Snow showers: Slight",
  86: "Snow showers: Heavy",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

app.command("/tring-bro-on-stardance-weather", async ({ ack, respond, command }) => {
  await ack();

  const city = command.text.trim();

  if (!city) {
    return respond({
      text: "Please provide a city name.\nExample:\n/tring-bro-on-stardance-weather Mumbai"
    });
  }

  try {
    const geo = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1
        }
      }
    );

    if (!geo.data.results || geo.data.results.length === 0) {
      return respond({
        text: `Could not find "${city}".`
      });
    }

    const place = geo.data.results[0];

    const weather = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: place.latitude,
          longitude: place.longitude,
          current: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "wind_speed_10m",
            "weather_code"
          ].join(","),
          timezone: "auto"
        }
      }
    );

    const current = weather.data.current;

    const description =
      weatherCodes[current.weather_code] || "Unknown weather condition";

    await respond({
      text: `Weather in ${place.name}, ${place.country}

Condition: ${description}
Temperature: ${current.temperature_2m}°C
Feels Like: ${current.apparent_temperature}°C
Humidity: ${current.relative_humidity_2m}%
Wind Speed: ${current.wind_speed_10m} km/h`
    });
  } catch (err) {
    console.error("Weather Error:", err);

    await respond({
      text: "Failed to fetch weather."
    });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();