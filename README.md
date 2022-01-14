# azure-cosmos-console

## How to Install

This application was developed in Node.JS, then you need use a node js version `10.16.x` or higher.

After close or download, you need install the packages:

```
npm install
```

Now, you are ready to code!

## How to code

In your project, in the root directory, you have two files, `config.js` and `index.js`.

The `config.js`, you are going to configurate you azure access. Put your azure cosmos credentials.

In `index.js` you will write your code, or you queries. Below, we show a index start body.

```js
require('./lib')(async (db) => {
    // ... write your code
})
```

## How to Run

Just execute
```
node .
```

## Documentation

### db(databaseName)

- databaseName: string => optional, default = `"default"` - Configurations name in `config.js`, inside of `clients`.

The `db` is a database factory to access your containers. You can have a lot of database connections.

### db().Container(containerName)
- containerName: string : Container name that you want to access

The container just is a access to your functions about a container context.


### db().Container(containerName).query(query)
- query: string

Do a query in this container.

### db().Container(containerName).query(query)
- query: string

Do a query in this container.

### db().Container(containerName).getById(id, partitionKey)
*TODO*

### db().Container(containerName).create(id, partitionKey)
*TODO*

### db().Container(containerName).getBydeleteId(id, partitionKey)
*TODO*

### db().Container(containerName).deleteByQuery(id, partitionKey)
*TODO*

### db().Container(containerName).deleteByListId(id, partitionKey)
*TODO*

### db().Container(containerName).updateFields(id, partitionKey)
*TODO*

### db().Container(containerName).updateByQuery(id, partitionKey)
*TODO*

### db().Container(containerName).updateByList(id, partitionKey)
*TODO*
