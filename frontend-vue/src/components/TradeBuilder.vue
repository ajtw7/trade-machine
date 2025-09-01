<template>
  <div class="trade-builder-card">
    <h2>Trade Builder</h2>
    <form @submit.prevent="handleSubmit">
      <div class="trade-builder-stack">
        <!-- Team 1 -->
        <div class="trade-side">
          <label>Team 1</label>
          <select v-model="tradeData.team1_id" @change="onTeamChange('team1_id')">
            <option value="" disabled>Select Team</option>
            <option
              v-for="team in teams"
              :key="team.team_id"
              :value="team.team_id"
              :disabled="String(team.team_id) === tradeData.team2_id"
            >
              {{ getTeamName(team.team_id) }}
            </option>
          </select>
          <label>Player from Team 1</label>
          <select v-model="tradeData.player1_id" :disabled="!tradeData.team1_id">
            <option value="" disabled>Select Player</option>
            <option
              v-for="player in getPlayersForTeam(tradeData.team1_id)"
              :key="player.player_id"
              :value="player.player_id"
            >
              {{ getPlayerName(player.player_id) }}
            </option>
          </select>
          <div v-if="tradeData.team1_id && tradeData.player1_id" class="trade-summary">
            <strong>{{ getTeamName(tradeData.team1_id) }}</strong>
            <div>
              Trading: {{ getPlayerName(tradeData.player1_id) }}
            </div>
          </div>
        </div>

        <!-- Swap Icon -->
        <div class="trade-swap">
          <span style="font-size: 2em;">⇄</span>
        </div>

        <!-- Team 2 -->
        <div class="trade-side">
          <label>Team 2</label>
          <select v-model="tradeData.team2_id" @change="onTeamChange('team2_id')">
            <option value="" disabled>Select Team</option>
            <option
              v-for="team in teams"
              :key="team.team_id"
              :value="team.team_id"
              :disabled="String(team.team_id) === tradeData.team1_id"
            >
              {{ getTeamName(team.team_id) }}
            </option>
          </select>
          <label>Player from Team 2</label>
          <select v-model="tradeData.player2_id" :disabled="!tradeData.team2_id">
            <option value="" disabled>Select Player</option>
            <option
              v-for="player in getPlayersForTeam(tradeData.team2_id)"
              :key="player.player_id"
              :value="player.player_id"
            >
              {{ getPlayerName(player.player_id) }}
            </option>
          </select>
          <div v-if="tradeData.team2_id && tradeData.player2_id" class="trade-summary">
            <strong>{{ getTeamName(tradeData.team2_id) }}</strong>
            <div>
              Trading: {{ getPlayerName(tradeData.player2_id) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>

      <div class="trade-submit">
        <button
          type="submit"
          :disabled="submitting || !canSubmit"
        >
          {{ submitting ? 'Submitting...' : 'Submit Trade' }}
        </button>
      </div>
      <div v-if="teams.length === 0" class="no-teams">
        No teams available. Please add teams first to create trades.
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const teams = ref([])
const players = ref([])
const submitting = ref(false)
const error = ref('')
const success = ref('')

const tradeData = ref({
  team1_id: '',
  team2_id: '',
  player1_id: '',
  player2_id: '',
})

const canSubmit = computed(() =>
  tradeData.value.team1_id &&
  tradeData.value.team2_id &&
  tradeData.value.player1_id &&
  tradeData.value.player2_id &&
  tradeData.value.team1_id !== tradeData.value.team2_id
)

function getPlayersForTeam(teamId) {
  if (!teamId) return []
  return players.value.filter(p => String(p.team_id) === String(teamId))
}

function getTeamName(teamId) {
  const team = teams.value.find(t => String(t.team_id) === String(teamId))
  return team
    ? `${team.city || ''} ${team.name || team.team_name || ''}`.trim()
    : ''
}

function getPlayerName(playerId) {
  const player = players.value.find(p => String(p.player_id) === String(playerId))
  return player
    ? `${player.name || (player.first_name + ' ' + player.last_name)} (${player.position})`
    : ''
}

function onTeamChange(field) {
  if (field === 'team1_id') tradeData.value.player1_id = ''
  if (field === 'team2_id') tradeData.value.player2_id = ''
}

async function handleSubmit() {
  error.value = ''
  success.value = ''
  if (!tradeData.value.team1_id || !tradeData.value.team2_id) {
    error.value = 'Please select both teams'
    return
  }
  if (tradeData.value.team1_id === tradeData.value.team2_id) {
    error.value = 'Please select two different teams'
    return
  }
  if (!tradeData.value.player1_id || !tradeData.value.player2_id) {
    error.value = 'Please select one player from each team'
    return
  }
  submitting.value = true
  try {
    const payload = {
      date: new Date().toISOString().slice(0, 10),
      status: "completed",
      notes: "",
      items: [
        {
          from_team_id: Number(tradeData.value.team1_id),
          to_team_id: Number(tradeData.value.team2_id),
          player_id: Number(tradeData.value.player1_id),
          salary: Number(
            players.value.find(
              (p) => String(p.player_id) === String(tradeData.value.player1_id)
            )?.salary ?? 0
          ),
        },
        {
          from_team_id: Number(tradeData.value.team2_id),
          to_team_id: Number(tradeData.value.team1_id),
          player_id: Number(tradeData.value.player2_id),
          salary: Number(
            players.value.find(
              (p) => String(p.player_id) === String(tradeData.value.player2_id)
            )?.salary ?? 0
          ),
        },
      ],
    }
    await axios.post('/trades', payload)
    success.value = 'Trade submitted successfully!'
    tradeData.value = {
      team1_id: '',
      team2_id: '',
      player1_id: '',
      player2_id: '',
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to submit trade'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const [teamsRes, playersRes] = await Promise.all([
    axios.get('/teams'),
    axios.get('/players'),
  ])
  teams.value = teamsRes.data || []
  players.value = playersRes.data || []
})
</script>

<style scoped>
.trade-builder-card {
  max-width: 900px;
  margin: 2em auto;
  padding: 2em;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.trade-builder-stack {
  display: flex;
  flex-direction: row;
  gap: 2em;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 2em;
}
.trade-side {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.trade-summary {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 1em;
  margin-top: 1em;
}
.trade-swap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}
.trade-submit {
  display: flex;
  justify-content: center;
  margin-top: 1.5em;
}
.error-message {
  color: #c00;
  text-align: center;
  margin-bottom: 1em;
}
.success-message {
  color: #2e7d32;
  text-align: center;
  margin-bottom: 1em;
}
.no-teams {
  color: #888;
  text-align: center;
  margin-top: 2em;
}
select, button {
  font-size: 1em;
  padding: 0.5em;
  border-radius: 4px;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>