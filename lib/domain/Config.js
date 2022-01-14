const assert = require('assert');
const config = require('../../config');
const R = require('ramda');

const getValue = (pathValue, defaultValue = undefined) => {
    if(R.hasPath(pathValue, config)) {
        return R.path(pathValue, config);
    }
    return defaultValue;
}

const getClientConfig = (clientname) => {
    const path = ['client', clientname];
    const pathStr = path.join('.');
    const clientConfig = getValue(path);
    assert.ok(clientConfig, `Client: ${pathStr}: config not found`);
    return clientConfig;
}

module.exports = {
    getValue,
    getClientConfig
}