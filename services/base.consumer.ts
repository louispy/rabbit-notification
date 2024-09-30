import amqp from "amqplib";

export interface BaseConsumer {
  consume(message: amqp.ConsumeMessage | null): Promise<void>;
}
