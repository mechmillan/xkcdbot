const SlackBot = require("slackbots");
const axios = require("axios");

const bot = new SlackBot({
  token: "<insert slack token here>",
  name: "xkcdbot"
});

// start handler
bot.on("start", () => {
  const params = {
    icon_emoji: ":robot_face:"
  };

  const helpMessage = `This bot accepts the following commands:\
  '@xkcdbot random', '@xkcdbot get <integer value>', \
  '@xkcdbot help'`;

  bot.postMessageToChannel(
    "general",
    `I serve up XKCD comics! ${helpMessage}`,
    params
  );
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
  let arrMessageText = message && message.split(" ");

  if (arrMessageText && arrMessageText.includes("random")) {
    randomXKCD();
  } else if (arrMessageText && arrMessageText.includes("get")) {
    let number = arrMessageText[2];
    getXKCD(+number);
  } else if (arrMessageText && arrMessageText.includes("help")) {
    const helpMesssage = `This bot accepts the following commands
      '@xkcdbot random' '@xkcdbot get <integer value>'
      '@xkcdbot help'`;

    const params = {
      icon_emoji: ":confused:"
    };

    bot.postMessageToChannel("general", helpMesssage, params);
  }
}

function randomXKCD() {
  let upperLimit = 2018;
  let randomNum = Math.floor(Math.random() * upperLimit) + 1;

  fetchComic(randomNum);
}

function getXKCD(number) {
  if (typeof number !== "number") return;
  let lowerLimit = 1;
  let upperLimit = 2018;
  let outOfRangeMessage = `Comic number out of range!\
  Passed in integer must be greater-than ${lowerLimit} and less-than ${upperLimit}.`;

  const params = {
    icon_emoji: ":bangbang:"
  };

  if (number < lowerLimit) {
    bot.postMessageToChannel("general", outOfRangeMessage, params);
  } else if (number > upperLimit) {
    bot.postMessageToChannel("general", outOfRangeMessage, params);
  } else {
    fetchComic(number);
  }
}

function fetchComic(comicNumber) {
  axios
    .get(`http://xkcd.com/${comicNumber}/info.0.json`)
    .then(res => {
      const img = res.data.img;
      const title = res.data.title;

      const params = {
        icon_emoji: ":thinking_face:"
      };

      bot.postMessageToChannel("general", `${title}: ${img}`, params);
    })
    .catch(err => console.log(err));
}
