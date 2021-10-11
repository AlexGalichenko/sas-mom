import { expect } from 'chai';
import { upperCaseServer } from '../src/upper_case_server.js';
import amqplib from 'amqplib';
import sinon from 'sinon';

describe('upper case server', () => {

    it('should handle message', async () => {
        const assertQueue = sinon.stub().returns({ queue: 'stub-queue' });
        const sendToQueue = sinon.stub();
        const ack = sinon.stub();
        const messageContent = 'test message';
        const upperCaseMessageContent = 'TEST MESSAGE';
        const message = Buffer.from(messageContent);
        const response = {
            content: message,
            properties: {
                replyTo: 'test-queue'
            }
        }
        const consume = sinon.stub().callsFake((q, callback) => callback(response));
        const createChannel = sinon.stub().returns({
            assertQueue,
            sendToQueue,
            consume,
            ack
        });
        sinon.stub(amqplib, 'connect').returns({
            createChannel
        });
        await upperCaseServer();

        expect(assertQueue.calledWith('source-queue')).to.be.true;
        expect(consume.calledWith('source-queue')).to.be.true;
        expect(sendToQueue.calledWith('test-queue', Buffer.from(upperCaseMessageContent))).to.be.true;
        expect(ack.calledWith(response)).to.be.true;

    });

    after(() => {
        sinon.restore()
    })

});
