import AddressModule from './address'
import CrewModule from './crew'
import TruckModule from './truck'
import TkNameModule from './tkName'
import DriverModule from './driver'
import PartnerModule from './partner'
import DowntimeModule from './downtime'
import OrderTemplateModule from './orderTemplate'
import ScheduleNotes from './scheduleNote'
import AgreementModule from './agreement'
import ZoneModule from './zone'
import RegionModule from './region'
import CityModule from './city'
import { UserService, CompanyService } from '@/shared/services'

export default {
  state: {
    myCompanies: [],
    formSettings: new Map(),
    cacheDirectories: new Map(),
    staffRoles: [],
    fineCategories: [],
    permissionsMap: new Map(),
    companyInvites: [],
  },
  mutations: {
    setFineCategories(state, payload) {
      state.fineCategories = payload
    },
    setCompanyInvites(state, payload) {
      state.companyInvites = payload
    },

    addCompanyInvite(state, payload) {
      state.companyInvites.push(payload)
    },

    deleteInvite(state, id) {
      state.companyInvites = state.companyInvites.filter((i) => i._id !== id)
    },

    setFormSettings({ formSettings }, { formName, settings }) {
      formSettings.set(formName, settings)
    },

    addArrayToCache(state, items) {
      items.forEach((item) => {
        state.cacheDirectories.set(item._id, item)
      })
    },

    setStaffRoles(state, payload) {
      state.staffRoles = payload
    },

    setPermissionsMap(state, payload) {
      state.permissionsMap.clear()
      Object.entries(payload).forEach((i) => {
        state.permissionsMap.set(i[0], i[1])
      })
    },

    addToCache(state, item) {
      if (item?._id) state.cacheDirectories.set(item._id, item)
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

    addCompany(state, company) {
      state.myCompanies.push(company)
    },
    deleteCompany(state, companyId) {
      state.myCompanies = state.myCompanies.filter((i) => i._id !== companyId)
    },

    updateCompany(state, company) {
      const idx = state.myCompanies.findIndex(
        (item) => item._id === company._id
      )
      if (idx === -1) return null

      state.myCompanies.splice(idx, 1, company)
    },
    updateCompanySettings(state, { settings, companyId }) {
      const company = state.myCompanies.find((i) => i._id === companyId)
      if (!company) return
      company.settings = Object.assign(company.settings, settings)
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
        partnerGroups,
        orderStatuses,
        orderTemplates,
        orderAnalyticTypes,
        orderPriceTypes,
        documentTypes,
        documentStatuses,
        staffRoles,
        permissions,
        allTruckParams,
        tariffTypes,
        roundingWaitingByHours,
        idleTimeRoundingIntervals,
        documents,
        zones,
        regions,
        cities,
        companyInvites,
        fineCategories,
        salaryTariffTypes,
        docsRegistryStatuses,
        paymentInvoiceStatuses,
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
      if (orderPriceTypes?.length) commit('setOrderPriceTypes', orderPriceTypes)
      if (documentTypes?.length) commit('setDocumentTypes', documentTypes)
      if (documentStatuses?.length)
        commit('setDocumentStatuses', documentStatuses)
      if (staffRoles?.length) commit('setStaffRoles', staffRoles)
      if (permissions) commit('setPermissionsMap', permissions)
      if (allTruckParams) commit('setAllTruckParams', allTruckParams)
      if (tariffTypes) commit('setTariffTypes', tariffTypes)
      if (roundingWaitingByHours)
        commit('setRoundingWaitingByHours', roundingWaitingByHours)
      if (idleTimeRoundingIntervals)
        commit('setIdleTimeRoundingIntervals', idleTimeRoundingIntervals)
      if (documents?.length) commit('setDocuments', documents)
      if (zones?.length) commit('setZones', zones)
      if (regions?.length) commit('setRegions', regions)
      if (cities?.length) commit('setCities', cities)
      if (partnerGroups?.length) commit('setPartnerGroups', partnerGroups)
      if (fineCategories?.length) commit('setFineCategories', fineCategories)
      if (salaryTariffTypes.length)
        commit('setSalaryTariffTypes', salaryTariffTypes)
      if (companyInvites?.length) commit('setCompanyInvites', companyInvites)
      if (docsRegistryStatuses?.length)
        commit('setDocsRegistryStatuses', docsRegistryStatuses)
      if (paymentInvoiceStatuses?.length)
        commit('setPaymentInvoiceStatuses', paymentInvoiceStatuses)
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
  },
  getters: {
    cacheDirectories: ({ cacheDirectories }) => cacheDirectories,

    companyInvites: ({ companyInvites }) => companyInvites,

    myCompanies: (state) => state.myCompanies,
    companySettings: ({ myCompanies }, { directoriesProfile }) =>
      myCompanies.find((i) => i._id === directoriesProfile)?.settings,
    staffRoles: ({ staffRoles }) => staffRoles,
    staffRolesMap: ({ staffRoles }) =>
      new Map(staffRoles.map((s) => [s.value, s.text])),

    formSettingsMap: ({ formSettings }) => formSettings,
    permissionsMap: ({ permissionsMap }) => permissionsMap,
    fineCategories: ({ fineCategories }) => fineCategories,
    fineCategoriesMap: ({ fineCategories }) =>
      new Map(fineCategories.map((i) => [i.value, i.text])),
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
    AgreementModule,
    ZoneModule,
    RegionModule,
    CityModule,
  },
}
