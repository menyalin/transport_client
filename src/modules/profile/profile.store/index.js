import AddressModule from './address'
import CrewModule from './crew'
import TruckModule from './truck'
import TkNameModule from './tkName'
import DriverModule from './driver'
import PartnerModule from './partner'
import DowntimeModule from './downtime'
import OrderTemplateModule from './orderTemplate'
import ScheduleNotes from './scheduleNote'
import agreementModule from './agreement'
import CompanyService from '../services/company.service'
import UserService from '@/modules/auth/services/user.service'

export default {
  state: {
    myCompanies: [],
    formSettings: new Map(),
    cacheDirectories: new Map(),
    tasks: [],
    staffRoles: [
      { text: 'Администратор', value: 'admin' },
      { text: 'Менеджер', value: 'manager' },
      { text: 'Диспетчер', value: 'dispatcher' },
    ],
  },
  mutations: {
    setFormSettings({ formSettings }, { formName, settings }) {
      formSettings.set(formName, settings)
    },
    addArrayToCache(state, items) {
      items.forEach((item) => {
        state.cacheDirectories.set(item._id, item)
      })
    },
    addToCache(state, item) {
      state.cacheDirectories.set(item._id, item)
    },
    deleteFromCache(state, id) {
      state.cacheDirectories.delete(id)
    },
    clearCache(state) {
      state.cacheDirectories.clear()
    },
    setMyCompanies(state, companies) {
      state.myCompanies = companies
    },
    clearDirectories({ addresses, drivers }) {
      addresses = []
      drivers = []
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
    async getMyCompanies({ commit }) {
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

    setDirectories(
      { commit },
      {
        companies,
        addresses,
        drivers,
        trucks,
        tkNames,
        partners,
        orderStatuses,
        orderTemplates,
        orderAnalyticTypes,
        calcMethods,
      }
    ) {
      if (companies?.length) commit('setMyCompanies', companies)
      if (addresses?.length) commit('setAddresses', addresses)
      if (drivers?.length) commit('setDrivers', drivers)
      if (trucks?.length) commit('setTrucks', trucks)
      if (tkNames?.length) commit('setTkNames', tkNames)
      if (partners?.length) commit('setPartners', partners)
      if (orderStatuses?.length) commit('setOrderStatuses', orderStatuses)
      if (orderTemplates?.length) commit('setOrderTemplates', orderTemplates)
      if (orderAnalyticTypes?.length)
        commit('setOrderAnalyticTypes', orderAnalyticTypes)
      if (calcMethods?.length) commit('setCalcMethods', calcMethods)
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
        commit('clearDirectories')
        commit('clearCache')
        await UserService.configProfile(payload)
        commit('updateUser', payload)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },

    async getAddresses({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.addresses.length === 0 && getters.directoriesProfile)
        ) {
          commit('setAddresses', [])
          const addressList = await AddressService.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setAddresses', addressList)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    cacheDirectories: ({ cacheDirectories }) => cacheDirectories,

    myCompanies: (state) => state.myCompanies,

    staffRoles: ({ staffRoles }) => staffRoles,

    tasks: ({ tasks }) => tasks,

    formSettingsMap: ({ formSettings }) => formSettings,
  },

  modules: {
    AddressModule,
    CrewModule,
    DriverModule,
    TruckModule,
    TkNameModule,
    PartnerModule,
    DowntimeModule,
    OrderTemplateModule,
    ScheduleNotes,
    agreementModule,
  },
}
