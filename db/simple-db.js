const initialData = require('./initial-data.json');

const indices = { };

const databases = { }

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 15;

const getDatabase = (dbName) => {
    if(!databases[dbName]) {
        databases[dbName] = {};
    }

    return databases[dbName];
}

const getIndexAndIncrease = (dbName) => {
    if(!indices[dbName]) {
        indices[dbName] = 1;
    }

    return indices[dbName]++;
}

const get = (dbName, id) => {
    console.dir('get', dbName, id);
    return getDatabase(dbName)[id];
}

const set = (dbName, id, item) => {
    console.dir('set', dbName, id, item);
    const foundItem = get(dbName, id)  || {};
    const updatedItem = { 
        ...foundItem,
        ...item,
        id,
        createdAt: foundItem.createdAt || Date.now(),
        updatedAt: Date.now()
    };
    getDatabase(dbName)[id] = updatedItem;

    console.dir(databases);

    return updatedItem;
}

const add = (dbName, item) => {
    return set(dbName, item.id || getIndexAndIncrease(dbName), { ...item, createdAt: Date.now() });
}

const del = (dbName, id) => {
    console.dir('delete', dbName, id);
    const deleted = get(dbName, id);
    delete getDatabase(dbName)[id];
    return deleted;
}

const getPage = (dbName, pageNumber, pageSize) => {
    pageNumber = parseInt(pageNumber) || DEFAULT_PAGE_NUMBER;
    pageSize = parseInt(pageSize) || DEFAULT_PAGE_SIZE;

    const db = getDatabase(dbName);
    const total = Object.keys(db).map(id => db[id]);
    const offset = (pageNumber - 1) * pageSize;
    const totalPage = Math.ceil(total.length / pageSize);

    return {
        content: total.slice(offset, offset + pageSize).sort((a, b) => a.createdAt < b.createdAt),
        totalCount: total.length,
        totalPage,
        pageSize,
        pageNumber,
        hasNext: pageNumber < totalPage
    }
}

const getAll = (dbName) => {
    const db = getDatabase(dbName);
    return Object.keys(db)
        .map(id => db[id])
        .sort((a, b) => a.createdAt < b.createdAt);
}

(() => {
    Object.keys(initialData).forEach(dbName => {
        initialData[dbName].forEach(item => add(dbName, item));
    });

})();

module.exports = {
    get, set, add, del, getPage, getAll
}