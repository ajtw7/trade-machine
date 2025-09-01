<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div class="tabs">
      <button
        v-for="(tab, idx) in tabs"
        :key="tab"
        :class="{ active: currentTab === idx }"
        @click="currentTab = idx"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <TeamsList v-if="currentTab === 0" />
      <PlayersList v-if="currentTab === 1" />
      <TradeBuilder v-if="currentTab === 2" />
    </div>
  </div>
</template>

<script>
import TeamsList from './components/TeamsList.vue'
import PlayersList from './components/PlayersList.vue'
import TradeBuilder from './components/TradeBuilder.vue'

export default {
  name: 'App',
  components: {
    TeamsList,
    PlayersList,
    TradeBuilder
  },
  data() {
    return {
      tabs: ['Teams', 'Players', 'Trade Builder'],
      currentTab: 0
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.tabs button {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}
.tabs button.active {
  border-bottom: 2px solid #42b983;
  font-weight: bold;
  color: #42b983;
}
.tab-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}
</style>
