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

  const dictionary = await Promise.all(output.map(async (row) => {
    // const word = row[0]

    // let hasSoundFile = false
    // if (word.split(/[0-9]+/g).filter(x => x.length > 0).length === 1) {
      // try {
        // const result = await axios({
          // url: `https://www.mogher.com/sound/syllabes/${word}.mp3`,
          // method: "GET",
          // responseType: "blob", // important
        // })
        // hasSoundFile = response.status === 200

      // } catch(err) {
        // hasSoundFile = false
      // }
      // console.log('---')
      // console.log(word, row[1], row[2])
      // console.log(`https://www.mogher.com/sound/syllabes/${word}.mp3`)
      // console.log(hasSoundFile)
    // }

    return {
      word: row[0],
      definition: row[1],
      simplified: row[2] || "",
      traditional: row[3] || "",
      // row[4] is slang?
      // row[5] is mandarin (simplified)
      // row[6] is mandarin (traditional)
      wordGroup: row[7] || "",
      dateAdded: row[8] || "",
      hasSoundFile,
    };
  }));

  fs.writeFileSync(
    "../web/src/dictionary.custom.json",
    JSON.stringify(dictionary, null, 2)
  );
});
