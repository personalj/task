<template>
    <Board 
      :isShow='isShow' 
      @closeCard='closeCard' 
      @taskCreated='taskCreated'
      @addNewTask='addNewTask'
      @updateTask='updateTask'
      @sortUp='sortUp'
      @sortDown='sortDown'
      :tasks='tasks'
    
    />
</template>
<script>
import Board from '@/components/Board'
export default {
  name: 'Home',
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    closeCard() {
      this.$emit('closeCard')
    },
    taskCreated() {
      this.$emit('taskCreated')
    },
     addNewTask(task) {
      this.$emit('addNewTask', task)
    },
    updateTask() {
        this.$emit('updateTask')
    },
    sortUp() {
      this.$emit('sortUp')
    },
    sortDown() {
      this.$emit('sortDown')
    }
  },
  components: {
   Board
  }
}
</script>
