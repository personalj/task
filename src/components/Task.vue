<template>
    <div class="tasks__list" >
      <article class="card card--edit" v-if="task <= tasks.length" :class="[{'card--repeat' : tasks[task-1].repeated}, {'is--edit' : tasks[task-1].isEdit}, {'expired' : tasks[task-1].isExpired}, tasks[task-1].color]" v-for='(task, index) in tasksToShow' :key='task.index'>
        <form class="card__form" method="get" @submit.prevent="submitHandler(tasks[task-1].id)">
            <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave">
                        <Wave/>
                    </use>
                  </svg>
                </div>
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit" @click='editItem(tasks[task-1].id)'>
                    edit
                  </button>
                  <button type="button" class="card__btn card__btn--archive" :class="{'active': tasks[task-1].is_archived }" @click='archiveFn(tasks[task-1].id)'>
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites"
                    :class="[{'active':tasks[task-1].is_favorite}, {'disabled': !tasks[task-1].is_favorite}]"
                    @click='favoritesFn(tasks[task-1].id)'
                  >
                    favorites
                  </button>
                </div>
                <div class='card--descr' v-if='!tasks[task-1].isEdit'>
                    {{tasks[task-1].description}}
                </div>
                <div class="card__textarea-wrap" v-if='tasks[task-1].isEdit'>
                  <label >
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                      v-model="description"
                      :class="{'invalid': ($v.description.$dirty && !$v.description.required) || ($v.description.$dirty && !$v.description.minLength) || ($v.description.$dirty && !$v.description.maxLength), 'read-only': !isEdit}"
                    >{{description}}</textarea>
                  </label>
                  <small class="error" v-if="$v.description.$dirty && !$v.description.required">Add some description</small>
                  <small class="error" v-else-if="($v.description.$dirty && !$v.description.minLength) || ($v.description.$dirty && !$v.description.maxLength)">Description should be min {{$v.description.$params.minLength.min}} and max {{$v.description.$params.maxLength.max}}.Now it's {{description.length}}</small>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates-item" v-if="!tasks[task-1].isEdit">
                      <div class="date" :class="{'error': tasks[task-1].isExpired}">{{tasks[task-1].due_date | dateTime}}</div>         
                    </div>
                    <div class="card__dates" v-if="tasks[task-1].isEdit">
                      <button class="card__date-deadline-toggle" type="button"
                        @click='isDataShown(tasks[task-1].id)'
                      >
                        date: <span class="card__date-status">{{isDateShow ? 'yes' : 'no' }}</span>
                      </button>

                      <fieldset class="card__date-deadline" v-if='isDateShow'>
                        <div class="card__input-deadline-wrap" >
                           <flat-pickr
                                v-model="date"
                                :config="config"                                                          
                                class="card__date" 
                                placeholder="23 September"               
                                name="date">
                            </flat-pickr>
                        </div>
                      </fieldset>
                      <button class="card__repeat-toggle" type="button" @click="showDays(tasks[task-1].id)" >
                        repeat:<span class="card__repeat-status">{{isRepeating ? 'yes' : 'no' }}</span>
                      </button>
                      <fieldset class="card__repeat-days" v-if="isRepeating">
                        <div class="card__repeat-days-inner">
                            <div class="card__repeat-days-inner-item" v-for='(day, index) in days' :key="day.index">
                              <label class="card__repeat-day" 
                                      :class="{'active' : day.checked}">{{day.value}}
                                  <input
                                    class="visually-hidden card__repeat-day-input"
                                    type="checkbox"
                                    name="repeat"
                                    :value='day.value'
                                    :checked='day.checked'
                                    @click='day.checked = !day.checked'
                                />
                              </label>
                            </div>
                        </div>
                      </fieldset>
                    </div>
                    </div>
                  </div>
                  <div class="hashtag__list" v-if="!tasks[task-1].isEdit">
                    <div class="hashtag__list-item" v-for='(tag, index) in tasks[task-1].tags' :key='tag.index'>
                       #{{tag}}
                    </div>
                  </div>
                  <div class="card__hashtag" v-if="tasks[task-1].isEdit">
                      <div class="card__hashtag-list" v-if='tags.length'>
                        <span class="card__hashtag-inner" v-for='(tag, index) in tags' :key='tag.index'>
                          <input type="hidden" name="hashtag" value="repeat" class="card__hashtag-hidden-input">
                          <p class="card__hashtag-name">
                            #{{tag}}
                          </p>
                          <button type="button" class="card__hashtag-delete" @click='removeTag(index)'>
                            delete
                          </button>
                        </span>
                      </div>
                    <label>
                        <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here" 
                          v-model='tag' 
                          @keyup='addHashTag($event,tasks[task-1].id)'
                          :class="{'invalid': ($v.tag.$dirty && !$v.tag.minLength) || ($v.tag.$dirty && !$v.tag.maxLength)}"
                      >
                      <small class="error" v-if='($v.tag.$dirty && !$v.tag.minLength) || ($v.tag.$dirty && !$v.tag.maxLength)'>Hashtag should be min {{$v.tag.$params.minLength.min}} and max {{$v.tag.$params.maxLength.max}}.Now it's {{tag.length}}</small>
                      <small class="error" v-else-if='tags.length >= tagsAmount'>You can add only {{tagsAmount}} tags </small>
                    </label>
                  </div>
                  <div class="card__colors-inner" v-if="tasks[task-1].isEdit">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                         <div class="card__colors-item" v-for="(color, index) in colors" :key="color.index">
                            <div :class="{'active': color.checked}">
                              <label 
                                :class="color.classLabel" 
                                >{{color.value}}
                                <input
                                  v-model='tasks[task-1].color'
                                  type="radio"
                                  :class='color.classInput'
                                  name="color"
                                  :value='color.value'
                                  :checked='color.checked'
                                   @click='colorCheck($event)'
                                 />
                              </label>
                            </div> 
                          </div>
                    </div>
                  </div>
                <div class="card__status-btns" v-if="tasks[task-1].isEdit">
                  <button class="card__save" type="submit">save</button>
                  <button class="card__delete" type="button" @click="closeCardEdit(index, tasks[task-1].id)">delete</button>
                </div>
            </div>
        </form>
      </article>
      <button class="load-more" type="button" v-if="tasksToShow < tasks.length || tasks.length > tasksToShow" @click="tasksToShow += 8">load more</button>
    </div>
   <!-- built files will be auto injected -->
</template>
<script>
import {required, minLength, maxLength} from 'vuelidate/lib/validators'
import flatPickr from 'vue-flatpickr-component';  
import 'flatpickr/dist/flatpickr.css';
import Wave from '@/components/Wave.component'
export default {
  name: 'Task',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    tasksToShow: 8,
    totalTasks: 0,
    date: new Date(),
    isDateShow: false,
    isRepeating: false,
    isFavorite: false,
    isArchieved: false,
    isExpired: false,
    repeated: false,
    description: '',
    checked: false,
    isEdit: false,
    completed: new Date(),
    taskRepeatingDaysTemp: [],
    days: [
      {value: 'mo', checked: false},
      {value: 'tu', checked: false},
      {value: 'we', checked: false},
      {value: 'th', checked: false},
      {value: 'fr', checked: false},
      {value: 'sa', checked: false},
      {value: 'su', checked: false}
    ],
    colors: [
      {classInput: 'card__color-input card__color-input--black visually-hidden', value: 'black', classLabel: 'card__color card__color--black', checked: false},
      {classInput: 'card__color-input card__color-input--yellow visually-hidden', value: 'yellow', classLabel: 'card__color card__color--yellow', checked: false},
      {classInput: 'card__color-input card__color-input--blue visually-hidden', value: 'blue', classLabel: 'card__color card__color--blue', checked: false},
      {classInput: 'card__color-input card__color-input--green visually-hidden', value: 'green', classLabel: 'card__color card__color--green', checked: false},
      {classInput: 'card__color-input card__color-input--pink visually-hidden', value: 'pink', classLabel: 'card__color card__color--pink', checked: false},
    ],
    tagsCancel: [],
    colorCancel: 'black',
    daysCancel: {},
    dateCancel: '',
    repeatedCancel: false,
    taskId: null,
    tags: [],
    tag: '',
    tagsAmount: 5,
    color: 'black',
    config: {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    }
  }),
    components: {
      flatPickr, Wave
    },
    methods: {
      async editItem(id){
        this.tasks.map(task => {
          if(task.id === id) {
            this.description = task.description
            task.isEdit = !task.isEdit
            if(task.due_date !== '') {
              this.isDateShow = true
              this.date=task.due_date
            }else {
              this.isDateShow = false
              this.date = ''
            }
            this.color= task.color
            this.colors.map(color => {
              color.checked = false
              if(color.value === this.color) {
                color.checked = true
              }else {
                color.checked = false
              }
            })
            const repeatingDays = Object.values(task.repeating_days)
            repeatingDays.some(task => {
              if(task === false) {
                this.isRepeating = false
              }else {
                this.isRepeating = true
              }
            })
            if(!task.isEdit) {
                task.due_date = this.dateCancel
                task.repeated = this.repeatedCancel
                if(task.tags.length) {
                  task.tags = this.tagsCancel
                }
                task.color = this.colorCancel
                if(task.repeating_days.length) {
                  task.repeating_days = this.daysCancel
                }
            }
            
            if(task.repeated) {
              this.isRepeating = true
              const values = Object.values(task.repeating_days)
              this.days.map(day => {
                if(day.value === 'fr') {
                  day.checked = values[0]
                }else if(day.value === 'mo') {
                  day.checked = values[1]
                }else if(day.value === 'sa') {
                  day.checked = values[2]
                }else if(day.value === 'su') {
                  day.checked = values[3]
                }else if(day.value === 'th') {
                  day.checked = values[4]
                }else if(day.value === 'tu') {
                  day.checked = values[5]
                }else if(day.value === 'we') {
                  day.checked = values[6]
                }
              })
            }
            try {
              const tasksCancel = this.$store.dispatch('fetchTaskById', id)
              tasksCancel.then(data => {
                const tags = data.task.tags
                const color = data.task.color
                const date = data.task.due_date
                this.tagsCancel = tags
                this.colorCancel = color
                this.dateCancel = date
                this.repeatedCancel = data.task.repeated
              })
            }catch(e){}
            
            this.tags = task.tags
          }else {
             task.isEdit = false
          }
        })
      },
      async submitHandler(id) {
        if(this.$v.description.$invalid) {
          this.$v.description.$touch()
          return
        }
        const daysValue = this.days.map(day => {
          return day.value
        })
        const daysChecked = this.days.map(day => {
          return day.checked
        })
        const days = Object.assign(...daysValue.map((k, i) => ({[k]: daysChecked[i]})))
        this.tasks.map(task => {
          if(task.id === id) {
            if(this.isDateShow ) {
              if(this.date === null || this.date === undefined ||  this.date === '') {
                this.date = ''
                this.isDateShow = false 
              }else {
                 this.date = new Date(this.date).toJSON()
              }
          }
           if(task.repeated) {
              daysChecked.some(task => {
                if(task === false) {
                  this.isRepeating = false
                }else {
                  this.isRepeating = true
                }
              })
               this.taskRepeatingDaysTemp = daysChecked
              }
           task.isEdit = false
           }
        })
        this.taskId = id
        this.repeated = this.isRepeating
        if(this.isArchieved) {
          this.completed = new Date().toJSON()
        }else {
          this.completed = ''
        }
       
        const formData = {
          id: this.taskId,
          color: this.color,
          description: this.description,
          due_date: this.date,
          is_archived: this.isArchieved,
          is_favorite: this.isFavorite,
          repeating_days: days,
          tags: this.tags,
          repeated: this.repeated,
          is_completed: this.completed
        }
        this.$emit('updateTask')
        try {
          const task = await this.$store.dispatch('updateTask',formData)
        } catch (error) {}
      },
      async archiveFn(id) {
        this.tasks.map(task => {
          if(task.id === id) {
            task.is_archived = !task.is_archived
            this.isArchieved = task.is_archived
            this.completed = task.is_completed
          }
        })
        if(this.isArchieved) {
          this.completed = new Date().toJSON()
        }else {
          this.completed = ''
        }
        this.taskId = id
        const formData = {
          id: this.taskId,
          is_archived: this.isArchieved,
          is_completed: this.completed
        }
      
        try {
          const task = await this.$store.dispatch('updateArchive',formData)
        } catch (error) {}
          this.$emit('updateTask')
      },
      async favoritesFn(id) {
        this.tasks.map(task => {
          if(task.id === id) {
            task.is_favorite = !task.is_favorite
            this.isFavorite = task.is_favorite
          }
        })
        this.taskId = id
        const formData = {
          id: this.taskId,
          is_favorite: this.isFavorite
        }
        try {
          const task = await this.$store.dispatch('updateFavorite',formData)
        } catch (error) {}
          this.$emit('updateTask')
      },
      isDataShown(id) {
        this.tasks.map(task => {
          if(task.id === id) {
            this.isDateShow = !this.isDateShow
            if(this.isDateShow === false) { 
                this.date = ''
            }else {
              this.date = new Date(this.date).toJSON()
            }
          }
        })
      },
      checkDate() {
        this.checked = !this.checked
      },
      removeTag(index) {
        this.tags.splice(index, 1)
      },
      addNewTask(task) {
        this.tasks.push(task)
      },
      showDays(id) {
        this.tasks.map(task => {
          if(task.id === id) {
            this.isRepeating = !this.isRepeating
            this.isRepeating ? task.repeated = true : task.repeated = false
            if(this.isRepeating) {
              this.days.map(day => {
                if(day.value === 'we' || day.value === 'fr' || day.value === 'su') {
                  day.checked = true
                }
              })
            }else {
              this.days.map(day => {
                day.checked = false
              })
            }
          }
        })
      },
      addHashTag(e,id) {
        this.tasks.map(task => {
          if(task.id === id) {
           if (e.keyCode == 0 || e.keyCode == 32) {
              if(this.$v.tag.$invalid) {
                this.$v.tag.$touch()
                this.tag = ''
                return
              }else {
                if(this.tags.length < this.tagsAmount) {
                  this.tags = task.tags
                  this.tags.push(this.tag)
                  this.tag=''
                }else {
                  return
                }
             }
            }
          }
        })
      },
      colorCheck(e) {
        this.tasks.map(task => {
          this.color = e.target.value
          this.colors.map(color => {
            color.checked = false
            if(color.value === e.target.value) {
              color.checked = true
            }else {
              color.checked = false
            }
            e.target.checked = true
          })
        })
      },
     async closeCardEdit(index, id) {
       if(confirm('Are you sure?')) {
          this.tasks.splice(index, 1)
          await this.$store.dispatch('deleteTask', id)
          this.$emit('updateTask')
       }
      }
    },
    validations: {
      description: {required,  minLength: minLength(1),  maxLength: maxLength(140)},
      tag: {minLength: minLength(3),  maxLength: maxLength(14)}
    },
    beforeDestroy() {
      if(this.date && this.date.destroy) {
        this.date.destroy()
      }
    }
}
</script>
<style scoped>
  .card {
      position: relative;
      width: 210px;
      min-height: 210px;
      margin-bottom: 26px;
      margin-right: 40px;
  }
  .card--edit .card__inner {
    min-height: auto;
    border: 0;
  }
  .card__text.invalid {
    border: 1px solid red;
  }
  .error {
    color: red;
  }
  .card__hashtag {
    margin-bottom: 10px;
  }
  .card__repeat-day.active {
    color: #000000;
    border-color: #000000;
  }
  .card--edit .card__colors-inner  {
    order: 0
  }
  .card__colors-item {
     width: 15px;
  }
  .card__dates-item .date {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
  }
  .card__colors-item > .active > .card__color.card__color--black {
    box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #0a0a0a;
  }
  .card__colors-item > .active > .card__color.card__color--yellow {
    box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #ffe125;
  }
  .card__colors-item > .active > .card__color.card__color--blue {
    box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #0c5cdd;
  }
  .card__colors-item > .active > .card__color.card__color--green {
    box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #31b55c;
  }
  .card__colors-item > .active > .card__color.card__color--pink {
    box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #ff3cb9;
  }
  .card--descr {
    font-weight: 500;
    font-size: 16px;
  }
  .tasks__list {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
  }
  .card--descr {
    height: 98px;
    overflow: hidden
  }
  .card__btn {
    opacity: 1;
  }
  .is--edit .card__btn--edit, .card__btn:hover  {
    opacity: 0.6;
  }
  .is--edit {
    z-index: 5;
  }
  .date {
    min-height: 10px
  }
  .tasks__list {
    width: 100%;
  }
  .hashtag__list {
    display: flex;
    flex-wrap: wrap;
  }
  .hashtag__list-item {
    margin: 5px;
    font-size: 11px;
    font-weight: 500;
  }
  .black .card__color-bar {
    background-color: #000000;
  }
  .yellow .card__color-bar {
    background-color: #ffe125;
  }
  .blue .card__color-bar {
    background-color: #0c5cdd;
  }
  .green .card__color-bar {
    background-color: #31b55c;
  }
  .pink .card__color-bar {
    background-color: #ff3cb9;
  }
  .expired .card__color-bar-wave {
    background-color: #f11a1a;
  }
  .card--repeat .card__color-bar {
    background-color: transparent;
  }
  .black .card__color-bar-wave {
    stroke: #000000;
  }
  .yellow .card__color-bar-wave {
    stroke: #ffe125;
  }
  .blue .card__color-bar-wave {
    stroke: #0c5cdd;
  }
  .green .card__color-bar-wave {
    stroke: #31b55c;
  }
  .pink .card__color-bar-wave {
    stroke: #ff3cb9;
  }
  .expired .card__color-bar-wave {
    stroke: #f11a1a;
  }
  .card__btn.card__btn--archive.active {
    color: #569ff7;
  }
  .card__btn.card__btn--favorites.active {
    color: #569ff7;
  }
  .card__btn.card__btn--favorites.disabled {
    opacity: 0.5
  }
</style>