import { expect } from 'chai';
import { toMOMUpperCase } from '../src/upper_case_client.js';
import amqplib from 'amqplib';
import sinon from 'sinon';

describe('upper case client', () => {

    it('should receive message', async () => {
        const assertQueue = sinon.stub().returns({ queue: 'stub-queue' });
        const sendToQueue = sinon.stub();
        const messageContent = 'test message';
        const message = Buffer.from(messageContent);
        const response = { content: message }
        const consume = sinon.stub().callsFake((q, callback) => callback(response));
        const createChannel = sinon.stub().returns({
            assertQueue,
            sendToQueue,
            consume
        });
        const close = sinon.stub();
        sinon.stub(amqplib, 'connect').returns({
            createChannel,
            close
        });
        const exitStub = sinon.stub(process, 'exit');
        const consoleLog = sinon.stub(console, 'log');
        await toMOMUpperCase(messageContent);

        expect(assertQueue.calledWith('', { exclusive: true })).to.be.true;
        expect(sendToQueue.calledWith('source-queue', message, { replyTo: 'stub-queue' })).to.be.true;
        expect(consoleLog.calledWith(messageContent)).to.be.true;
        expect(close.calledWith()).to.be.true;
        expect(exitStub.calledWith(0)).to.be.true;
    });

    after(() => {
        sinon.restore()
    })

});
