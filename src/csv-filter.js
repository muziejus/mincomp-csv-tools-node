const fs = require("fs");
const csv = require("csv");
const process = require("process");

// Read and parse the SST csv.
fs.readFile(process.argv[2], (err, file) => {
  if (err) throw err;
  csv.parse(file, { columns: true }, (err, SingleSourceOfTruth) => {
    if (err) throw err;

    // Build a dataset out of the SST.
    const dataset = SingleSourceOfTruth.filter(row => {
      return row.use_this_row === true || row.use_this_row.match(/TRUE/i);
    });

    // Now convert back to csv and write a new file.
    csv.stringify(dataset,
      {
        // create a header row
        header: true,
        // the list of column names for the header row. These must
        // match dataset property names.
        // You could also have:
        columns: Object.keys(dataset[0])
        // columns: ["array", "of", "column", "names"]
      },
      (err, output) => {
        if (err) throw err;
        fs.writeFile(process.argv[3], output, (err) => {
          if (err) throw err;
          process.stdout.write(`File ${process.argv[3]} successfully written.\n`);
        });
      });
  });
});

