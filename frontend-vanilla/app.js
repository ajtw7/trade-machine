// --- API Helpers ---
const API_BASE_URL = "http://127.0.0.1:8000";
const API = {
  getTeams: () => fetch(`${API_BASE_URL}/teams`).then(r => r.json()),
  getPlayers: () => fetch(`${API_BASE_URL}/players`).then(r => r.json()),
  // Add more endpoints as needed
};

// --- DOM Elements ---
const app = document.getElementById('tab-content');

// --- Tab Navigation ---
function setupTabs() {
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTab(btn.dataset.tab);
    };
  });
}

// --- Tab Rendering ---
function renderTab(tab) {
  if (tab === 'teams') {
    renderTeams();
  } else if (tab === 'players') {
    renderPlayers();
  } else if (tab === 'trade') {
    app.innerHTML = `<div class="centered muted">Trade Builder coming soon!</div>`;
  }
}

// --- Teams List Skeleton ---
async function renderTeams() {
  app.innerHTML = `<div class="centered">Loading teams...</div>`;
  const teams = await API.getTeams();
  app.innerHTML = `
    <div class="header">
      <h2>Teams</h2>
      <button id="add-team-btn">Add</button>
    </div>
    <ul class="list">
      ${teams.map(team => `
        <li class="item">
          <span>${team.team_name}</span>
          <div class="actions">
            <button>Edit</button>
            <button class="danger">Delete</button>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

// --- Players List Skeleton ---
async function renderPlayers() {
  app.innerHTML = `<div class="centered">Loading players...</div>`;
  const players = await API.getPlayers();
  app.innerHTML = `
    <div class="header">
      <h2>Players</h2>
      <button id="add-player-btn">Add Player</button>
    </div>
    <ul class="list">
      ${players.map(player => `
        <li class="item">
          <span><strong>${player.first_name} ${player.last_name}</strong> — ${player.position} — #${player.jersey_number}</span>
          <div class="actions">
            <button>Edit</button>
            <button class="danger">Delete</button>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

// --- Initial Render ---
setupTabs();
renderTab('teams');