# 3. Telegram Console Sender

## To test this app use build-in commands

```
npm run message
```
And

```
npm run photo
```

'npm run message' will send to sofia_telegram_console_sender_bot message: I am your message

'npm run photo' will send photo of cat to this bot

## To send your own message:

```
node index.js send-message 'MESSAGE'
```
## To send other photo:
```
node index.js send-photo  '/path/to/the/photo.jpeg'
```