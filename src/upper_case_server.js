import amqplib from 'amqplib';
import { message } from './utils.js';

export async function upperCaseServer() {
    try {
        const SQ = 'source-queue';
        const connection = await amqplib.connect(process.env.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'upper case server'
            }
        });
        const channel = await connection.createChannel();
        await channel.assertQueue(SQ);
        channel.consume(SQ, function(msg) {
            channel.sendToQueue(
                msg.properties.replyTo,
                message(msg.content.toString().toUpperCase())
            );
            channel.ack(msg);
        });
    } catch (err) {
        console.log(err);
    }
}
