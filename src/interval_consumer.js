import amqplib from 'amqplib';

export async function consumeInterval() {
    try {
        const EX = 'interval';
        const Q = 'interval';
        const ROUTING_KEY = 'interval-message';
        const connection = await amqplib.connect(process.env.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'interval consumer'
            }
        });
        const channel = await connection.createChannel();
        await channel.assertQueue(Q);
        await channel.bindQueue(Q, EX, ROUTING_KEY);
        await channel.consume(Q, message => {
            console.log(message.content.toString());
            channel.ack(message)
        });
    } catch (err) {
        console.log(err);
    }
}
