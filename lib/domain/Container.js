const { GetIdDefault, GetPartitionKeyDefault } = require('./registers');
const assert = require('assert');
const { printProcessor } = require('./view');
const { bulkDelete, bulkUpsert } = require('./bulk');
class Container {

    // TODO: tratar erro 404 para não encontrada
    // TODO: tratar erro 409 para registro já existe
    // TODO: nos deletes, update e insert e nos bulks colocar o total de items afetados

    constructor(database, collectionName) {
        assert.ok(database, 'Database client is not defined');
        assert.ok(collectionName, 'Container name is not defined');
        this._collectionName = collectionName;
        this._database = database;
        this._container = database.container(collectionName);
    }

    async loadByQuery(query) {
        assert.ok(query, "query is not defined");
        const queryIterator = this._container.items.query(query);
        const result = [];
        let hasMore = true;
        do {
            const { hasMoreResults, resources } = await queryIterator.fetchNext();
            hasMore = hasMoreResults;
            if (resources && resources.length) {
                resources.forEach(r => result.push(r));
            }
        } while (hasMore);
        return result;
    }

    query(query) {
        return printProcessor(() => this.loadByQuery(query), {
            loading: `=>[${this._collectionName}] Executing query: ${query}`
        });
    }

    getById(id, partitionKey) {
        assert.ok(id, "id is not defined");
        return printProcessor(async () => {
            const item = this._container.items.container.item(id, partitionKey);
            const { resource, statusCode } = await item.read()
            return resource;
        },
            {
                loading: `=>[${this._collectionName}] Executing GetById(${id}${partitionKey ? ', ' + partitionKey : ""})`
            });
    }

    create(body) {
        assert.ok(body, "body is not defined");
        return printProcessor(async () => {
            const { resource, statusCode } = await this._container.items.create(body)
            return resource;
        },
            {
                noPrintResult: true,
                loading: `=>[${this._collectionName}] Executing Creating(${JSON.stringify(body, null, 4)})`
            });
    }

    delete(id, partitionKey) {
        assert.ok(id, "id is not defined");
        return printProcessor(async () => {
            const item = this._container.items.container.item(id, partitionKey);
            const { resource, statusCode } = await item.delete();
            return resource;
        },
            {
                noPrintResult: true,
                loading: `=>[${this._collectionName}] Executing GetById(${id}${partitionKey ? ', ' + partitionKey : ""})`
            });
    }

    deleteByWhere(conditionQuery, getIdFn = GetIdDefault, getPartitionKeyFn = GetPartitionKeyDefault) {
        assert.ok(conditionQuery, "Query is not defined");
        return this.deleteByQuery(`select * from c where ` + conditionQuery, getIdFn, getPartitionKeyFn)
    }

    deleteByQuery(query, getIdFn = GetIdDefault, getPartitionKeyFn = GetPartitionKeyDefault) {
        assert.ok(query, "Query is not defined");
        assert.ok(getIdFn, "Get Id is not defined");

        return printProcessor(async () => {
            const loadedItems = await this.loadByQuery(query);
            if (loadedItems && loadedItems.length) {
                await bulkDelete(this._container, loadedItems, getIdFn, getPartitionKeyFn);
            }
        },
            {
                noPrintResult: true,
                loading: `=>[${this._collectionName}] Executing Delete By Query: ${conditionQuery}`
            });
    }

    // [{id: "", partitionKey: ""}]
    deleteByListId(listId) {
        return printProcessor(async () => {
            if (listId && listId.length) {
                await bulkDelete(this._container, listId, GetIdDefault, GetPartitionKeyDefault);
            }
        },
            {
                noPrintResult: true,
                loading: `=>[${this._collectionName}] Executing Delete By Ids: ${listId.map(GetIdDefault).join(', ')}`
            });
    }

    updateFields(fields, id, partitionKey) {
        assert.ok(id, 'id is not defined');
        assert.ok(fields, 'fields is not defined');
        return printProcessor(async () => {
            const item = this._container.items.container.item(id, partitionKey);
            const { resource, statusCode } = await item.read();
            const { resource: updatedResource, statusCode: updatedStatusCode } = await item.replace({ ...resource, ...fields });
            return updatedResource;
        },
            {
                loading: `=>[${this._collectionName}] Executing Update Register by Id: ${id} /${partitionKey} - ${JSON.stringify(fields, null, 4)}`
            });
    }

    updateByQuery(query, replaceObjOrFn, getPartitionKeyFn = GetPartitionKeyDefault) {
        assert.ok(query, "Query is not defined");
        assert.ok(replaceObjOrFn, "Replace object is not defined");

        return printProcessor(async () => {
            const loadedItems = await this.loadByQuery(query);
            if (loadedItems && loadedItems.length) {
                let updatedItens = [];
                if (typeof (replaceObjOrFn) === 'object') {
                    // O replaceObjOrFn pode ser um objeto que será alterado em todos os objetos
                    updatedItens = loadedItems.map(x => ({ ...x, ...replaceObjOrFn }));
                } else {
                    // o replaceObjOrFn pode ser uma função com essa assinatura: (register) => updatedRegister
                    updatedItens = loadedItems.map(replaceObjOrFn);
                }

                await bulkUpsert(this._container, updatedItens, getPartitionKeyFn);
            }
        },
            {
                noPrintResult: true,
                loading: `=>[${this._collectionName}] Executing Update By Query: ${query} - ${JSON.stringify(replaceObjOrFn, null, 4)}`
            });
    }

    updateByWhere(conditionQuery, replaceObjOrFn, getPartitionKeyFn = GetPartitionKeyDefault) {
        assert.ok(conditionQuery, "Query is not defined");
        return this.updateByQuery(`select * from c where ` + conditionQuery, replaceObjOrFn, getPartitionKeyFn);
    }

    upsertList(registers, getPartitionKeyFn = GetPartitionKeyDefault) {
        assert.ok(registers, "registers is not defined");
        return printProcessor(async () => {
            if (registers && registers.length) {
                await bulkUpsert(this._container, registers, getPartitionKeyFn);
            }
        },
            {
                noPrintResult: true,
                loading: `=>[${this._collectionName}] Executing Upsert By List[${registers.length}]`
            });
    }


}

module.exports = Container;