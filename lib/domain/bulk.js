const R = require('ramda');
const config = require('./Config');

function toUpsertBulk(getPartitionKeyFn) {
    return (resourceBody) => ({ operationType: "Upsert", resourceBody, partitionKey: getPartitionKeyFn ?  getPartitionKeyFn(resourceBody) : undefined });
}

function toCreateBulk(getPartitionKeyFn) {
    return (resourceBody) => ({ operationType: "Create", resourceBody, partitionKey: getPartitionKeyFn ?  getPartitionKeyFn(resourceBody) : undefined });
}

function toDeleteBulk(getIdFn, getPartitionKeyFn) {
    return (resourceBody) => ({ operationType: 'Delete', id: getIdFn(resourceBody), partitionKey: getPartitionKeyFn ?  getPartitionKeyFn(resourceBody) : undefined });
}

function hasStatusCode(response, statusCode) {
    return response.filter((x) => x.statusCode == statusCode).length > 0;
}

function totalSuccessResponse(response) {
    return response.filter(x => x.statusCode == 200 || x.statusCode == 201).length;
}

function prepareRetry(registers, response, getIdFn) {
    const registersIdSuccess = response.filter((x) => x.statusCode == 201 || x.statusCode == 200).map(x => getIdFn(x.resourceBody));
    const registerToRetry = registers.filter(x => !registersIdSuccess.includes(getIdFn((x)["resourceBody"])));
    const responseWithNeedRetry = response.find(x => x.statusCode == 429) || {};
    const timeMS = responseWithNeedRetry["retryAfterMilliseconds"] || 0;
    return {registerToRetry, timeMS};
}

async function sendBulk(
    container, 
    registers, 
    getId = (register) => register.id
) {
    const response = await container.items.bulk(registers);
    let totalSaveRegister = totalSuccessResponse(response);
    if(hasStatusCode(response, 429)) {
        const {registerToRetry, timeMS} = prepareRetry(registers, response, getId);
        await Utils.Wait(timeMS);
        totalSaveRegister += await sendBulk(container, registerToRetry, getId);
    }
    return totalSaveRegister; 
}

async function doBulk(container, registers, toBulkFn) {
    // bulkqueriza
    const bulkerized = registers.map(toBulkFn);
    // quebra em pequenos chunks
    const chunks = R.splitEvery(Number(config.getValue(['azure', 'bulkSize'], 100)), bulkerized);
    for (let c of chunks) {
        await sendBulk(container, c);
    }
}

function bulkUpsert(container, registers, getPartitionKeyFn) {
    return doBulk(container, registers, toUpsertBulk(getPartitionKeyFn));
}

async function bulkCreate(container, registers, getPartitionKeyFn) {
    return doBulk(container, registers, toCreateBulk(getPartitionKeyFn));
}

async function bulkDelete(container, registers, getIdFn, getPartitionKeyFn) {
    return doBulk(container, registers, toDeleteBulk(getIdFn, getPartitionKeyFn), getPartitionKeyFn);
}

module.exports = {
    bulkUpsert,
    bulkCreate,
    bulkDelete,
}