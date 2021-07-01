import api from '@/api'
import store from '@/store'
import socket from '@/socket'
const BASE_PATH = '/companies'

class CompanyService {
  constructor() {
    socket.on('tasks:added', (data) => {
      store.commit('addTask', data)
    })
    socket.on('tasks:complete', (taskId) => {
      store.commit('completeTask', taskId)
    })
    socket.on('company:updateCompany', (payload) => {
      store.commit('updateCompany', payload)
    })
    socket.on('company:deleteEmployeeById', (payload) => {
      store.commit('deleteEmployee', payload)
    })
    socket.once('tasks:getAllActive', (tasks) => {
      tasks.forEach((item) => {
        store.commit('addTask', item)
      })
    })
  }

  getMyCompanies() {
    return new Promise((resolve, reject) => {
      api
        .get(BASE_PATH)
        .then(({ data }) => {
          resolve(data?.data)
        })
        .catch((e) => reject(e))
    })
  }

  async create(body) {
    const res = await api.post(BASE_PATH, body)
    return res
  }

  async isExistInn(inn) {
    const { data } = await api.get(BASE_PATH + '/exist_inn', {
      params: { inn },
    })
    return data
  }

  async userByEmail(email) {
    const { data } = await api.get(BASE_PATH + '/user_by_email', {
      params: { email },
    })
    return data
  }

  async addEmployee(employee, companyId) {
    const { data } = await api.post(
      BASE_PATH + '/' + companyId + '/staff',
      employee
    )
    return data
  }
}

export default new CompanyService()
