import amqplib from 'amqplib';
import { message } from './utils.js';

export async function toMOMUpperCase(messageContent) {
    try {
        const SQ = 'source-queue';
        const connection = await amqplib.connect(process.env.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'upper case client'
            }
        });
        const channel = await connection.createChannel();
        const ownQueue = await channel.assertQueue('', { exclusive: true });
        channel.sendToQueue(
            SQ,
            message(messageContent),
            {
                replyTo: ownQueue.queue
            }
        );

        channel.consume(ownQueue.queue, function(msg) {
            console.log(msg.content.toString());
            connection.close();
            process.exit(0)
        });

    } catch (err) {
        console.log(err);
    }
}
