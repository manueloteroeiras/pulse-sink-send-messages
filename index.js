var pulse = require('reef-pulse-emitter');
var reef = require('reef-client');

require('dotenv').load();


var brokerFacade = new reef.SqsBrokerFacade({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  clientDomain: 'cloudpier-pulse-emitter',
  clientLane: 'shared'
});

var reefClient = new reef.ReefClient(brokerFacade);


var pulseEmitter = pulse.setupEmitter({
    reefClient : reefClient,
    pulseLane : 'shared' ,
    emitterDomain : 'cloudpier-pulse-sink' ,
});


reefClient
  .setup()
  .then(function () {

    console.log('reef client setup complete');

    var flushInterval = pulse.startEmitter(pulseEmitter, 5*1000);

    console.log('emitter started');

    var emitInterval = setInterval(function () {

      console.log('emitting test event');

      pulseEmitter.emit("HEARTBEAT", "sending heartbeat from test");

    }, 1*1000);

  })
  .catch(function (err) {
    console.log(err);
  });
