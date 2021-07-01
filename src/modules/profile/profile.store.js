import CompanyService from './services/company.service'
import UserService from '@/modules/auth/services/user.service'

export default {
  state: {
    myCompanies: [],
    tasks: [],
    staffRoles: [
      { text: 'Администратор', value: 'admin' },
      { text: 'Менеджер', value: 'manager' },
      { text: 'Диспетчер', value: 'dispatcher' },
    ],
  },
  mutations: {
    setMyCompanies(state, companies) {
      state.myCompanies = companies
    },
    addCompany(state, company) {
      state.myCompanies.push(company)
    },
    addEmployee(state, { companyId, newEmployee }) {
      const company = state.myCompanies.find((item) => item._id === companyId)
      company.staff.push(newEmployee)
    },
    addTask(state, task) {
      state.tasks.push(task)
    },
    completeTask(state, taskId) {
      const taskIndex = state.tasks.findIndex((item) => item._id === taskId)
      if (taskIndex !== -1) state.tasks.splice(taskIndex, 1)
    },
    deleteEmployee(state, { companyId, employeeId }) {
      const company = state.myCompanies.find((item) => item._id === companyId)
      if (company)
        company.staff = company.staff.filter((item) => item._id !== employeeId)
    },
    updateCompany(state, company) {
      state.myCompanies = state.myCompanies.filter(
        (item) => item._id !== company._id
      )
      state.myCompanies.push(company)
    },
  },
  actions: {
    async getMyCompanies({ commit, dispatch }) {
      try {
        commit('setLoading', true)
        const companies = await CompanyService.getMyCompanies()
        commit('setLoading', false)
        commit('setMyCompanies', companies)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
      }
    },
    async createCompany({ commit }, payload) {
      try {
        commit('setLoading', true)
        const company = await CompanyService.create(payload)
        commit('setLoading', false)
        commit('addCompany', company)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
    async isExistInn({ commit }, inn) {
      try {
        const tmp = await CompanyService.isExistInn(inn)
        return tmp
      } catch (e) {
        commit('setError', e.response?.data?.message)
      }
    },
    async userByEmail({ commit }, email) {
      try {
        const tmp = await CompanyService.userByEmail(email)
        return tmp
      } catch (e) {
        commit('setError', e.response?.data?.message)
      }
    },
    async addEmployee({ commit }, { newEmployee, companyId }) {
      try {
        commit('setLoading', true)
        const newEmpl = await CompanyService.addEmployee(newEmployee, companyId)
        commit('addEmployee', { companyId, newEmployee: newEmpl })
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },

    async configProfile({ commit }, payload) {
      try {
        commit('setLoading', true)
        await UserService.configProfile(payload)
        commit('updateUser', payload)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    myCompanies: (state) => state.myCompanies,
    staffRoles: ({ staffRoles }) => staffRoles,
    tasks: ({ tasks }) => tasks,
  },
}
