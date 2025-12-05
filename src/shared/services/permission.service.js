import store from '@/store'

class PermissionService {
  check({ permissions }) {
    if (!permissions || !permissions.length) return true
    const userRoles = store.getters.userRoles
    if (!userRoles.length) {
      store.commit('setError', 'У пользователя нет роли в этой компании!')
      return false
    }
    if (userRoles.includes('admin')) return true
    if (!store.getters.permissionsMap.size) return false
    let accessAllowed = true

    permissions.forEach(p => {
      if (!store.getters.permissionsMap.has(p) || !store.getters.permissionsMap.get(p)) accessAllowed = false
    })
    return accessAllowed
  }
  minAllowedDate({ operation }) {
    if (store.getters.permissionsMap.has('fullAccess') || store.getters.permissionsMap.get(operation) === -1)
      return null
    if (!store.getters.permissionsMap.has(operation)) return new Date().toISOString()
    const dayCount = store.getters.permissionsMap.get(operation)
    return new Date(new Date() - dayCount * 24 * 60 * 60 * 1000).toISOString()
  }
}
export default new PermissionService()
