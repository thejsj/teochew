import { EntryCustom } from './types'

const axios = require("axios");
const csv = require("csvtojson");
const fs = require("fs");

const url =
  "https://docs.google.com/spreadsheets/d/1cR3K3_WX3ntdO3u6H67LbYTWrvi5lhCC0d0HyyY_nkg/export?format=csv&gid=0";

axios({
  url,
  method: "GET",
  responseType: "blob", // important
}).then(async (response: any) => {
  const csvString = response.data;

  const output = await csv({
    noheader: false,
    output: "csv",
  }).fromString(csvString);

  const dictionary = await Promise.all(output.map(async (row: string[]) => {
   const entry : EntryCustom = {
      word: row[0],
      definition: row[1],
      simplified: row[2] || "",
      traditional: row[3] || "",
      // row[4] is slang?
      // row[5] is mandarin (simplified)
      // row[6] is mandarin (traditional)
      wordGroup: row[7] || "",
      dateAdded: row[8] || "",
    };
    return entry
  }));

  fs.writeFileSync(
    "../web/src/dictionary.custom.json",
    JSON.stringify(dictionary, null, 2)
  );
});
