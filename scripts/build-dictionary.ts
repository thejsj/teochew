const axios = require("axios");
const csv = require("csvtojson");
const fs = require("fs");

const url =
  "https://docs.google.com/spreadsheets/d/1cR3K3_WX3ntdO3u6H67LbYTWrvi5lhCC0d0HyyY_nkg/export?format=csv&gid=0";

axios({
  url,
  method: "GET",
  responseType: "blob", // important
}).then(async (response) => {
  const csvString = response.data;

  const output = await csv({
    noheader: false,
    output: "csv",
  }).fromString(csvString);

  const dictionary = output.map((row) => {
    return {
      word: row[0],
      definition: row[1],
      simplified: row[2] || "",
      traditional: row[3] || "",
      // row[4] is slang?
      wordGroup: row[7] || "",
      dateAdded: row[8] || "",
    };
  });

  fs.writeFileSync(
    "../web/src/dictionary.json",
    JSON.stringify(dictionary, null, 2)
  );
});
