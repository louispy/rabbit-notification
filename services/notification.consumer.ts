import { Repository } from "typeorm";
import { FCMJob } from "../entities/fcm_job.entity";
import { BaseConsumer } from "./base.consumer";
import amqp from "amqplib";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NotificationPayload } from "../models/notification.payload";
import moment from "moment";
import { FCMService } from "./fcm.service";

export class SendNotificationConsumer implements BaseConsumer {
  constructor(
    private readonly channel: amqp.Channel,
    private readonly fcmJobRepo: Repository<FCMJob>,
    private readonly fcmService: FCMService
  ) {}

  async consume(message: amqp.ConsumeMessage): Promise<void> {
    try {
      if (message === null) {
        return;
      }
      const s = message.content.toString();
      const obj = JSON.parse(s);
      const payload = plainToClass(NotificationPayload, obj);
      await validateOrReject(message);
      console.log("received:", s);
      this.channel.ack(message);

      await this.fcmService.sendFCMMessage("Incoming message", payload.text, payload.deviceId);
      const now = moment();
      await this.fcmJobRepo.insert({
        identifier: payload.identifier,
        deliverAt: now.toDate(),
      } as FCMJob);
      const doneQueue = "notification.done";
      const doneMessage = {
        identifier: payload.identifier,
        deliverAt: now.toISOString(),
      };
      this.channel.sendToQueue(
        doneQueue,
        Buffer.from(JSON.stringify(doneMessage)),
        {
          persistent: true,
        }
      );
      console.log("send to channel");
    } catch (error) {
      console.error("Error", error);
    }
  }
}
