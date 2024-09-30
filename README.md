# Rabbit Notification
FCM Notification consumer


# Requirements/ Dependencies
Node 20+, RabbitMQ, MySQL

# Setup

1. Copy .env.example into .env and edit
2. Copy firebase service account json file into root folder (important)

## Without Docker

Install dependencies
```
npm i
```

Migrate db (using typeorm)
```
npm run migration:up
```

Start the app
```
npm start
```

## With Docker (compose)
```
docker-compose up
```

## Notes
Service will run on port 5000

Sample message in notification.fcm queue
```
{"identifier": "testid-abc", "type": "message", "deviceId": "device id", "text": "this is my message"}
```

For testing purposes sending deviceId with "topic" as value will send fcm message to "incoming-message" topic
```
{"identifier": "testid-abc", "type": "message", "deviceId": "topic", "text": "this is my message"}
```
