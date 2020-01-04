const fs = require("fs");
const https = require("https");
const basePath = `${__dirname}/../../..`;
const targetPathData = `${basePath}/src/data`;
const targetPathFiles = `${basePath}/uncompressed`;
const { processValues } = require(`${basePath}/src/services/airtable/airtable`);

const fileSubdirectoryMap = {
  "image/png": "img",
  "image/jpg": "img",
  "image/jpeg": "img",
};

const getValuesToFileAsList = ({ table, downloads }) => values => {
  const stringContent = `export const ${table} = ${JSON.stringify(values)}`;
  writeToFile({ table, stringContent });
  manageDownloads({ table, values, downloads });
};

const getValuesToFileAsObject = ({ table, key, downloads }) => values => {
  const fileContentStrings = [`export const ${table} = {`];
  values.map(value =>
    fileContentStrings.push(`"${value[key]}": ${JSON.stringify(value)},`),
  );
  fileContentStrings.push("}");
  const stringContent = fileContentStrings.join("");

  writeToFile({ table, stringContent });
  manageDownloads({ table, values, downloads });
};

const writeToFileAsList = ({
  baseId,
  table,
  view,
  downloads,
  fields,
  maxRecords,
}) => {
  processValues({
    baseId,
    table,
    view,
    fields,
    maxRecords,
    callback: getValuesToFileAsList({ table, downloads }),
  });
};

const writeToFileAsObject = ({
  baseId,
  table,
  view,
  key,
  downloads,
  fields,
  maxRecords,
}) => {
  processValues({
    baseId,
    table,
    view,
    fields,
    maxRecords,
    callback: getValuesToFileAsObject({ table, key, downloads }),
  });
};

const manageDownloads = ({ table, values, downloads }) => {
  if (downloads) {
    downloads.map(field => {
      values.map(value => {
        const attachments = value[field];
        attachments &&
          attachments.map(attachment => download({ table, attachment }));
      });
    });
  }
};

const download = ({ table, attachment }) => {
  const { url, filename, type } = attachment;

  if (type) {
    const pathname = `${targetPathFiles}/${getFileDirectory({
      type,
    })}/data/${filename}`;
    // TODO: do NOT download if size too big?
    let createFile = true;
    try {
      fs.openSync(pathname);
      // TODO: rewrite if file has differemt checksum (update image)
      createFile = false;
    } catch(error) {}

    if (createFile) {
      const fileStream = fs.createWriteStream(pathname);

      https.get(url, response => {
        response.pipe(fileStream);
      });
    }
  }
};

const writeToFile = ({ table, stringContent }) => {
  fs.writeFileSync(`${targetPathData}/${table}.js`, stringContent, {
    mode: 0o777,
  });
};

const getFileDirectory = ({ type }) => {
  const typeLower = type.toLowerCase();
  return fileSubdirectoryMap[typeLower]
    ? fileSubdirectoryMap[typeLower]
    : "other";
};

module.exports = {
  writeToFileAsList,
  writeToFileAsObject,
};
