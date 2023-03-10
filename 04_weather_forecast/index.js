const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6190544305:AAHRogJdUACF-l7Cum_VjacaSj7f5Gz63mg'
const bot = new TelegramBot(token, { polling: true });
const openWeatherApiKey = '15126aefbcd21a9cf8de7333a700f264';

function formatWeatherData(data) {
  let message = '';
  let currentDate = null;
  data.list.forEach((weather, index) => {
    const date = new Date(weather.dt * 1000);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    const dayOfMonth = date.toLocaleString('en-US', { day: 'numeric' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    if (currentDate === null || currentDate !== date.toDateString()) {
      message += `\n\nš ${dayOfWeek}, ${dayOfMonth} ${month}\n`;
      currentDate = date.toDateString();
    }
    if (index % 2 === 0) {
      message += `š ${date.toLocaleString('en-US', { hour: 'numeric', hour12: true })}\n`;
      message += `š”ļø Temperature: ${weather.main.temp} Ā°C\n`;
      message += `āļø Weather: ${weather.weather[0].description}\n`;
      message += `š§ Humidity: ${weather.main.humidity}%\n\n`;
    }
  });
  return message;
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome to the Weather Forecast bot. Please choose a city:',
    {
      reply_markup: {
        keyboard: [['Forecast in Lviv']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

bot.onText(/Forecast in (.+)/, (msg, match) => {
  const city = match[1];
  bot.sendMessage(
    msg.chat.id,
    `Please choose the forecast interval for ${city}:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '3 hours',
              callback_data: `${city}-3`,
            },
            {
              text: '6 hours',
              callback_data: `${city}-6`,
            },
          ],
        ],
      },
    }
  );
});

bot.on('callback_query', (callbackQuery) => {
  const data = callbackQuery.data.split('-');
  const city = 'Lviv';
  const interval = data[1];
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherApiKey}&units=metric`;
  axios.get(url).then((response) => {
    const weatherData = response.data;
    let message = `š ${weatherData.city.name}\n\n`;
    if (interval === '3') {
      message += 'š Weather forecast for every 3 hours:\n\n';
      message += formatWeatherData(weatherData);
    } else if (interval === '6') {
      message += 'š Weather forecast for every 6 hours:\n\n';
      message += formatWeatherData(weatherData);
    }
    bot.sendMessage(callbackQuery.message.chat.id, message);
  });
});
