import * as mongoAdapter from "./../adapters/mongoAdapter";

export const createCollection = (collection) => {
    mongoAdapter.connect(mongoAdapter.createCollectionInDB, collection);
}

export const insertOneDocument = (collection, data) => {
    mongoAdapter.connect(mongoAdapter.insertOneDocument, collection, data);
}

export const insertManyDocuments = (collection, data) => {
    mongoAdapter.connect(mongoAdapter.insertManyDocuments, collection, data);
}

export const findDocument = (collection, query, res) => {
    return mongoAdapter.connect(mongoAdapter.findOneDocument, collection, query, res);
}