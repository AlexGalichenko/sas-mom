import { consumeInterval } from './interval_consumer.js';

consumeInterval().catch(err => console.log(err));
