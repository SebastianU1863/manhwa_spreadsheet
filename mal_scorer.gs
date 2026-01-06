function malOverwrite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headerRow = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const titles = sheet.getRange(2, headerRow.indexOf("Title")+1, sheet.getLastRow() - 1).getValues();
  const output = [];
  for (i = 0; i < titles.length; i++) {
    const title = titles[i][0];
    output.push([malSearchScore(title)]);
    Utilities.sleep(1100); 
  }
  sheet.getRange(2, headerRow.indexOf("MAL Score")+1, output.length, 1).setValues(output);
}

function malBlanks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headerRow = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const titles = sheet.getRange(2, headerRow.indexOf("Title")+1, sheet.getLastRow() - 1).getValues();
  const scores = sheet.getRange(2, headerRow.indexOf("MAL Score")+1, sheet.getLastRow() - 1).getValues();
  const output = [];
  for (i = 0; i < titles.length; i++) {
    const title = titles[i][0];
    const existingScore = scores[i][0];
    if (!title || existingScore) {
      output.push([existingScore]);
      continue;
    }
    output.push([malSearchScore(title)]);
    Utilities.sleep(1100);
  }
  sheet.getRange(2, headerRow.indexOf("MAL Score")+1, output.length, 1).setValues(output);
}

function malSearchScore(title){
  console.log("Searching MAL for: " + title);
    const results = JSON.parse(UrlFetchApp.fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(title)}&limit=10`).getContentText()).data;
    if (results && results.length > 0) {
      const manhwa = results.find(m => m.type && m.type.toLowerCase() === "manhwa");
      if (manhwa)
        malScore = manhwa.score || "N/A";
      else
        malScore = results[0].score || "N/A"; 
      }
  return malScore;
}
