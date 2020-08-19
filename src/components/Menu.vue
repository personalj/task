<template>
    <section class="main__control control container">
        <h1 class="control__title"  @click="updateTask">TASKMANAGER</h1>
        <section class="control__btn-wrap">
          <input
            type="radio"
            name="control"
            id="control__new-task"
            class="control__input visually-hidden"
            @click="showAddTask"
          />
          <label for="control__new-task" class="control__label control__label--new-task"
           @click="home"
            >+ ADD NEW TASK</label
          >
          <input
            type="radio"
            name="control"
            id="control__task"
            class="control__input visually-hidden"
            checked
            @click="home"
          />
          <label for="control__task" class="control__label">TASKS</label>
          <input
            type="radio"
            name="control"
            id="control__statistic"
            class="control__input visually-hidden"
            @click="statistic"
          />
          <label for="control__statistic" class="control__label"
            >STATISTICS</label
          >
        </section>
    </section>
</template>
<script>
import ClickOutside from 'vue-click-outside'
    export default {
        name: 'Menu',
        data: () => ({
          checked: false
        }),
        props: {
          isShow: {
            type: Boolean,
            require: true
          }
        },
        methods: {
          updateTask() {
            this.$router.push('/').catch(()=>{})
            this.$emit('updateTask')
          },
          home() {
            this.$router.push('/').catch(()=>{})
          },
          statistic() {
            this.$router.push('/statistics').catch(()=>{})
          },
          showAddTask() {
            this.$emit('showAddTask')
          },
          closeAddForm() {
            this.isShow = false
          }
        }
    }
</script>
<style scoped>
  .control__title, .control__label--new-task {
    cursor: pointer;
  }
</style>