<template>
    <div>
        <h2>Teams</h2>
        <ul v-if="teams.length">
            <li v-for="team in teams" :key="team.team_id">
                <strong>{{ team.team_name }}</strong>
                <span> — Salary Cap Remaining: ${{ team.salary_cap_remaining.toLocaleString() }}</span>
            </li>
        </ul>
        <div v-else>
            No teams found.
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "TeamsList",
    data() {
        return {
            teams: [],
        };
    },
    mounted() {
        axios.get('/teams')
            .then(res => {
                this.teams = res.data;
            })
            .catch(() => {
                this.teams = [];
            });
    },
};
</script>