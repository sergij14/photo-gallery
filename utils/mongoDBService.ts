import { Db, MongoClient } from "mongodb";

const DB_STRING = process.env.DB_URI as string;
const DB_PASS = process.env.DB_PASS as string;

const DB_URI = DB_STRING.replace("<password>", DB_PASS);

class MongoDBService {
  private client?: MongoClient;
  private db?: Db;

  async connect() {
    if (this.client) {
      return this;
    }
    try {
      const client = await MongoClient.connect(DB_URI);
      this.client = client;

      this.db = this.client.db();
      return this;
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  async insertDocument(collectionName: string, document = {}) {
    const collection = this.db?.collection(collectionName);
    const result = await collection?.insertOne(document);
    return result?.insertedId;
  }

  async insertDocuments(collectionName: string, documents = []) {
    const collection = this.db?.collection(collectionName);
    const result = await collection?.insertMany(documents);
    return result?.insertedIds;
  }

  async findDocument(collectionName: string, query = {}) {
    const collection = this.db?.collection(collectionName);
    return collection?.findOne(query);
  }

  async countDocuments(collectionName: string) {
    const collection = this.db?.collection(collectionName);
    return collection?.countDocuments();
  }

  async findDocuments(collectionName: string, query = {}, skip = 0, limit:number) {
    const collection = this.db?.collection(collectionName);

    let queryOperation = collection?.find(query);

    if (skip) {
      queryOperation = queryOperation?.skip(skip).limit(limit);
    }

    return queryOperation?.toArray();
  }

  async updateDocument(collectionName: string, query = {}, update = {}) {
    const collection = this.db?.collection(collectionName);
    const result = await collection?.updateOne(query, { $set: update });
    return result?.modifiedCount;
  }

  async updateDocuments(collectionName: string, query = {}, update = {}) {
    const collection = this.db?.collection(collectionName);
    const result = await collection?.updateMany(query, { $set: update });
    return result?.modifiedCount;
  }

  async deleteDocument(collectionName: string, query = {}) {
    const collection = this.db?.collection(collectionName);
    const result = await collection?.deleteOne(query);
    return result?.deletedCount;
  }

  async deleteDocuments(collectionName: string, query = {}) {
    const collection = this.db?.collection(collectionName);
    const result = await collection?.deleteMany(query);
    return result?.deletedCount;
  }
}

export const mongoDBService = new MongoDBService();
