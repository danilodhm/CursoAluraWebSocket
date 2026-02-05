
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collectionDb = null;

try {
  await client.connect();

  const database = client.db('DBChat');
  collectionDb = database.collection('Chat');

  console.log('Connected to MongoDB successfully!');
} catch (e) {
  console.error('Error connecting to MongoDB:', e);
}

// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);


export { collectionDb };