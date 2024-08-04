// data.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Define the path to the data.json file
const dataFilePath = path.join(process.cwd(), 'data.json');

// Function to fetch additional data from the API
const fetchChannelData = async (id) => {
  const apiUrl = `https://fox.toxic-gang.xyz/jplus/key/${id}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching data for ID ${id}:`, error);
    return null;
  }
};

// Function to update data.json with new information
const updateDataFile = async () => {
  try {
    // Read the existing data from data.json
    const existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Create an array to store the updated data
    const updatedData = [];

    // Loop through each channel in the existing data
    for (const channel of existingData) {
      // Fetch the additional data for the current channel
      const details = await fetchChannelData(channel.id);

      if (details) {
        // Update the channel object with the fetched data
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
      } else {
        // If fetching data failed, keep the original channel data
        updatedData.push(channel);
      }
    }

    // Write the updated data back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
    console.log('Data file updated successfully.');
  } catch (error) {
    console.error('Error updating data file:', error);
  }
};

// Run the updateDataFile function
updateDataFile();
