import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socket from '@/socket'
import store from '@/store'
import { RegionService } from '@/shared/services'

interface Region {
  _id: string
  name: string
  company?: string
  [key: string]: any
}

export const useRegionStore = defineStore('region', () => {
  const regions = ref<Region[]>([])

  let _wsReady = false
  function initWs() {
    if (_wsReady) return
    _wsReady = true

    socket.on('region:created', (data: Region) => {
      if (!regions.value.find((i) => i._id === data._id)) {
        regions.value.push(data)
        regions.value.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      }
      store.commit('addToCache', data)
    })
    socket.on('region:updated', (data: Region) => {
      const idx = regions.value.findIndex((i) => i._id === data._id)
      if (idx !== -1) regions.value.splice(idx, 1, data)
      store.commit('addToCache', data)
    })
    socket.on('region:deleted', (id: string) => {
      regions.value = regions.value.filter((i) => i._id !== id)
      store.commit('deleteFromCache', id)
    })
  }

  const regionsForAutocomplete = computed(() =>
    regions.value
      .map((i) => ({ value: i._id, text: i.name, name: i.name }))
      .sort((a, b) => a.text.localeCompare(b.text, 'ru'))
  )

  const regionsMap = computed(() => new Map(regions.value.map((i) => [i._id, i])))

  function setRegions(payload: Region[]) {
    regions.value = payload.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  async function fetchRegions(profile: string) {
    const data = await RegionService.getByDirectoriesProfile(profile)
    regions.value = data.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  initWs()

  return { regions, regionsForAutocomplete, regionsMap, setRegions, fetchRegions }
})
