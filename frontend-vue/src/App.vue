<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <TeamsList />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import TeamsList from './components/TeamsList.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    TeamsList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
