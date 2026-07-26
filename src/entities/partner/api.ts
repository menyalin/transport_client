import api from '@/api'

const BASE_PATH = '/partners'

export interface Partner {
  _id: string
  name: string
  company?: string
  isClient?: boolean
  invoiceLoader?: boolean
  group?: string
  idleTruckNotifications?: IdleTruckNotification[]
  placesForTransferDocs?: PlaceForTransferDocs[]
  [key: string]: unknown
}

export interface IdleTruckNotification {
  _id?: string
  isActive?: boolean
  agreement?: string
  addresses?: string[]
  note?: string
  [key: string]: unknown
}

export interface PlaceForTransferDocs {
  _id?: string
  name?: string
  [key: string]: unknown
}

export async function fetchByProfile(profile: string): Promise<Partner[]> {
  const { data } = await api.get(BASE_PATH, { params: { profile } })
  if (!Array.isArray(data)) throw new Error('Нужен массив!! пришло что-то другое!')
  return data
}

export async function getById(id: string): Promise<Partner> {
  const { data } = await api.get(BASE_PATH + '/' + id)
  return data
}

export async function create(body: Record<string, unknown>): Promise<Partner> {
  const { data } = await api.post(BASE_PATH, body)
  return data
}

export async function updateById(id: string, body: Record<string, unknown>): Promise<Partner> {
  const { data } = await api.put(BASE_PATH + '/' + id, body)
  return data
}

export async function deleteById(id: string): Promise<void> {
  await api.delete(BASE_PATH + '/' + id)
}

export async function addIdleTruckNotify(
  partnerId: string,
  body: Record<string, unknown>
): Promise<Partner> {
  const { data } = await api.post(BASE_PATH + '/' + partnerId + '/idle_truck_notification', body)
  return data
}

export async function deleteIdleTruckNotify(partnerId: string, idleId: string): Promise<Partner> {
  const { data } = await api.delete(
    BASE_PATH + '/' + partnerId + '/idle_truck_notification/' + idleId
  )
  return data
}

export async function updateIdleTruckNotify(
  partnerId: string,
  idleId: string,
  body: Record<string, unknown>
): Promise<Partner> {
  const { data } = await api.put(
    BASE_PATH + '/' + partnerId + '/idle_truck_notification/' + idleId,
    body
  )
  return data
}

export async function addPlaceForTransferDocs(
  partnerId: string,
  body: Record<string, unknown>
): Promise<Partner> {
  const { data } = await api.post(BASE_PATH + '/' + partnerId + '/places', body)
  return data
}

export async function deletePlaceForTransferDocs(
  partnerId: string,
  placeId: string
): Promise<Partner> {
  const { data } = await api.delete(BASE_PATH + '/' + partnerId + '/places/' + placeId)
  return data
}

export async function updatePlaceForTransferDocs(
  partnerId: string,
  placeId: string,
  body: Record<string, unknown>
): Promise<Partner> {
  const { data } = await api.put(BASE_PATH + '/' + partnerId + '/places/' + placeId, body)
  return data
}
