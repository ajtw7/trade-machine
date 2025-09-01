<template>
  <div class="panelContent">
    <div class="header">
      <h2>Players</h2>
      <button @click="openAddModal">Add Player</button>
    </div>
    <ul class="player-list" v-if="players.length">
      <li v-for="player in players" :key="player.player_id" class="player-item">
        <span>
          <strong>{{ player.first_name }} {{ player.last_name }}</strong>
          — {{ player.position }} — #{{ player.jersey_number }}
        </span>
        <div class="actions">
          <button @click="openEditModal(player)">Edit</button>
          <button @click="confirmDelete(player.player_id)" class="danger">Delete</button>
        </div>
      </li>
    </ul>
    <div v-else class="centered muted">
      No players found.
    </div>

    <!-- Add Player Modal -->
    <div v-if="addOpen" class="modal" @click.self="closeAddModal">
      <div class="modal-content">
        <h3>Add Player</h3>
        <form @submit.prevent="handleAddSubmit">
          <div v-for="field in PLAYER_FIELDS" :key="field.name" class="form-group">
            <label :for="field.name">{{ field.label }}</label>
            <select
              v-if="field.type === 'select'"
              :id="field.name"
              v-model="addForm[field.name]"
              :required="field.required"
            >
              <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
                {{ team.team_name }}
              </option>
            </select>
            <input
              v-else
              :id="field.name"
              v-model="addForm[field.name]"
              :type="field.type === 'number' ? 'number' : 'text'"
              :required="field.required"
            />
          </div>
          <div v-if="addError" class="error">{{ addError }}</div>
          <div class="modal-actions">
            <button type="button" @click="closeAddModal">Cancel</button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Player Modal -->
    <div v-if="editOpen" class="modal" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>Edit Player</h3>
        <form @submit.prevent="handleEditSubmit">
          <div v-for="field in PLAYER_FIELDS" :key="field.name" class="form-group">
            <label :for="'edit-' + field.name">{{ field.label }}</label>
            <select
              v-if="field.type === 'select'"
              :id="'edit-' + field.name"
              v-model="editForm[field.name]"
              :required="field.required"
            >
              <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
                {{ team.team_name }}
              </option>
            </select>
            <input
              v-else
              :id="'edit-' + field.name"
              v-model="editForm[field.name]"
              :type="field.type === 'number' ? 'number' : 'text'"
              :required="field.required"
            />
          </div>
          <div v-if="editError" class="error">{{ editError }}</div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal">Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="confirmingId !== null" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this player?</p>
        <div class="modal-actions">
          <button @click="handleDelete">Yes</button>
          <button @click="cancelDelete">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const PLAYER_FIELDS = [
  { name: 'team_id', label: 'Team', required: true, type: 'select' },
  { name: 'first_name', label: 'First Name', required: true },
  { name: 'last_name', label: 'Last Name', required: true },
  { name: 'birth_date', label: 'Birth Date', required: true },
  { name: 'nationality', label: 'Nationality', required: true },
  { name: 'position', label: 'Position', required: true },
  { name: 'height', label: 'Height', required: false },
  { name: 'weight', label: 'Weight', required: false, type: 'number' },
  { name: 'jersey_number', label: 'Jersey Number', required: true, type: 'number' },
  { name: 'contract_start_year', label: 'Contract Start Year', required: true, type: 'number' },
  { name: 'contract_end_year', label: 'Contract End Year', required: true, type: 'number' },
  { name: 'salary', label: 'Salary', required: true, type: 'number' },
  { name: 'college', label: 'College', required: true },
  { name: 'draft_year', label: 'Draft Year', required: true, type: 'number' },
  { name: 'experience', label: 'Experience', required: true, type: 'number' },
];

export default {
  name: "PlayersList",
  data() {
    return {
      players: [],
      teams: [],
      loading: false,
      error: null,
      confirmingId: null,
      addOpen: false,
      addForm: PLAYER_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
      addError: '',
      editOpen: false,
      editForm: PLAYER_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
      editId: null,
      editError: '',
    };
  },
  computed: {
    PLAYER_FIELDS() {
      return PLAYER_FIELDS;
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleEscape);
    this.loadPlayers();
    this.loadTeams();
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleEscape);
  },
  methods: {
    async loadPlayers() {
      this.loading = true;
      try {
        const res = await axios.get('/players');
        this.players = res.data || [];
      } catch (e) {
        this.error = 'Failed to load players.';
      } finally {
        this.loading = false;
      }
    },
    async loadTeams() {
      try {
        const res = await axios.get('/teams');
        this.teams = res.data || [];
      } catch (e) {
        this.teams = [];
      }
    },
    openAddModal() {
      this.addForm = PLAYER_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
      this.addError = '';
      this.addOpen = true;
    },
    closeAddModal() {
      this.addOpen = false;
    },
    async handleAddSubmit() {
      for (const field of PLAYER_FIELDS) {
        if (field.required && !String(this.addForm[field.name]).trim()) {
          this.addError = `"${field.label}" is required.`;
          return;
        }
      }
      try {
        const payload = { ...this.addForm };
        PLAYER_FIELDS.forEach(field => {
          if (field.type === 'number' && payload[field.name] !== '') {
            payload[field.name] = Number(payload[field.name]);
          }
        });
        payload.team_id = Number(payload.team_id);
        await axios.post('/players', payload);
        this.addOpen = false;
        await this.loadPlayers();
      } catch (e) {
        this.addError = e?.response?.data?.message || e?.message || 'Failed to add player.';
      }
    },
    openEditModal(player) {
      this.editForm = { ...player };
      this.editId = player.player_id;
      this.editError = '';
      this.editOpen = true;
    },
    closeEditModal() {
      this.editOpen = false;
    },
    async handleEditSubmit() {
      for (const field of PLAYER_FIELDS) {
        if (field.required && !String(this.editForm[field.name]).trim()) {
          this.editError = `"${field.label}" is required.`;
          return;
        }
      }
      try {
        const payload = { ...this.editForm };
        PLAYER_FIELDS.forEach(field => {
          if (field.type === 'number' && payload[field.name] !== '') {
            payload[field.name] = Number(payload[field.name]);
          }
        });
        payload.team_id = Number(payload.team_id);
        await axios.put(`/players/${this.editId}`, payload);
        this.editOpen = false;
        await this.loadPlayers();
      } catch (e) {
        this.editError = e?.response?.data?.message || e?.message || 'Failed to update player.';
      }
    },
    confirmDelete(id) {
      this.confirmingId = id;
    },
    cancelDelete() {
      this.confirmingId = null;
    },
    async handleDelete() {
      try {
        await axios.delete(`/players/${this.confirmingId}`);
        await this.loadPlayers();
      } catch (e) {
        alert('Failed to delete player.');
      } finally {
        this.confirmingId = null;
      }
    },
    handleEscape(e) {
      if (e.key === 'Escape') {
        if (this.editOpen) this.closeEditModal();
        if (this.addOpen) this.closeAddModal();
        if (this.confirmingId !== null) this.cancelDelete();
      }
    },
  }
};
</script>

<style scoped>
.panelContent {
  max-width: 700px;
  margin: 2em auto;
  padding: 2em;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5em;
}
.player-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5em 0;
}
.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75em 0;
  border-bottom: 1px solid #eee;
}
.actions button {
  margin-left: 0.5em;
}
.danger {
  color: #c00;
}
.centered {
  text-align: center;
  padding: 2em;
}
.muted {
  color: #888;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2em 0;        /* Add vertical padding to prevent touching edges */
}
.modal-content {
  background: #fff;
  padding: 2em;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;      /* Limit modal height to 80% of viewport */
  overflow-y: auto;      /* Enable vertical scroll if needed */
  box-sizing: border-box;
}
.form-group {
  margin-bottom: 1em;
}
.form-group label {
  display: block;
  margin-bottom: 0.25em;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  margin-top: 1em;
}
.error {
  color: #c00;
  margin-bottom: 1em;
}
</style>