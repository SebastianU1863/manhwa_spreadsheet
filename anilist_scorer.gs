function anilistOverwrite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headerRow = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const titles = sheet.getRange(2, headerRow.indexOf("Title")+1, sheet.getLastRow() - 1).getValues();
  const output = [];
  for (i = 0; i < titles.length; i++) {
    const title = titles[i][0];
    output.push([anilistSearchScore(title)]);
    Utilities.sleep(800); 
  }
  sheet.getRange(2, headerRow.indexOf("Anilist Score")+1, output.length, 1).setValues(output);
}

function anilistBlanks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headerRow = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const titles = sheet.getRange(2, headerRow.indexOf("Title")+1, sheet.getLastRow() - 1).getValues();
  const scores = sheet.getRange(2, headerRow.indexOf("Anilist Score")+1, sheet.getLastRow() - 1).getValues();
  const output = [];
  for (i = 0; i < titles.length; i++) {
    const title = titles[i][0];
    const existingScore = scores[i][0];
    if (!title || existingScore) {
      output.push([existingScore]);
      continue;
    }
    output.push([anilistSearchScore(title)]);
    Utilities.sleep(800);
  }
  sheet.getRange(2, headerRow.indexOf("Anilist Score")+1, output.length, 1).setValues(output);
}

function anilistSearchScore(title) {
  console.log("Searching AniList for: " + title);

  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA) {
        title {
          romaji
          english
        }
        format
        meanScore
      }
    }
  `;

  const variables = {
    search: title
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      query: query,
      variables: variables
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch('https://graphql.anilist.co', options);
  const data = JSON.parse(response.getContentText());

  if (data && data.data && data.data.Media) {
    const media = data.data.Media;
    const score = media.meanScore;
    return score !== null ? score : "N/A";
  }

  return "N/A";
}


