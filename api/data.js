const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data.json');

// Function to fetch data from the API and update the JSON file
const updateDataFile = async (id) => {
  const apiUrl = `https://fox.toxic-gang.xyz/jplus/key/${id}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Data file updated successfully.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

module.exports = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send('ID is required');
    return;
  }

  await updateDataFile(id);
  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream(dataFilePath).pipe(res);
};
