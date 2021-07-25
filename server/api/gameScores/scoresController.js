/* eslint-disable no-async-promise-executor */
/* eslint-disable no-undef */
const { MongoClient } = require('mongodb');

function scoresRepo() {
  const dbName = 'gameResults';

  function loadWinners(winners) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(process.env.MongoURI);
      try {
        await client.connect();
        const db = client.db(dbName);
        const winnersCollection = await db.collection('winners');

        winnersCollection.drop();
        winnersArr = winnersCollection.insertOne(winners);
        resolve(winnersArr);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function loadLosers(losers) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(process.env.MongoURI);

      try {
        await client.connect();
        const db = client.db(dbName);
        const losersCollection = await db.collection('losers');

        losersCollection.drop();
        losersArr = await db.collection('losers').insertOne(losers);
        resolve(losersArr);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadWinners, loadLosers };
}

module.exports = scoresRepo();
