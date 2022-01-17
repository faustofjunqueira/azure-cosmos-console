const {
    DatabaseFactory,
    DatabaseDispose
} = require('./domain/Database');


async function execution(fnExecution) {
    let withError = false;
    try {
        await fnExecution(DatabaseFactory);
    } catch (e) {
        console.error(e);
        withError = true;
    }
    DatabaseDispose();
    if (withError) {
        return process.exit(-1)
    }
}

module.exports = execution;