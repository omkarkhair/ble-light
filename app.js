var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

var FirstCharacteristic = require('./characteristic');

bleno.on('stateChange', function(state) {
  console.log('BLE State: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising('BLE Light', ['fc00']);
  }
  else {
    if(state === 'unsupported'){
      error.log("BLE error. Check board configuration.");
    }
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('Advertising:' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'fc00',
        characteristics: [
          new FirstCharacteristic()
        ]
      })
    ]);
  }
});

bleno.on('accept', function(clientAddress) {
    console.log("Accepted Connection with Client Address: " +
clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected Connection with Client Address: " +
clientAddress);
});

console.log("BLE Lights initiated...");
