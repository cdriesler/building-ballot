<template>
  <div id="app">
    <div class="header">
      <img width="250px" src="./assets/logo.jpg" />
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
    <div class="footer">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HelloWorld
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.header {
  width: 100%;
  text-align: left;
}

.header img {
  margin-left: 40px;
}

.body {
  width: 100%;
  flex-grow: 1;
}

.footer {
  width: 100%;
  height: 50px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}
</style>
