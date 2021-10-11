import amqplib from 'amqplib';
import { message } from './utils.js';

export async function produceInterval() {
    try {
        const EX = 'interval';
        const ROUTING_KEY = 'interval-message'
        const connection = await amqplib.connect(process.env.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'interval producer'
            }
        });
        const channel = await connection.createChannel();
        await channel.assertExchange(EX);

        let i = 0;
        setInterval(async () => {
            await channel.publish(EX, ROUTING_KEY, message('hello world ' + i++));
        }, 2000)
    } catch (err) {
        console.log(err);
    }
}
