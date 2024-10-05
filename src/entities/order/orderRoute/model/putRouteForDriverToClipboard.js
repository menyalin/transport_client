import store from '@/store'

const getCargoParams = (params) => {
  let res = ''
  if (params?.tRegime) res += `\nt-режим: **${params.tRegime}**`
  if (params?.note) res += `\n __${params.note}__`
  return res + '\n'
}

const getPointStr = (point) => {
  const address = store.getters.addressMap.get(point.address)
  let res = `**${point.type === 'loading' ? 'Погрузка' : 'Разгрузка'}:**${
    point.isReturn ? ' (возврат)' : ''
  }\n`
  // дата
  if (point.plannedDate)
    res += `**${new Date(point.plannedDate).toLocaleString()}** \n`
  res += `**${store.getters.partnersMap.get(address.partner)?.name}** \n`
  res += `${address.name}\n`
  if (point.note) res += `__${point.note}__ \n`
  if (address.contacts) res += `**Контакты:** ${address.contacts} \n`
  res += '**Координаты: ** `' + address.geo + '`'
  return res + '\n'
}

export default async (userId, route, params, agreement) => {
  if (!userId) {
    store.commit('setError', 'Водитель не определен')
    return null
  }
  if (!route && route.length < 2) {
    store.commit('setError', 'не корректный маршрут')
    return null
  }
  const user = store.getters.driversMap.get(userId)
  const title = '__' + user.name + ', Ваш рейс:__ \n'
  const executor = '\n **ТК: ' + agreement.executorName + '**'
  const points = route.reduce(
    (res, item, idx) => res + `\n${idx + 1}. ` + getPointStr(item),
    ''
  )

  await navigator.clipboard.writeText(
    title + executor + getCargoParams(params) + points + '\n'
  )
}
