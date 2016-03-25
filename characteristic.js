var util = require('util');
var bleno = require('bleno');
var mraa = require('mraa');

var BlenoCharacteristic = bleno.Characteristic;

// Initialize BLE Characteristic
var FirstCharacteristic = function() {
  FirstCharacteristic.super_.call(this, {
    uuid: 'fc0f',
    properties: ['read', 'write', 'notify'],
    value: null
  });
  this._value = new Buffer("OFF", "utf-8");
  console.log("Characterisitic's value: "+this._value);
  this._light = new mraa.Gpio(3);
  this._light.dir(mraa.DIR_OUT);
  this._light.write(0);
  this._updateValueCallback = null;
};

// Inherit the BlenoCharacteristic
util.inherits(FirstCharacteristic, BlenoCharacteristic);

// BLE Read request
FirstCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('FirstCharacteristic - onReadRequest: value = ' + this._value.toString("utf-8"), offset);
  callback(this.RESULT_SUCCESS, this._value);
};

// BLE write request
FirstCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
  if (data == "ON") {
    this._light.write(1);
  }
  else {
    this._light.write(0);
  }
  console.log('FirstCharacteristic - onWriteRequest: value = ' + this._value.toString("utf-8"));

  if (this._updateValueCallback) {
    console.log('FirstCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

// BLE subscribe
FirstCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('FirstCharacteristic - onSubscribe');
  this._updateValueCallback = updateValueCallback;
};

// BLE unsubscribe
FirstCharacteristic.prototype.onUnsubscribe = function() {
  console.log('FirstCharacteristic - onUnsubscribe');
  this._updateValueCallback = null;
};

module.exports = FirstCharacteristic;
