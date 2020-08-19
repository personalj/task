<template>
    <article class="card card--edit card--black card--add-task" v-if="isShow" :class="{'card--repeat' : isRepeating}">
        <form class="card__form" method="get" @submit.prevent="submitHandler">
            <div class="card__inner">
                <div class="card__color-bar">
                  <svg width="100%" height="10">
                    <use xlink:href="#wave">
                        <Wave/>
                    </use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                      v-model='description'
                      :class="{'invalid': ($v.description.$dirty && !$v.description.required) || ($v.description.$dirty && !$v.description.minLength) || ($v.description.$dirty && !$v.description.maxLength)}"
                    >This is example of new task, you can add picture, set date and time.</textarea>
                  </label>
                  <small class="error" v-if="$v.description.$dirty && !$v.description.required">Add some description</small>
                  <small class="error" v-else-if="($v.description.$dirty && !$v.description.minLength) || ($v.description.$dirty && !$v.description.maxLength)">Description should be min {{$v.description.$params.minLength.min}} and max {{$v.description.$params.maxLength.max}}.Now it's {{description.length}}</small>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button"
                        @click='isDateShow =! isDateShow'
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

                      <button class="card__repeat-toggle" type="button" @click="showDays">
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
                                    @click='day.checked =!day.checked'
                                />
                              </label>
                            </div>
                        </div>
                      </fieldset>
                    </div>
                      
                    </div>
                  </div>
                  <div class="card__hashtag">
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
                          @keyup='addHashTag($event)'
                          :class="{'invalid': ($v.tag.$dirty && !$v.tag.minLength) || ($v.tag.$dirty && !$v.tag.maxLength)}"
                      >
                      <small class="error" v-if='($v.tag.$dirty && !$v.tag.minLength) || ($v.tag.$dirty && !$v.tag.maxLength)'>Hashtag should be min {{$v.tag.$params.minLength.min}} and max {{$v.tag.$params.maxLength.max}}.Now it's {{tag.length}}</small>
                      <small class="error" v-else-if='tags.length >= tagsAmount'>You can add only {{tagsAmount}} tags </small>
                    </label>
                  </div>
                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                        <div class="card__colors-item" v-for="(color, index) in colors" :key="color.index">
                            <div :class="{'active': color.checked}">
                              <label 
                                :class="color.classLabel" 
                                >{{color.value}}
                                <input
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
                <div class="card__status-btns">
                  <button class="card__save" type="submit">save</button>
                  <button class="card__delete" type="button" @click="closeCard">Cancel</button>
                </div>
            </div>
        </form>
    </article>
  <!-- built files will be auto injected -->
</template>
<script>

import {required, minLength, maxLength} from 'vuelidate/lib/validators'
import flatPickr from 'vue-flatpickr-component';  
import 'flatpickr/dist/flatpickr.css';
import Wave from '@/components/Wave.component'
    export default {
        name: 'AddTask',
        props: {
            isShow: {
                type: Boolean,
                required: true
            }
        },
        data: () => ({
            date: new Date(),
            isDateShow: false,
            isRepeating: false,
            isFavorite: false,
            isArchieved: false,
            repeated: false,
            description: '',
            click: null,
            checked: false,
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
                 {id: 'color-black-1', classInput: 'card__color-input card__color-input--black visually-hidden', value: 'black', classLabel: 'card__color card__color--black', checked: true},
                 {id: 'color-yellow-1', classInput: 'card__color-input card__color-input--yellow visually-hidden', value: 'yellow', classLabel: 'card__color card__color--yellow', checked: false},
                 {id: 'color-blue-1', classInput: 'card__color-input card__color-input--blue visually-hidden', value: 'blue', classLabel: 'card__color card__color--blue', checked: false},
                 {id: 'color-green-1', classInput: 'card__color-input card__color-input--green visually-hidden', value: 'green', classLabel: 'card__color card__color--green', checked: false},
                 {id: 'color-pink-1', classInput: 'card__color-input card__color-input--pink visually-hidden', value: 'pink', classLabel: 'card__color card__color--pink', checked: false},
            ],
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
          async submitHandler() {
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
            this.repeated = this.isRepeating
            const days = Object.assign(...daysValue.map((k, i) => ({[k]: daysChecked[i]})))
            if(this.isDateShow === false) { 
                this.date = ''
            }else {
              this.date = new Date(this.date).toJSON()
            }
            const task = {
              color: this.color,
              description: this.description,
              due_date: this.date,
              is_archived: this.isArchieved,
              is_favorite: this.isFavorite,
              repeating_days: days,
              tags: this.tags,
              repeated: this.repeated 
            }
            this.$emit('created', task)
            this.$emit('taskCreated')
            this.$emit('closeCard')
            this.color='black'
            this.description = ''
            this.days.map(day => {
              day.checked = false
            })
             try {
              await this.$store.dispatch('createTask', task)
            } catch (error) {}
            this. clearForm()
          },
          checkDate() {
            this.checked = !this.checked
          },
          removeTag(index) {
            this.tags.splice(index, 1)
          },
          showDays() {
            this.isRepeating = !this.isRepeating
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
          },
          addHashTag(e) {
            if (e.keyCode == 0 || e.keyCode == 32) {
              if(this.$v.tag.$invalid) {
                this.$v.tag.$touch()
                this.tag = ''
                return
              }else {
                if(this.tags.length < this.tagsAmount) {
                  this.tags.push(this.tag)
                  this.tag=''
                }else {
                  return
                }
              }
            }
          },
          colorCheck(e) {
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
          },
          clearForm() {
            this.description = 'Enter text',
            this.isDateShow = false,
            this.isRepeating = false,
            this.tags = []
            this.colors.map(color => {
              if(color.value==='black') {
                color.checked = true
              }else {
                color.checked = false
              }
            })
          },
          closeCard() {
            this.$emit('closeCard')
            this. clearForm()
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
        },
        watch: {
          isShow() {
             if(!this.isShow) {
               this.clearForm()
             }
          } 
        }
    }
</script>
<style scoped>
  .card--add-task {
    position: absolute;
    z-index: 10;
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
</style>