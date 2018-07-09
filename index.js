const SlackBot = require("slackbots");
const axios = require("axios");

const bot = new SlackBot({
  token: "<insert your slack bot token here>",
  name: "xkcdbot"
});

// start handler
bot.on("start", () => {
  const params = {
    icon_emoji: ":robot_face:"
  };

  bot.postMessageToChannel("general", "Get your XKCD on with @xkcdbot!", params);
});

// error handler
bot.on("error", err => console.log(err));

// message handler
bot.on("message", data => {
  if (data.type !== "message" && data === undefined) {
    return;
  }

  handleIncomingMessage(data.text);
});

function handleIncomingMessage(message) {
  console.log('message is: ', message);
  if (message.includes(" random") && message !== 'undefined') {
    randomXKCD();
  }
}

function randomXKCD() {
  let randomNum = Math.floor(Math.random() * 2000) + 1;

  axios
    .get(`http://xkcd.com/${randomNum}/info.0.json`)
    .then(res => {
      const img = res.data.img;
      const title = res.data.title;

      const params = {
        icon_emoji: ":joy:"
      };

      bot.postMessageToChannel("general", `${title}: ${img}`, params);
    })
    .catch(err => console.log(err));
}
