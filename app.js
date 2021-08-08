const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const replyForm = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'EUR',
                    callback_data: 'EUR'
                },
                {
                    text: 'USD',
                    callback_data: 'USD'
                },
                {
                    text: 'RUR',
                    callback_data: 'RUR'
                },
                {
                    text: 'BTC',
                    callback_data: 'BTC'
                }
            ]
        ]
    }
}

// Matches "/echo [whatever]"
bot.onText(/\/currency/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'What currency you want to know?', replyForm)
});

bot.on('callback_query',(query) => {
    const chatId = query.message.chat.id;


     const getResponse = async (queryString) => {
        const res = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        const filteredData = res.data.filter(obj => obj.ccy === queryString)[0];

        const message = `
        *${filteredData.ccy} TO ${filteredData.base_ccy}*
Buy: ${filteredData.buy}
Sale: ${filteredData.sale}
        `
         bot.sendMessage(chatId,message,{parse_mode: 'Markdown'})
    }

    getResponse(query.data)

})
