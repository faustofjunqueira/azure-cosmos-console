const assert = require('assert');
const { QueryExecutorStream, BackupContainerStream } = require("./domain/QueryExecutorStream");
const { createUpsertStream, BulkExecutorStream } = require('./domain/BulkExecutorStream');


function migrate(containerFrom, containerTo, query = "select * from c") {
  assert.ok(containerFrom, "containerFrom is not defined");
  assert.ok(containerTo, "containerTo is not defined");

  return new Promise((resolve) => {
    new QueryExecutorStream(containerTo, query)
      .pipe(new BackupContainerStream(containerTo._container.id))
      .on('finish', async () => {
        await containerTo.deleteByQuery(query);
        new QueryExecutorStream(containerFrom, query)
          .pipe(createUpsertStream())
          .pipe(new BulkExecutorStream(containerTo));
      })
      .on('finish', resolve);
  })

}

module.exports = migrate;