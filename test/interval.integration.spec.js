import amqplib from "amqplib";
import { expect } from 'chai';
import dotenv from 'dotenv';
dotenv.config();

describe('interval producer', () => {

    let connection;

    before(async () => {
        connection = await amqplib.connect(process.env.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'interval consumer test'
            }
        });
    });

    it('should route message to right queue', async () => {
        const EX = 'interval';
        const ROUTING_KEY = 'interval-message';
        const channel = await connection.createChannel();
        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, EX, ROUTING_KEY);
        const message = await new Promise(resolve => {
            channel.consume(q.queue, (message) => {
                channel.ack(message);
                resolve(message.content.toString())
            });
        });
        expect(message).to.match(/hello world \d+/);
    });

    after(async () => {
        await connection.close();
    })
});
