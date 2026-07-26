import store from '@/store'

interface PermissionCheckInput {
  permissions: string[]
}

interface MinAllowedDateInput {
  operation: string
}

class PermissionService {
  check({ permissions }: PermissionCheckInput): boolean {
    if (!permissions || !permissions.length) return true
    const userRoles: string[] = store.getters.userRoles
    if (!userRoles.length) {
      store.commit('setError', 'У пользователя нет роли в этой компании!')
      return false
    }
    if (userRoles.includes('admin')) return true
    if (!store.getters.permissionsMap.size) return false
    let accessAllowed = true

    permissions.forEach((p) => {
      if (!store.getters.permissionsMap.has(p) || !store.getters.permissionsMap.get(p))
        accessAllowed = false
    })
    return accessAllowed
  }

  minAllowedDate({ operation }: MinAllowedDateInput): string | null {
    if (
      store.getters.permissionsMap.has('fullAccess') ||
      store.getters.permissionsMap.get(operation) === -1
    )
      return null
    if (!store.getters.permissionsMap.has(operation)) return new Date().toISOString()
    const dayCount = store.getters.permissionsMap.get(operation)
    return new Date(Date.now() - dayCount * 24 * 60 * 60 * 1000).toISOString()
  }
}

export default new PermissionService()
