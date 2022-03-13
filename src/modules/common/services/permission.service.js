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

    permissions.forEach((p) => {
      if (
        !store.getters.permissionsMap.has(p) ||
        !store.getters.permissionsMap.get(p)
      )
        accessAllowed = false
    })
    return accessAllowed
  }
}
export default new PermissionService()
