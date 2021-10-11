import { expect } from 'chai';
import { produceInterval } from '../src/interval_producer.js';
import amqplib from 'amqplib';
import sinon from 'sinon';

describe('interval producer', () => {

    it('should send message', async () => {
        const assertExchange = sinon.stub();
        const message = Buffer.from('hello world 0');
        const publish = sinon.stub();
        const createChannel = sinon.stub().returns({
            assertExchange,
            publish
        });
        sinon.stub(amqplib, 'connect').returns({
            createChannel,
        });
        sinon.stub(global, 'setInterval').callsFake((callback) => callback());
        await produceInterval();

        expect(assertExchange.calledWith('interval')).to.be.true;
        expect(publish.calledWith('interval', 'interval-message', message)).to.be.true;
    });

    after(() => {
        sinon.restore()
    })

});
