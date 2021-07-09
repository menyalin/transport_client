import CompanyService from './services/company.service'
import UserService from '@/modules/auth/services/user.service'
import AddressService from '@/modules/profile/services/address.service'
import DriverService from '@/modules/profile/services/driver.service'
import TruckService from '@/modules/profile/services/truck.service'

export default {
  state: {
    myCompanies: [],
    addresses: [],
    drivers: [],
    trucks: [],
    tasks: [],
    staffRoles: [
      { text: 'Администратор', value: 'admin' },
      { text: 'Менеджер', value: 'manager' },
      { text: 'Диспетчер', value: 'dispatcher' },
    ],
    truckTypes: [
      { text: 'Грузовик', value: 'truck' },
      { text: 'Прицеп (П/П)', value: 'trailer' },
    ],
  },
  mutations: {
    setMyCompanies(state, companies) {
      state.myCompanies = companies
    },
    clearDirectories(state) {
      state.addresses = []
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
    setAddresses(state, payload) {
      state.addresses = payload
    },
    addAddress({ addresses }, payload) {
      if (addresses.findIndex((item) => item._id === payload._id) === -1) {
        addresses.push(payload)
      }
    },
    updateAddress(state, payload) {
      state.addresses = state.addresses.filter(
        (item) => item._id !== payload._id
      )
      state.addresses.push(payload)
    },
    deleteAddress(state, id) {
      state.addresses = state.addresses.filter((item) => item._id !== id)
    },

    setDrivers(state, payload) {
      state.drivers = payload
    },
    addDriver({ drivers }, payload) {
      if (drivers.findIndex((item) => item._id === payload._id) === -1) {
        drivers.push(payload)
      }
    },
    updateDriver(state, payload) {
      state.drivers = state.drivers.filter((item) => item._id !== payload._id)
      state.drivers.push(payload)
    },
    deleteDriver(state, id) {
      state.drivers = state.drivers.filter((item) => item._id !== id)
    },

    setTrucks(state, payload) {
      state.trucks = payload
    },
    addTruck({ trucks }, payload) {
      if (trucks.findIndex((item) => item._id === payload._id) === -1) {
        trucks.push(payload)
      }
    },
    updateTruck(state, payload) {
      state.trucks = state.trucks.filter((item) => item._id !== payload._id)
      state.trucks.push(payload)
    },
    deleteTruck(state, id) {
      state.trucks = state.trucks.filter((item) => item._id !== id)
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

    setDirectories({ commit }, { companies, addresses, drivers }) {
      if (companies?.length) commit('setMyCompanies', companies)
      if (addresses?.length) commit('setAddresses', addresses)
      if (drivers?.length) commit('setDrivers', drivers)
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
        await UserService.configProfile(payload)
        commit('updateUser', payload)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },

    createAddress({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const newAddress = await AddressService.create(payload)
          commit('addAddress', newAddress)
          commit('setLoading', false)
          resolve(newAddress)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
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

    driverCreate({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await DriverService.create(payload)
          commit('addDriver', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },
    async getDrivers({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.drivers.length === 0 && getters.directoriesProfile)
        ) {
          commit('setDrivers', [])
          const data = await DriverService.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setDrivers', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },

    truckCreate({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await TruckService.create(payload)
          commit('addTruck', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getTrucks({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.trucks.length === 0 && getters.directoriesProfile)
        ) {
          commit('setTrucks', [])
          const data = await TruckService.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setTrucks', data)
        }
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
    truckTypes: ({ truckTypes }) => truckTypes,
    tasks: ({ tasks }) => tasks,
    addresses: ({ addresses }, { directoriesProfile }) =>
      addresses.filter((item) => item.company === directoriesProfile),

    drivers: ({ drivers }, { directoriesProfile }) =>
      drivers.filter((item) => item.company === directoriesProfile),

    trucks: ({ trucks }, { directoriesProfile }) =>
      trucks.filter((item) => item.company === directoriesProfile),
  },
}
