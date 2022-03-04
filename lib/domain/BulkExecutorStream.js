const { Writable, Transform } = require("stream");
const { sendBulk, toUpsertBulk } = require("./bulk");
const { GetPartitionKeyDefault } = require("./registers");
const config = require("./Config");

class BulkExecutorStream extends Writable {
  constructor(container, streamOpt = {}) {
    super({ objectMode: true, decodeStrings: false, ...streamOpt });
    this.container = container;
  }

  _doBulk(registers) {
    return sendBulk(this.container._container, registers);
  }

  _write(registers, _, callback) {
    this._doBulk(registers).then(
      () => callback(),
      (e) => callback(e)
    );
  }
}

class BulkrizeStream extends Transform {
  constructor(
    mapBulkRegisterFn,
    windowSize = Number(config.getValue(["azure", "bulkSize"], 100)),
    streamOpt = {}
  ) {
    super({ objectMode: true, decodeStrings: false, ...streamOpt });
    this._listRegisters = [];
    this._windowSize = windowSize;
    this._mapBulkRegisterFn = mapBulkRegisterFn;
  }

  _append(register) {
    this._listRegisters.push(this._mapBulkRegisterFn(register));
  }

  _checkSize(callback) {
    if (this._listRegisters.length >= this._windowSize) {
      this._pushing();
    }
    callback();
  }

  _flush(callback) {
    if(this._listRegisters.length > 0) {
      this._pushing();
    }
    callback();
  }

  _pushing() {
    this.push(this._listRegisters);
    this._listRegisters = [];
  }

  _transform(register, _, callback) {
    this._append(register);
    this._checkSize(callback);
  }
}

function createUpsertStream(getPartitionKeyFn = GetPartitionKeyDefault) {
  return  new BulkrizeStream(toUpsertBulk(getPartitionKeyFn));
}

module.exports = {
  BulkExecutorStream,
  BulkrizeStream,
  createUpsertStream
};
