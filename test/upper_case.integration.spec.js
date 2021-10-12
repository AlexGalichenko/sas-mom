import amqplib from "amqplib";
import { expect } from 'chai';
import dotenv from 'dotenv';
dotenv.config();

describe('upper case server', () => {

    let connection;

    before(async () => {
        connection = await amqplib.connect(process.env.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'upper case client test'
            }
        });
    });

    it('should return upper cased string', async () => {
        const SQ = 'source-queue';
        const channel = await connection.createChannel();
        const q = await channel.assertQueue('', { exclusive: true });
        const messageContent = 'test message';
        channel.sendToQueue(
            SQ,
            Buffer.from(messageContent),
            {
                replyTo: q.queue
            }
        );
        const message = await new Promise(resolve => {
            channel.consume(q.queue, (message) => {
                resolve(message.content.toString())
            });
        });
        expect(message).to.equal('TEST MESSAGE');
    });

    after(async () => {
        await connection.close();
    })
});
