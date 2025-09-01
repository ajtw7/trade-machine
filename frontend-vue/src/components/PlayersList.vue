<!-- filepath: /Users/drew/Projects/trade-machine/frontend-vue/src/components/PlayersList.vue -->
<template>
  <div>
    <h2>Players</h2>
    <button @click="openAddModal">Add Player</button>
    <ul v-if="players.length">
      <li v-for="player in players" :key="player.player_id">
        <strong>{{ player.first_name }} {{ player.last_name }}</strong>
        — {{ player.position }} — #{{ player.jersey_number }}
        <button @click="openEditModal(player)">Edit</button>
        <button @click="confirmDelete(player.player_id)">Delete</button>
      </li>
    </ul>
    <div v-else>
      No players found.
    </div>

    <!-- Add Player Modal -->
    <div v-if="addOpen" class="modal">
      <h3>Add Player</h3>
      <form @submit.prevent="handleAddSubmit">
        <div v-for="field in PLAYER_FIELDS" :key="field.name">
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
        <div v-if="addError" style="color: red;">{{ addError }}</div>
        <button type="button" @click="closeAddModal">Cancel</button>
        <button type="submit">Add</button>
      </form>
    </div>

    <!-- Edit Player Modal -->
    <div v-if="editOpen" class="modal">
      <h3>Edit Player</h3>
      <form @submit.prevent="handleEditSubmit">
        <div v-for="field in PLAYER_FIELDS" :key="field.name">
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
        <div v-if="editError" style="color: red;">{{ editError }}</div>
        <button type="button" @click="closeEditModal">Cancel</button>
        <button type="submit">Save</button>
      </form>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="confirmingId !== null" class="modal">
      <p>Are you sure you want to delete this player?</p>
      <button @click="handleDelete">Yes</button>
      <button @click="cancelDelete">No</button>
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
    this.loadPlayers();
    this.loadTeams();
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
      // Validate required fields
      for (const field of PLAYER_FIELDS) {
        if (field.required && !String(this.addForm[field.name]).trim()) {
          this.addError = `"${field.label}" is required.`;
          return;
        }
      }
      try {
        const payload = { ...this.addForm };
        // Convert number fields
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
      // Validate required fields
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
  }
};
</script>

<style scoped>
.modal {
  background: #fff;
  border: 1px solid #ccc;
  padding: 1em;
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1000;
}
</style>