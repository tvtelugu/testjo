const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data.json');

// Function to fetch additional data for each channel
const fetchChannelData = async (id) => {
  const apiUrl = `https://fox.toxic-gang.xyz/jplus/key/${id}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching channel data:', error);
    return null;
  }
};

// Function to update the data.json file with new information
const updateDataFile = async () => {
  try {
    // Read the existing data
    const existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const updatedData = [];

    for (const channel of existingData) {
      const details = await fetchChannelData(channel.id);
      if (details) {
        const updatedChannel = {
          ...channel,
          url: details[0]?.data?.initialUrl || '',
          drm: {
            keyId: details[0]?.keys?.keys[0]?.kid || '',
            key: details[0]?.keys?.keys[0]?.k || '',
            licence1: details[0]?.data?.licence1 || '',
            licence2: details[0]?.data?.licence2 || ''
          }
        };
        updatedData.push(updatedChannel);
      }
    }

    // Write the updated data back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
    console.log('Data file updated successfully.');
  } catch (error) {
    console.error('Error updating data file:', error);
  }
};

module.exports = async (req, res) => {
  await updateDataFile();
  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream(dataFilePath).pipe(res);
};
