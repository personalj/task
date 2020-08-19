import firebase from 'firebase/app'
export default {
    actions:{
        async createTask({commit}, task) {
            try {
                return await firebase.database().ref(`/tasks`).push({task})
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchTasks({commit}) {
            try {
                const tasksArray = []
                const tasks = (await firebase.database().ref(`/tasks/`).once('value')).val() || {}
                Object.keys(tasks).forEach(key => {
                    tasksArray.push({
                        isEdit: false,
                        isExpired: false,
                        repeated: tasks[key].task.repeated,
                        is_completed: tasks[key].task.is_completed,
                        id: key,
                        color: tasks[key].task.color,
                        description: tasks[key].task.description,
                        due_date: tasks[key].task.due_date,
                        is_archived: tasks[key].task.is_archived,
                        is_favorite: tasks[key].task.is_favorite,
                        repeating_days: tasks[key].task.repeating_days,
                        tags: tasks[key].task.tags || []
                    })
                })
                return tasksArray
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchTaskById({commit}, id) {
            try {
                const task = (await firebase.database().ref(`/tasks/`).child(id).once('value')).val() || {}
               return {...task, id}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async deleteTask({commit}, id) {
            try {
                const task = await firebase.database().ref(`/tasks/`).child(id).remove() || {}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateTask({commit}, {color, description, due_date, is_archived, is_favorite, repeating_days, tags, repeated, is_completed, id}) {
            try {
                const task = await firebase.database().ref(`/tasks/`).child(`${id}/task`).update({color, description, due_date, is_archived, is_favorite, repeating_days, tags, is_completed, repeated  })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateArchive({commit}, {is_archived, is_completed, id}) {
            try {
                const task = await firebase.database().ref(`/tasks/`).child(`${id}/task`).update({is_archived, is_completed})
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateFavorite({commit}, {is_favorite, id}) {
            try {
                const task = await firebase.database().ref(`/tasks/`).child(`${id}/task`).update({is_favorite})
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}