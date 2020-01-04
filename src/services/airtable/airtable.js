const Airtable = require("airtable");
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

// const finished = err => {
//     if (err) { console.error(err); }
// };

const processRecords = async ({
  baseId,
  table,
  view = "",
  callback,
  fields = [],
  maxRecords = 100,
}) => {
  const base = airtable.base(baseId);

  base(table)
    .select({ view, fields, maxRecords })
    .eachPage(pageRecords => {
      const records = [];
      pageRecords.forEach(record => {
        records.push(record);
      });

      callback(records);
    });
};

const processValues = async ({
  baseId,
  table,
  view,
  callback,
  fields,
  maxRecords,
}) => {
  processRecords({
    baseId,
    table,
    view,
    fields,
    maxRecords,
    callback: records => {
      const values = records.map(record => ({
        id: record.id,
        ...record.fields,
        createdTime: record._rawJson.createdTime,
      }));

      callback(values);
    },
  });
};

module.exports = {
  processRecords,
  processValues,
};
