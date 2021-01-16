const Airtable = require("airtable");
const airtable = new Airtable({
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

// const finished = err => {
//     if (err) { console.error(err); }
// };

export const upsertRecord = ({
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
