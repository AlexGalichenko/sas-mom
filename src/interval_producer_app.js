import { produceInterval } from './interval_producer.js';

produceInterval().catch(err => console.log(err));
