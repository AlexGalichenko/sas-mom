import { expect } from 'chai';
import { consumeInterval } from '../src/interval_consumer.js';
import amqplib from 'amqplib';
import sinon from 'sinon';

describe('interval consumer', () => {


    it('should receive message', async () => {
        const assertQueue = sinon.stub();
        const bindQueue = sinon.stub();
        const message = { content: Buffer.from('buffer content') };
        const consume = sinon.stub().callsFake((q, callback) => callback(message));
        const ack = sinon.stub();
        const createChannel = sinon.stub().returns({
            assertQueue,
            bindQueue,
            consume,
            ack
        });
        sinon.stub(amqplib, 'connect').returns({
            createChannel,
        });
        const consoleLog = sinon.stub(console, 'log')
        await consumeInterval();

        expect(assertQueue.calledWith('interval')).to.be.true;
        expect(bindQueue.calledWith('interval', 'interval', 'interval-message')).to.be.true;
        expect(consume.calledWith('interval')).to.be.true;
        expect(ack.calledWith(message)).to.be.true;
        expect(consoleLog.calledWith('buffer content')).to.be.true;
    });

    after(() => {
        sinon.restore()
    })

});
