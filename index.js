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
/tring-bro-on-stardance-joke`
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



(async () => {
  await app.start();
  console.log("bot is running!");
})();