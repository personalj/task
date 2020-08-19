<template>
    <main class="main__container">
      <Menu   
        :tasks='tasks' 
        @updateTask='updateTask'
        @showAddTask='showAddTask'
      />
      <Loader v-if='loading' />
      <Filters 
        :tasks='tasks'
        @allTasksTitle='allTasksTitle'
        @favoritesTasksTitle='favoritesTasksTitle'
        @overdueTasksTitle='overdueTasksTitle'
        @todayTasksTitle='todayTasksTitle'
        @repeatingTasksTitle='repeatingTasksTitle'
        @archiveTasksTitle='archiveTasksTitle'
        @closeAddCard='closeAddCard'
        :allTasksAmount='allTasksAmount'
        :overdueAmount='overdueAmount'
        :todayAmount='todayAmount'
        :favoritesAmount='favoritesAmount'
        :repeatingAmount='repeatingAmount'
        :archiveAmount='archiveAmount'
        v-else='!loading'
      />
      <component :is='layout' v-if='!loading'>
         <p class='center' v-if='!tasks.length'>Add your task</p>
          <router-view 
            :isShow='isShow'
            @closeCard='closeCard'
            @taskCreated='taskCreated'
            :tasks='tasks'
            @addNewTask='addNewTask'
            @updateTask='updateTask'
            @sortUp='sortUp'
            @sortDown='sortDown'
        />
      </component>
    </main>
</template>
<script>
import Loader from '@/components/Loader'
import Menu from '@/components/Menu'
import Filters from '@/components/Filters'
import Home from '@/views/Home'
import Statistics from '@/views/Statistics'
  export default {
    name: 'Main',
    data: () => ({
      isShow: false,
      tasks: [],
      tasksDefault: [],
      loading: true,
      allTasksAmount: 0,
      overdueAmount: 0,
      todayAmount: 0,
      favoritesAmount: 0,
      repeatingAmount: 0,
      archiveAmount: 0,
      search: ''
    }),
    methods: {
      allTasksTitle() {
        this.tasks = this.tasksDefault.filter((task) => task.is_archived === false)
        this.allTasksAmount = this.tasks.length
        this.$router.push('/').catch(()=>{})
      },
      overdueTasksTitle() {
        const todaysDate = new Date().toJSON()
          this.tasks = this.tasksDefault.filter(task => {
            if(task.due_date !== '') {
             return task.due_date < todaysDate
            }
        })
        this.overdueAmount = this.tasks.length
        this.$router.push('/').catch(()=>{})
      },
      todayTasksTitle() {
        let today = new Date()
        const day = today.getDay()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        today = mm + '/' + dd + '/' + yyyy
        let arr = []
        this.tasksDefault.map(task => {
          const n = Object.keys(task.repeating_days)
          const days = Object.values(task.repeating_days)
          let su = days[3]
          let fr = days[0]
          let sa = days[2]
          let th = days[4]
          let tu = days[5]
          let we = days[6]
          days[0] = su
          days[2] = tu
          days[3] = we
          days[4] = th
          days[5] = fr
          days[6] = sa
          if(days[day] === true) {
            arr.push(task)
          }
        })
        let n = []
        this.tasks = this.tasksDefault.map(task => {
          let fetchDate = new Date(task.due_date)
          const ddd = String(fetchDate.getDate()).padStart(2, '0')
          const mmm = String(fetchDate.getMonth() + 1).padStart(2, '0')
          const yyyyy = fetchDate.getFullYear()
          fetchDate = mmm + '/' + ddd + '/' + yyyyy
          if(fetchDate === today) {
            n.push(task)
          }
        })
        this.tasks = n.concat(arr)
        this.todayAmount = n.length + arr.length
        this.$router.push('/').catch(()=>{})
      },
      favoritesTasksTitle() {
        this.tasks = this.tasksDefault.filter((task) => task.is_favorite === true)
        this.favoritesAmount = this.tasks.length
        this.$router.push('/').catch(()=>{})
      },
      repeatingTasksTitle() {
        this.tasks = this.tasksDefault.filter((task) => task.repeated === true)
        this.repeatingAmount = this.tasks.length
        this.$router.push('/').catch(()=>{})
      },
      archiveTasksTitle() {
        this.tasks = this.tasksDefault.filter((task) => task.is_archived === true)
        this.archiveAmount = this.tasks.length
        this.$router.push('/').catch(()=>{})
      },
      showAddTask(isShow) {
        this.isShow = !this.isShow
      },
      closeAddCard() {
        this.isShow = false
      },
      closeCard() {
        this.isShow = false
      },
      taskCreated() {
        this.isShow = false
      },
      addNewTask(task) {
        this.$emit('addNewTask', task)
      },
      update() {
        this.$emit('updateTask')
      },
      updateTask() {
        this.$emit('updateTask')
      },
      sortUp() {
         this.tasks = this.tasks.sort((a,b) => {
            const c = new Date(a.due_date);
            const d = new Date(b.due_date);
            if(a.due_date === '') {
              return 1;
            }else if(b.due_date === '') {
              return -1
            }
              return c-d;
          })
          return this.tasks
      },
      sortDown() {
         this.tasks = this.tasks.sort((a,b) => {
            const c = new Date(a.due_date);
            const d = new Date(b.due_date);
            if(a.due_date === '') {
              return 1;
            }else if(b.due_date === '') {
              return -1
            }
              return d-c;
          })
          return this.tasks
      }
    },
    computed: {
      layout() {
        return (this.$route.meta.layout ) 
      },
        error() {
        return this.$store.getters.error
      }
    },
    watch : {
      error(fbError) {
      }
    },
    components: {
      Home, Statistics, Menu, Filters, Loader
    },
    async mounted() {
        const tasks = await this.$store.dispatch('fetchTasks')
        this.tasks = tasks
        this.tasksDefault = tasks
        this.loading = false
        const todaysDate = new Date().toJSON()
        this.tasks.map(task => {
        if(task.due_date !== '') {
           if(task.due_date < todaysDate) {
            task.isExpired = true
          }else {
            task.isExpired = false
          }
            }
        })
        this.overdueTasksTitle()
        this.todayTasksTitle()
        this.favoritesTasksTitle()
        this.repeatingTasksTitle()
        this.archiveTasksTitle()
        this.allTasksTitle()
    }
  }
</script>
<style scoped>
.center {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    width: 100%;
  }
</style>