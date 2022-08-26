import api from '@/api'
import store from '@/store'
import socket from '@/socket'
const BASE_PATH = '/tasks'

class TaskService {
  constructor() {
    socket.on('tasks:added', (data) => {
      store.commit('addTask', data)
    })
    socket.on('tasks:complete', (taskId) => {
      store.commit('completeTask', taskId)
    })
    socket.once('tasks:getAllActive', (tasks) => {
      tasks.forEach((item) => {
        store.commit('addTask', item)
      })
    })
  }

  async confirmTask(taskId, result) {
    const { data } = await api.post(
      BASE_PATH + '/' + taskId + `?result=${result}`
    )
    return data
  }
}

export default new TaskService()
