const fs = require("fs");

const generateData = (fileName, startDate, endDate) => {
  const gameName = "Super Faridabad";
  const dataEntries = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (
    let currentDate = start;
    currentDate <= end;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    let time = new Date(currentDate);
    time.setHours(10, 0, 0, 0); // Start at 10:00 AM

    // Loop until 10:00 PM (22:00)
    while (time.getHours() < 22 || (time.getHours() === 22 && time.getMinutes() === 0)) {
      const randomResult = String(Math.floor(Math.random() * 100)).padStart(2, "0");
      const dateISOString = time.toISOString();
      const createdAt = dateISOString;
      const updatedAt = dateISOString;
      const pherma = `\n"${gameName}",${dateISOString},${randomResult},0,${createdAt},${updatedAt}`;
      dataEntries.push(pherma);
      time.setMinutes(time.getMinutes() + 30); // Increment time by 30 minutes
    }
  }
  
  // Create header for CSV file
  const startLine = "game,date,result,__v,createdAt,updatedAt";
  
  // Write the header and data entries to the CSV file
  fs.writeFile(fileName, startLine + dataEntries.join(""), (err) => {
    if (err) console.error("Error in writing file --> ", err);
    else console.log("Data saved successfully");
  });
};

// Generate data for a specific date
generateData("superFaridabad_nov.csv", "2024-11-01", "2024-11-12");
