import mongodb from "mongodb";
import * as config from "./../config/mongo";

let MongoClient = mongodb.MongoClient;

export const connect = async(callback, collection, data, res) => {
    await MongoClient.connect(config.MONGO_SERVER,
        {useNewUrlParser: true}, async (err, client) => {
            if (err) throw err;
            const dbo = client.db("crunchbase");
            let result = await callback(dbo, client, collection, data);
            if (res) {
                res.send(result);
            }
    });
};

export const createCollectionInDB = async (db, client, collection) => {
    await db.createCollection(collection, function (err, res) {
        if (err) throw err;
        client.close();
    });
};

export const insertOneDocument = (db, client, collection, data) => {
    db.collection(collection).insertOne(data, (err, res) => {
        if (err) throw err;
        client.close();
    });
};

export const insertManyDocuments = (db, client, collection, data) => {
    db.collection(collection).insertMany(data, function (err, res) {
        if (err) throw err;
        client.close();
    });
};

export const findOneDocument = async (db, client, collection, query = {}) => {
    return (await db.collection(collection).find(query).toArray());
};