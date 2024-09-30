import amqp from "amqplib";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NotificationPayload } from "./models/notification.payload";
import moment from "moment";
import { AppDataSource } from "./db/data-source";
import { FCMJob } from "./entities/fcm_job.entity";
import { GoogleAuth } from "google-auth-library";
import axios from "axios";
import { BaseConsumer } from "./services/base.consumer";
import { SendNotificationConsumer } from "./services/notification.consumer";
import { FCMService } from "./services/fcm.service";

export async function runConsumer() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URI || "amqp://:@localhost:5672"
    );
    const channel = await connection.createChannel();
    const sendNotificationConsumer = new SendNotificationConsumer(
      channel,
      AppDataSource.getRepository(FCMJob),
      new FCMService(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || "",
        process.env.FCM_URL || "",
        axios.create()
      )
    );

    const queues: { [name: string]: BaseConsumer } = {
      "notification.fcm": sendNotificationConsumer,
    };

    const queue = "notification.fcm";
    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`[Consumer] Waiting for messages in ${queue}...`);

    Object.entries(queues).forEach(([queue, consumer]) => {
      channel.consume(queue, (msg) => consumer.consume(msg));
    });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}
