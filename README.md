# azure-cosmos-console

## How to Install

This application was developed in Node.JS, so you need to use a node js version `10.16.x` or higher.

After closing or downloading, you need to install the packages:

```
npm install
```

Now, you are ready to code!

## How to code

In your project, in the root directory, you have two files: `config.js` and `index.js`.

In the `config.js`, you are going to configure your azure access. Put your azure cosmos credentials.

In `index.js` you will write your code, or your queries. Below, we show an index start body.

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

The container just is access to your functions about a container context.


### db().Container(containerName).query(query)
- query: string

Do a query in this container.

### db().Container(containerName).query(query)
- query: string

Do a query in this container.

### db().Container(containerName).getById(id, partitionKey)
*TODO*

### db().Container(containerName).create
*TODO*

### db().Container(containerName).getBydeleteId
*TODO*

### db().Container(containerName).deleteByQuery
*TODO*

### db().Container(containerName).deleteByListId
*TODO*

### db().Container(containerName).updateFields
*TODO*

### db().Container(containerName).updateByQuery
*TODO*

### db().Container(containerName).upsertList
*TODO*
