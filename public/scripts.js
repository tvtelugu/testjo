// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const channelGridContainer = document.getElementById('channelGridContainer');
  const jwplayerDiv = document.getElementById('jwplayerDiv');
  
  // Fetch channel data and populate the grid
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      if (channelGridContainer) {
        data.forEach(channel => {
          const card = document.createElement('div');
          card.classList.add('channel-card');
          card.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}">
            <h3>${channel.name}</h3>
            <a href="player.html?id=${channel.id}">Watch</a>
          `;
          channelGridContainer.appendChild(card);
        });
      }
      
      // Check if we're on the player page
      const urlParams = new URLSearchParams(window.location.search);
      const channelId = urlParams.get('id');
      if (channelId && jwplayerDiv) {
        const fetchChannelData = async (id) => {
          const response = await fetch(`https://fox.toxic-gang.xyz/jplus/key/${id}`);
          return response.json();
        };

        fetchChannelData(channelId)
          .then(details => {
            const { initialUrl, drm } = details[0].data;
            const { keyId, key, licence1, licence2 } = drm;
            
            // Set up JW Player
            jwplayer('jwplayerDiv').setup({
              file: initialUrl,
              autostart: true,
              width: '100%',
              type: 'dash',
              drm: {
                clearkey: {
                  keyId: keyId,
                  key: key
                }
              }
            });
          })
          .catch(error => console.error('Error loading player data:', error));
      }
    })
    .catch(error => console.error('Error loading data:', error));
});
