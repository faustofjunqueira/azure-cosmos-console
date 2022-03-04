const { Readable, Writable } = require('stream');
const path = require('path');
const fs = require("fs");

class QueryExecutorStream extends Readable {

  constructor(container, query, streamOpts = {}) {
    super({objectMode: true, ...streamOpts});
    this.query = query;
    this.result = [];
    this.queryIterator = container._container.items.query(query);
    this.mapFn = (x) => x;
  }

  async loadMoreResult() {
    const { hasMoreResults, resources } = await this.queryIterator.fetchNext();
    this.hasMore = hasMoreResults;
    if (resources && resources.length) {
      resources.forEach((r) => this.appendResult(r));
    }
  }

  appendResult(r) {
    const mappedValue = this.mapFn(r);
    this.result.push(mappedValue);
    if(!this.push(mappedValue)) {
      this.hasMore = false;
      return;
    }
  }

  async exec() {
    do {
      this.hasMore = true;
      await this.loadMoreResult();
    } while (this.hasMore);
    return this.result;
  }

  _read() {
    this.exec().then(() => this.push(null));
  }

}

class BackupContainerStream extends Writable {

  constructor(backupId, streamOpts = {}) {
    super({objectMode: true, ...streamOpts});
    this.filename = path.resolve(`${backupId}-${new Date().getTime()}.json`);
    this.registers = [];
    this.file = fs.createWriteStream(this.filename);
  }

  _write(register, _, callback) {
    this.file.write(JSON.stringify(register)+",");
    callback();
  }

} 

module.exports = {
  QueryExecutorStream,
  BackupContainerStream
};