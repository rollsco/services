const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app3eY4aYIWBfmrOw');

// const finished = err => {
//     if (err) { console.error(err); }
// };

const processRecords = async ({table, callback, fields = [], maxRecords = 100}) => {
  base(table).select({fields, maxRecords}).eachPage(
    (pageRecords) => {
      const records = [];
      pageRecords.forEach((record) => {
        records.push(record);
      });

      callback(records);
    }
  );
};

const processValues = async ({table, callback, fields, maxRecords}) => {
  processRecords({table, fields, maxRecords, callback: records => {
    const values = records.map(record => ({...record.fields, createdTime: record._rawJson.createdTime}));

    callback(values);
  }});
}

module.exports = {
  processRecords,
  processValues
}