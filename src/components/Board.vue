<template>
    <section class="board container" >
        <div class="board__filter-list" v-if='tasks.length'>
          <a href="#" class="board__filter" @click.prevent='sortDefault'>SORT BY DEFAULT</a>
          <a href="#" class="board__filter" @click.prevent='sortUp'>SORT BY DATE up</a>
          <a href="#" class="board__filter" @click.prevent='sortDown'>SORT BY DATE down</a>
        </div>
        <div class="board__tasks">
            <AddTask 
                :isShow='isShow'
                @created="addNewTask"
                @closeCard='closeCard'
                @taskCreated='taskCreated'
            />
            <Task
                :tasks='tasks'
                @addNewTask='addNewTask'
                @updateTask='updateTask'
            />
        </div>
    </section>
</template>
<script>
import AddTask from '@/components/AddTask'
import Task from '@/components/Task'
    export default {
        name:'Board',
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
        components: {
            AddTask, Task
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
            },
            sortDefault() {
                this.$emit('updateTask')
            }
        }
    }
</script>
<style scoped>
    .board__filter.active {
        font-weight: 500;
    }
</style>