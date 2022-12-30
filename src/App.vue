<template>
  <div id="app">
    <process-info />
  </div>
</template>

<script>
import ProcessInfo from './process';

export default {
  name: "App",
  components: {
    ProcessInfo
  },
  data() {
    return {
      
    };
  },
};
</script>

<style>
html, body, #app {
  height: 100%;
  font-size: 14px;
}

.f-csp {
  cursor: pointer;
}

.v-flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
