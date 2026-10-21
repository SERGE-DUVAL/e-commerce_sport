const serverless = require('serverless-http');
const app = require('../../app');
const db = require('../../config/database');

const handleRequest = serverless(app);
let databaseReady;

async function initializeDatabase() {
  if (!databaseReady) {
    databaseReady = db.authenticate().catch(error => {
      databaseReady = undefined;
      throw error;
    });
  }

  await databaseReady;
}

exports.handler = async (event, context) => {
  await initializeDatabase();
  return handleRequest(event, context);
};
