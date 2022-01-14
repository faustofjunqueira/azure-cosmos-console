async function timeProcessor(promiseFn, onSuccess, onError) {
    let ticks = process.hrtime();
    let error = null;
    let result = null;
    try {
        result = await promiseFn();
    }catch(e) {
        error = e;
    }
    ticks = process.hrtime(ticks)
    const ticksStr = `Processed in ${Math.floor(ticks[0]/60)}:${ticks[0] % 60}.${(ticks[1] / 1000000).toFixed(3)}`;
    if(error) {
        throw await onError(error, ticksStr, ticks);
    }
    return await onSuccess(result, ticksStr, ticks);
}

function printProcessor(promiseFn, {loading, noPrintResult}) {
    
    console.log('\n' + loading);

    const handlerError = (error, ticksStr) => {
        console.error(ticksStr);
        return error;
    }

    const handlerSuccess = (result, ticksStr) => {
        if(!noPrintResult) {
            console.log(JSON.stringify(result, null, 4));
        }
        console.log(ticksStr);
        return result;
    }

    return timeProcessor(promiseFn, handlerSuccess, handlerError)
}

module.exports = {
    timeProcessor,
    printProcessor
}