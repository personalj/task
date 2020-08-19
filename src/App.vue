<template>
  <div id="app">
    <main class="main">
      <Main 
        @addNewTask='addNewTask'
        @updateTask='updateTask'
        :key='componentKey'/>
    </main>
  </div>
</template>
<script>
import Main from '@/views/Main'
  export default {
    name: 'App',
    data: () => ({
      componentKey: 0,
    }),
    methods: {
      addNewTask(task) {
        this.$emit('addNewTask', task)
        this.componentKey += 1;
      },
      updateTask() {
        this.componentKey += 1;
      }
    },
    components: {
      Main
    }
  }
</script>
<style lang="scss">
@import '@/assets/css/style';
@import '@/assets/css/normalize';
</style>
