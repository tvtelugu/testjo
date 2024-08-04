// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('channelGridContainer');

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(channel => {
        const card = document.createElement('div');
        card.classList.add('channel-card');

        const img = document.createElement('img');
        img.src = channel.logo;
        img.alt = channel.name;

        const title = document.createElement('h3');
        title.textContent = channel.name;

        card.appendChild(img);
        card.appendChild(title);
        container.appendChild(card);
      });
    })
    .catch(error => console.error('Error loading data:', error));
});
