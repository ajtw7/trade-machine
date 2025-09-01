<template>
  <div class="panelContent">
    <div class="header">
      <h2>Teams</h2>
      <button @click="openAddModal">Add</button>
    </div>
    <ul class="team-list">
      <li v-for="team in teams" :key="team.team_id" class="team-item">
        <span>{{ team.team_name }}</span>
        <div class="actions">
          <button @click="openEditModal(team)">Edit</button>
          <button @click="startConfirmDelete(team.team_id)" class="danger">Delete</button>
          <span v-if="confirmingId === team.team_id" class="confirm-delete">
            <button @click="confirmDelete(team.team_id)" :disabled="deleting">Yes</button>
            <button @click="cancelDelete" :disabled="deleting">No</button>
          </span>
        </div>
      </li>
    </ul>

    <!-- Add Team Modal -->
    <div v-if="addOpen" class="modal" @click.self="closeAddModal">
      <div class="modal-content">
        <h3>Add Team</h3>
        <form @submit.prevent="handleAddSubmit">
          <div v-for="field in TEAM_FIELDS" :key="field.name" class="form-group">
            <label :for="field.name">{{ field.label }}</label>
            <input
              :id="field.name"
              v-model="addForm[field.name]"
              :type="field.name === 'year_founded' || field.name === 'titles' ? 'number' : 'text'"
              :required="field.required"
            />
          </div>
          <div v-if="addError" class="error">{{ addError }}</div>
          <div class="modal-actions">
            <button type="button" @click="closeAddModal">Cancel</button>
            <button type="submit" :disabled="addSubmitting">{{ addSubmitting ? 'Adding...' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Team Modal -->
    <div v-if="editOpen" class="modal" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>Edit Team</h3>
        <form @submit.prevent="handleEditSubmit">
          <div v-for="field in TEAM_FIELDS" :key="field.name" class="form-group">
            <label :for="'edit-' + field.name">{{ field.label }}</label>
            <input
              :id="'edit-' + field.name"
              v-model="editForm[field.name]"
              :type="field.name === 'year_founded' || field.name === 'titles' ? 'number' : 'text'"
              :required="field.required"
            />
          </div>
          <div v-if="editError" class="error">{{ editError }}</div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal">Cancel</button>
            <button type="submit" :disabled="editSubmitting">{{ editSubmitting ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const TEAM_FIELDS = [
  { name: 'team_name', label: 'Team Name', required: true },
  { name: 'titles', label: 'Titles', required: true },
  { name: 'mascot', label: 'Mascot', required: true },
  { name: 'location', label: 'Location', required: true },
  { name: 'venue', label: 'Venue', required: true },
  { name: 'general_mgr', label: 'General Manager', required: true },
  { name: 'head_coach', label: 'Head Coach', required: true },
  { name: 'division', label: 'Division', required: true },
  { name: 'conference', label: 'Conference', required: true },
  { name: 'ownership', label: 'Ownership', required: true },
  { name: 'year_founded', label: 'Year Founded', required: false },
]

const teams = ref([])
const addOpen = ref(false)
const addForm = reactive(TEAM_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}))
const addSubmitting = ref(false)
const addError = ref('')

const editOpen = ref(false)
const editForm = reactive(TEAM_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}))
const editId = ref(null)
const editSubmitting = ref(false)
const editError = ref('')

const confirmingId = ref(null)
const deleting = ref(false)

async function loadTeams() {
  try {
    const res = await axios.get('/teams')
    teams.value = res.data || []
  } catch (e) {
    // handle error
  }
}

onMounted(loadTeams)

function openAddModal() {
  TEAM_FIELDS.forEach(field => addForm[field.name] = '')
  addError.value = ''
  addOpen.value = true
}
function closeAddModal() { addOpen.value = false }

async function handleAddSubmit() {
  addSubmitting.value = true
  addError.value = ''
  for (const field of TEAM_FIELDS) {
    if (field.required && !String(addForm[field.name]).trim()) {
      addError.value = `"${field.label}" is required.`
      addSubmitting.value = false
      return
    }
  }
  try {
    const payload = { ...addForm }
    payload.titles = payload.titles ? Number(payload.titles) : 0
    payload.year_founded = payload.year_founded ? Number(payload.year_founded) : 0
    await axios.post('/teams', payload)
    addOpen.value = false
    await loadTeams()
  } catch (err) {
    addError.value = err?.response?.data?.message || err?.message || 'Failed to add team.'
  } finally {
    addSubmitting.value = false
  }
}

function openEditModal(team) {
  TEAM_FIELDS.forEach(field => editForm[field.name] = team[field.name] || '')
  editId.value = team.team_id
  editError.value = ''
  editOpen.value = true
}
function closeEditModal() { editOpen.value = false }

async function handleEditSubmit() {
  editSubmitting.value = true
  editError.value = ''
  for (const field of TEAM_FIELDS) {
    if (field.required && !String(editForm[field.name]).trim()) {
      editError.value = `"${field.label}" is required.`
      editSubmitting.value = false
      return
    }
  }
  try {
    const payload = { ...editForm }
    payload.titles = payload.titles ? Number(payload.titles) : 0
    payload.year_founded = payload.year_founded ? Number(payload.year_founded) : 0
    await axios.put(`/teams/${editId.value}`, payload)
    editOpen.value = false
    await loadTeams()
  } catch (err) {
    editError.value = err?.response?.data?.message || err?.message || 'Failed to update team.'
  } finally {
    editSubmitting.value = false
  }
}

function startConfirmDelete(id) { confirmingId.value = id }
function cancelDelete() { confirmingId.value = null }
async function confirmDelete(id) {
  deleting.value = true
  try {
    await axios.delete(`/teams/${id}`)
    await loadTeams()
  } catch (e) {
    // handle error
  } finally {
    deleting.value = false
    confirmingId.value = null
  }
}
</script>

<style scoped>
.panelContent {
  max-width: 600px;
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
  margin-bottom: 1em;
}
.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.team-item {
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
.confirm-delete button {
  margin-left: 0.25em;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2em 0;
}
.modal-content {
  background: #fff;
  padding: 2em;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}
.form-group {
  margin-bottom: 1em;
}
.form-group label {
  display: block;
  margin-bottom: 0.25em;
}
.form-group input {
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