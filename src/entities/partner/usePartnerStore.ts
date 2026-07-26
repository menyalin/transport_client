import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import socket from '@/socket'
import * as api from './api'
import type { Partner } from './api'

export const usePartnerStore = defineStore('partner', () => {
  const vuexStore = useStore()

  const partners = ref<Partner[]>([])
  const partnerGroups = ref<Array<{ value: string; text: string }>>([])
  const loading = ref(false)

  const allPartners = computed(() => partners.value)
  const clients = computed(() => partners.value.filter((i) => i.isClient))
  const partnersMap = computed(() => new Map(partners.value.map((item) => [item._id, item])))
  const partnersForAutocomplete = computed(() =>
    partners.value.map((item) => ({
      value: item._id,
      text: item.name,
      ...item,
    }))
  )
  const partnerGroupsMap = computed(
    () => new Map(partnerGroups.value.map((i) => [i.value, i.text]))
  )

  function getById(id: string): Partner | undefined {
    return partnersMap.value.get(id)
  }

  function setPartners(data: Partner[]): void {
    partners.value = data
    vuexStore.commit('addArrayToCache', data)
    vuexStore.commit('setPartners', data)
  }

  function setPartnerGroups(data: Array<{ value: string; text: string }>): void {
    partnerGroups.value = data
    vuexStore.commit('setPartnerGroups', data)
  }

  function addPartnerLocally(item: Partner): void {
    if (partners.value.findIndex((p) => p._id === item._id) === -1) {
      partners.value.push(item)
    }
    vuexStore.commit('addPartner', item)
    vuexStore.commit('addToCache', item)
  }

  function updatePartnerLocally(item: Partner): void {
    const ind = partners.value.findIndex((p) => p._id === item._id)
    if (ind !== -1) partners.value.splice(ind, 1, item)
    vuexStore.commit('updatePartner', item)
    vuexStore.commit('addToCache', item)
  }

  function deletePartnerLocally(id: string): void {
    partners.value = partners.value.filter((p) => p._id !== id)
    vuexStore.commit('deletePartner', id)
    vuexStore.commit('deleteFromCache', id)
  }

  async function load({
    profile,
    force = false,
  }: { profile?: string; force?: boolean } = {}): Promise<void> {
    if (!force && partners.value.length > 0) return
    try {
      loading.value = true
      vuexStore.commit('setLoading', true)
      const profileToUse = profile || vuexStore.getters.directoriesProfile
      if (profileToUse) {
        const data = await api.fetchByProfile(profileToUse)
        setPartners(data)
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      vuexStore.commit('setError', err.response?.data?.message)
    } finally {
      loading.value = false
      vuexStore.commit('setLoading', false)
    }
  }

  socket.on('partner:created', (data: Partner) => {
    addPartnerLocally(data)
  })

  socket.on('partner:updated', (data: Partner) => {
    updatePartnerLocally(data)
  })

  socket.on('partner:deleted', (id: string) => {
    deletePartnerLocally(id)
  })

  return {
    partners,
    partnerGroups,
    loading,
    allPartners,
    clients,
    partnersMap,
    partnersForAutocomplete,
    partnerGroupsMap,
    getById,
    setPartners,
    setPartnerGroups,
    addPartnerLocally,
    updatePartnerLocally,
    deletePartnerLocally,
    load,
  }
})
