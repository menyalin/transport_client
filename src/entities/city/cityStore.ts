import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import socket from '@/socket'
import store from '@/store'
import { CityService } from '@/shared/services'

interface City {
  _id: string
  name: string
  company?: string
  [key: string]: any
}

export const useCityStore = defineStore('city', () => {
  const cities = ref<City[]>([])

  let _wsReady = false
  function initWs() {
    if (_wsReady) return
    _wsReady = true

    socket.on('city:created', (data: City) => {
      if (!cities.value.find((i) => i._id === data._id)) {
        cities.value.push(data)
        cities.value.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      }
      store.commit('addToCache', data)
    })
    socket.on('city:updated', (data: City) => {
      const idx = cities.value.findIndex((i) => i._id === data._id)
      if (idx !== -1) cities.value.splice(idx, 1, data)
      store.commit('addToCache', data)
    })
    socket.on('city:deleted', (id: string) => {
      cities.value = cities.value.filter((i) => i._id !== id)
      store.commit('deleteFromCache', id)
    })
  }

  const citiesForAutocomplete = computed(() =>
    cities.value
      .map((i) => ({ value: i._id, text: i.name }))
      .sort((a, b) => a.text.localeCompare(b.text, 'ru'))
  )

  const citiesMap = computed(() => new Map(cities.value.map((i) => [i._id, i])))

  function setCities(payload: City[]) {
    cities.value = payload.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  async function fetchCities(profile: string) {
    const data = await CityService.getByDirectoriesProfile(profile)
    cities.value = data.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  initWs()

  return { cities, citiesForAutocomplete, citiesMap, setCities, fetchCities }
})
