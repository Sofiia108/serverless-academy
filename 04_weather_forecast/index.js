const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6190544305:AAHRogJdUACF-l7Cum_VjacaSj7f5Gz63mg'
const bot = new TelegramBot(token, { polling: true });
const openWeatherApiKey = '15126aefbcd21a9cf8de7333a700f264';

function formatWeatherData(data) {
  let message = '';
  data.list.forEach((weather, index) => {
    if (index % 2 === 0) {
      message += `🕒 ${new Date(weather.dt * 1000).toLocaleString('en-US', { hour: 'numeric', hour12: true })}\n`;
      message += `🌡️ Temperature: ${weather.main.temp} °C\n`;
      message += `☁️ Weather: ${weather.weather[0].description}\n`;
      message += `💧 Humidity: ${weather.main.humidity}%\n\n`;
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
    let message = `🌍 ${weatherData.city.name}\n\n`;
    if (interval === '3') {
      message += '🕒 Weather forecast for every 3 hours:\n\n';
      message += formatWeatherData(weatherData);
    } else if (interval === '6') {
      message += '🕒 Weather forecast for every 6 hours:\n\n';
      message += formatWeatherData(weatherData);
    }
    bot.sendMessage(callbackQuery.message.chat.id, message);
  });
});
