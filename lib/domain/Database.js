const assert = require('assert');
const { CosmosClient } = require("@azure/cosmos");
const R = require('ramda');
const Container = require("./Container");
const { getClientConfig } = require('./Config');

class Database {

    constructor(dbName) {
        assert.ok(dbName, `${dbName} not defined`);
        this._databaseConfig = getClientConfig(dbName);
        assert.ok(this._databaseConfig, `Config ${dbName} not found`);
        
        this._cosmosClient = new CosmosClient({
            endpoint: this._databaseConfig.endpoint,
            key: this._databaseConfig.key
        });
        this._database = this._cosmosClient.database(this._databaseConfig.database);
        
        this._containers = {};
    }

    container(containerName) {
        assert.ok(containerName, "Container name is not defined");
        if(!this._containers[containerName]) {
            this._containers[containerName] = new Container(this._database, containerName);
        }
        return this._containers[containerName];
    }

    dispose() {
       this._cosmosClient.dispose(); 
    }
}

const db = {};
const DatabaseFactory = (databaseName = "default") => {
    if (!db[databaseName]) {
        db[databaseName] = new Database(databaseName);
    }
    return db[databaseName];
};

const DatabaseDispose = () => {
    R.forEachObjIndexed(db, d => d.dispose());
}
module.exports = {
    DatabaseFactory,
    DatabaseDispose
}