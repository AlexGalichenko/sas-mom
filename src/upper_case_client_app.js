import { toMOMUpperCase } from './upper_case_client.js';

const message = process.argv.pop();
toMOMUpperCase(message).catch(err => console.log(err))
