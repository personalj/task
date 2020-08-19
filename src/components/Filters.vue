<template>
    <section class="main__filter filter container">
        <div class='filter__item' :class="{'disable': allTasksAmount === 0}">
          <input
            type="radio"
            id="filter__all"
            class="filter__input visually-hidden"
            name="filter"
            checked
            @click='allTasksTitle'
          />
          <label for="filter__all" class="filter__label">
            All <span class="filter__all-count">{{allTasksAmount}}</span></label
          >
        </div>
        <div class='filter__item' :class="{'disable': overdueAmount === 0}">
          <input
            type="radio"
            id="filter__overdue"
            class="filter__input visually-hidden"
            name="filter"
            @click='overdueTasksTitle'
          />
          <label for="filter__overdue" class="filter__label"
            >Overdue <span class="filter__overdue-count" >{{overdueAmount}}</span></label
          >
        </div>
        <div class='filter__item' :class="{'disable': todayAmount === 0}">
          <input
            type="radio"
            id="filter__today"
            class="filter__input visually-hidden"
            name="filter"
            @click='todayTasksTitle'
          />
          <label for="filter__today" class="filter__label"
            >Today <span class="filter__today-count">{{todayAmount}}</span></label
          >
        </div>
        <div class='filter__item' :class="{'disable': favoritesAmount === 0}">
          <input
            type="radio"
            id="filter__favorites"
            class="filter__input visually-hidden"
            name="filter"
            @click='favoritesTasksTitle'
          />
          <label for="filter__favorites" class="filter__label"
            >Favorites <span class="filter__favorites-count">{{favoritesAmount}}</span></label
          >
        </div>
        <div class='filter__item' :class="{'disable': repeatingAmount === 0}">
          <input
            type="radio"
            id="filter__repeating"
            class="filter__input visually-hidden"
            name="filter"
            @click='repeatingTasksTitle'
          />
          <label for="filter__repeating" class="filter__label"
            >Repeating <span class="filter__repeating-count">{{repeatingAmount}}</span></label
          >
        </div>
        <div class='filter__item' :class="{'disable': archiveAmount === 0}">
          <input
            type="radio"
            id="filter__archive"
            class="filter__input visually-hidden"
            name="filter"
            @click='archiveTasksTitle'
          />
          <label for="filter__archive" class="filter__label"
            >Archive <span class="filter__archive-count">{{archiveAmount}}</span></label
          >
        </div>
    </section>
</template>
<script>
    export default {
        name: 'Filters',
        props: {
          tasks: {
            type: Array,
            required: true
          },
          allTasksAmount: {
            type: Number,
            required: true
          },
          overdueAmount: {
            type: Number,
            required: true
          },
          todayAmount: {
            type: Number,
            required: true
          },
          favoritesAmount: {
            type: Number,
            required: true
          },
          repeatingAmount: {
            type: Number,
            required: true
          },
          archiveAmount: {
            type: Number,
            required: true
          }
        },
        data: () => ({
          date: new Date(),
          tasksDefault: []
        }),
        methods: {
          allTasksTitle() {
            this.$emit('allTasksTitle')
            this.$emit('closeAddCard')
          },
          overdueTasksTitle() {
            this.$emit('overdueTasksTitle')
            this.$emit('closeAddCard')
          },
          todayTasksTitle() {
            this.$emit('todayTasksTitle')
            this.$emit('closeAddCard')
          },
          favoritesTasksTitle() {
            this.$emit('favoritesTasksTitle')
            this.$emit('closeAddCard')
          },
          repeatingTasksTitle() {
            this.$emit('repeatingTasksTitle')
            this.$emit('closeAddCard')
          },
          archiveTasksTitle() {
            this.$emit('archiveTasksTitle')
            this.$emit('closeAddCard')
          }
        }
    }
</script>
<style scoped>
  .filter__item.disable {
    opacity: 0.5;
  }
</style>