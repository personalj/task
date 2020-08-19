<template>
    <section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
            <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>
            <div class="statistic-input-wrap">
               <input
                  v-model='date'                                                        
                  class="statistic__period-input" 
                  :placeholder='date'           
                  name="date"
                  readonly>
                </input>
            </div>
            <p class="statistic__period-result">
              In total for the specified period
              <span class="statistic__task-found">{{taskArchived}}</span> tasks were fulfilled.
            </p>
          </div>
        <div class="statistic__colors-wrap">
          <canvas ref='canvas' class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>

        <div class="statistic__circle">
      </div>
    
    </section>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Pie } from 'vue-chartjs'
  export default {
    name: 'Statisctics',
    extends: Pie,
    data: () => ({
      date: '',
      tasks: [],
      black: [],
      yellow: [],
      blue: [],
      green: [],
      pink: [],
      red: [],
      arr: [],
      archived: [],
      taskArchived: 0
    }),
    methods: {
      checkColor() {
        const days = 7
        let today = new Date()
        let todayDates = new Date().toJSON()
        let weekBeforeDates = today.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000))
        let oneWeekBefore = new Date(weekBeforeDates).toJSON()
        this.tasks.map(task => {
           if(task.is_archived === true) {
              if(oneWeekBefore <= task.is_completed && task.is_completed <= todayDates) {
                if(task.color === 'black') {
                    if(task.due_date !== '' &&  task.due_date < task.is_completed) {
                      this.red.push(task)
                    }else {
                      this.black.push(task)
                    }
                }else if(task.color === 'yellow') {
                    if(task.due_date !== '' &&  task.due_date < task.is_completed) {
                       this.red.push(task)
                    }else {
                      this.yellow.push(task)
                    }
                }else if(task.color === 'blue') {
                   if(task.due_date !== '' &&  task.due_date < task.is_completed) {
                      this.red.push(task)
                    }else {
                      this.blue.push(task)
                    }
                }if(task.color === 'green') {
                    if(task.due_date !== '' &&  task.due_date < task.is_completed) {
                      this.red.push(task)
                    }else {
                      this.green.push(task)
                    }
                }if(task.color === 'pink') {
                    if(task.due_date !== '' &&  task.due_date < task.is_completed) {
                      this.red.push(task)
                    }else {
                      this.pink.push(task)
                   }
                }
              }
           }
        })
      this.arr = new Array(this.black.length, this.yellow.length, this.blue.length, this.green.length, this.pink.length, this.red.length)
      },
      setDate() {
        const days = 7;
        let date = new Date()
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        month = ("0" + month).slice(-2);
        let day = date.getDate()
        day = ("0" + day).slice(-2);
        const todaysDate = `${year}-${month}-${day}`
        let weekBefore = date.setTime(date.getTime() - (days * 24 * 60 * 60 * 1000))
        weekBefore = new Date(weekBefore)
        const yearWeekBefore = weekBefore.getFullYear()
        let monthWeekBefore = weekBefore.getMonth() + 1
        monthWeekBefore = ("0" + monthWeekBefore).slice(-2);
        let dayWeekBefore = weekBefore.getDate()
        dayWeekBefore = ("0" + dayWeekBefore).slice(-2);
        const weekBeforesDate = `${yearWeekBefore}-${monthWeekBefore}-${dayWeekBefore}`
        return this.date = `${weekBeforesDate}--${todaysDate} `
      },
      archivedTasks() {
        const days = 7
        let today = new Date()
        let todayDates = new Date().toJSON()
        let weekBeforeDates = today.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000))
        let oneWeekBefore = new Date(weekBeforeDates).toJSON()
        this.tasks.map(task => {
        if(task.is_archived === true) {
          if(oneWeekBefore <= task.is_completed && task.is_completed <= todayDates) {
             this.archived.push(task)
            }
          }
        })
        return this.taskArchived = this.archived.length
      }
    },
    components: {
      flatPickr
    },
    async mounted() {
        const tasks = await this.$store.dispatch('fetchTasks')
        this.tasks = tasks
        this.checkColor()
        this.renderChart({
        labels: ['Black', 'Yellow', 'Blue', 'Green', 'Pink', 'Red'],
        datasets: [{
            label: '# of Votes',
            data:  this.arr,
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)'
                
            ],
            borderColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
      }),
      this.setDate()
      this.archivedTasks()
    }
  }
</script>