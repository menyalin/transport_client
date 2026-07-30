import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socket from '@/socket'
import store from '@/store'
import { ZoneService } from '@/shared/services'

interface Zone {
  _id: string
  name: string
  company?: string
  [key: string]: any
}

export const useZoneStore = defineStore('zone', () => {
  const zones = ref<Zone[]>([])

  let _wsReady = false
  function initWs() {
    if (_wsReady) return
    _wsReady = true

    socket.on('zone:created', (data: Zone) => {
      if (!zones.value.find((i) => i._id === data._id)) {
        zones.value.push(data)
        zones.value.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      }
      store.commit('addToCache', data)
    })
    socket.on('zone:updated', (data: Zone) => {
      const idx = zones.value.findIndex((i) => i._id === data._id)
      if (idx !== -1) zones.value.splice(idx, 1, data)
      store.commit('addToCache', data)
    })
    socket.on('zone:deleted', (id: string) => {
      zones.value = zones.value.filter((i) => i._id !== id)
      store.commit('deleteFromCache', id)
    })
  }

  const zonesForAutocomplete = computed(() =>
    zones.value
      .map((i) => ({
        value: i._id,
        text: i.name,
        name: i.name,
        title: i.name,
      }))
      .sort((a, b) => a.text.localeCompare(b.text, 'ru'))
  )

  const zonesMap = computed(() => new Map(zones.value.map((i) => [i._id, i])))

  function setZones(payload: Zone[]) {
    zones.value = payload.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  async function fetchZones(profile: string) {
    const data = await ZoneService.getByDirectoriesProfile(profile)
    zones.value = data.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  initWs()

  return { zones, zonesForAutocomplete, zonesMap, setZones, fetchZones }
})
