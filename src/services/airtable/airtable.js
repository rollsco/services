const Airtable = require("airtable");
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

// const finished = err => {
//     if (err) { console.error(err); }
// };

const upsertRecord = ({
  baseId,
  view,
  table,
  filterByFormula,
  getNewRecord,
}) => {
  const base = airtable.base(baseId);

  base(table)
    .select({
      maxRecords: 1,
      view,
      filterByFormula,
    })
    .eachPage((records) => {
      if (records.length > 0) {
        const oldRecord = records[0];
        const newRecord = getNewRecord({ oldRecord });

        if (!newRecord) {
          return;
        }

        base(table).update([
          {
            id: oldRecord.id,
            fields: newRecord,
          },
        ]);
      } else {
        const newRecord = getNewRecord({});
        base(table).create([
          {
            fields: newRecord,
          },
        ]);
      }
    });
};

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
    .eachPage(
      (pageRecords) => {
        const records = [];
        pageRecords.forEach((record) => {
          records.push(record);
        });

        callback(records);
      },
      (error) => {
        console.log("--error", error);
      },
    );
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
    callback: (records) => {
      const values = records.map((record) => ({
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
  upsertRecord,
};
