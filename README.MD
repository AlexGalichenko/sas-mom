### install modules
npm install
### interval producer - send message to exchange every 2 seconds
npm run interval-producer

### interval consumer - read from queue bound to interval exchange
npm run interval-consumer

### upper case server - server answer with upper case text to requestor queue
npm run upper-case-server

### upper case client - request upper cased text from server
npm run upper-case-client -- "some text"

RABBITMQ_URL env var need to be set up

### tests
npm run test-integration

npm run est-unit
