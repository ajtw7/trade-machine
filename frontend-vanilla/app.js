// --- API Helpers ---
const API_BASE_URL = "http://127.0.0.1:8000";
const API = {
  getTeams: () => fetch(`${API_BASE_URL}/teams`).then(r => r.json()),
  addTeam: (data) =>
    fetch(`${API_BASE_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updateTeam: (id, data) =>
    fetch(`${API_BASE_URL}/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteTeam: (id) =>
    fetch(`${API_BASE_URL}/teams/${id}`, { method: "DELETE" }),
  getPlayers: () => fetch(`${API_BASE_URL}/players`).then(r => r.json()),
  addPlayer: (data) =>
    fetch(`${API_BASE_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updatePlayer: (id, data) =>
    fetch(`${API_BASE_URL}/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deletePlayer: (id) =>
    fetch(`${API_BASE_URL}/players/${id}`, { method: "DELETE" }),
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

// --- Teams List + Modals ---
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
            <button data-edit="${team.team_id}">Edit</button>
            <button class="danger" data-delete="${team.team_id}">Delete</button>
          </div>
        </li>
      `).join('')}
    </ul>
    <div id="modal-root"></div>
  `;

  document.getElementById('add-team-btn').onclick = showAddTeamModal;
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.onclick = () => showEditTeamModal(teams.find(t => t.team_id == btn.dataset.edit));
  });
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.onclick = async () => {
      if (confirm('Delete this team?')) {
        await API.deleteTeam(btn.dataset.delete);
        renderTeams();
      }
    };
  });
}

function showAddTeamModal() {
  showTeamModal('Add Team', {}, async (data) => {
    data.titles = Number(data.titles);
    await API.addTeam(data);
    renderTeams();
  });
}

function showEditTeamModal(team) {
  showTeamModal('Edit Team', team, async (data) => {
    data.titles = Number(data.titles);
    await API.updateTeam(team.team_id, data);
    renderTeams();
  });
}

function showTeamModal(title, team, onSubmit) {
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal">
      <h3>${title}</h3>
      <form id="team-form">
        <div class="form-group">
          <label>Team Name</label>
          <input name="team_name" value="${team.team_name || ''}" required />
        </div>
        <div class="form-group">
          <label>Titles</label>
          <input name="titles" type="number" value="${team.titles || ''}" required />
        </div>
        <!-- Add more fields as needed -->
        <div class="modal-actions">
          <button type="button" id="cancel-team">Cancel</button>
          <button type="submit">${title.includes('Edit') ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  `;
  document.getElementById('modal-root').appendChild(modal);

  document.getElementById('cancel-team').onclick = () => modal.remove();
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.getElementById('team-form').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await onSubmit(data);
    modal.remove();
  };
}

// --- Players List + Modals ---
async function renderPlayers() {
  app.innerHTML = `<div class="centered">Loading players...</div>`;
  const [players, teams] = await Promise.all([API.getPlayers(), API.getTeams()]);
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
            <button data-edit="${player.player_id}">Edit</button>
            <button class="danger" data-delete="${player.player_id}">Delete</button>
          </div>
        </li>
      `).join('')}
    </ul>
    <div id="modal-root"></div>
  `;

  document.getElementById('add-player-btn').onclick = () => showAddPlayerModal(teams);
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.onclick = () => showEditPlayerModal(players.find(p => p.player_id == btn.dataset.edit), teams);
  });
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.onclick = async () => {
      if (confirm('Delete this player?')) {
        await API.deletePlayer(btn.dataset.delete);
        renderPlayers();
      }
    };
  });
}

function showAddPlayerModal(teams) {
  showPlayerModal('Add Player', {}, teams, async (data) => {
    data.team_id = Number(data.team_id);
    data.jersey_number = Number(data.jersey_number);
    await API.addPlayer(data);
    renderPlayers();
  });
}

function showEditPlayerModal(player, teams) {
  showPlayerModal('Edit Player', player, teams, async (data) => {
    data.team_id = Number(data.team_id);
    data.jersey_number = Number(data.jersey_number);
    await API.updatePlayer(player.player_id, data);
    renderPlayers();
  });
}

function showPlayerModal(title, player, teams, onSubmit) {
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal">
      <h3>${title}</h3>
      <form id="player-form">
        <div class="form-group">
          <label>First Name</label>
          <input name="first_name" value="${player.first_name || ''}" required />
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input name="last_name" value="${player.last_name || ''}" required />
        </div>
        <div class="form-group">
          <label>Team</label>
          <select name="team_id" required>
            <option value="">Select a team</option>
            ${teams.map(team => `<option value="${team.team_id}" ${player.team_id == team.team_id ? 'selected' : ''}>${team.team_name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Position</label>
          <input name="position" value="${player.position || ''}" required />
        </div>
        <div class="form-group">
          <label>Jersey Number</label>
          <input name="jersey_number" type="number" value="${player.jersey_number || ''}" required />
        </div>
        <!-- Add more fields as needed -->
        <div class="modal-actions">
          <button type="button" id="cancel-player">Cancel</button>
          <button type="submit">${title.includes('Edit') ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  `;
  document.getElementById('modal-root').appendChild(modal);

  document.getElementById('cancel-player').onclick = () => modal.remove();
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.getElementById('player-form').onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await onSubmit(data);
    modal.remove();
  };
}

// --- Initial Render ---
setupTabs();
renderTab('teams');