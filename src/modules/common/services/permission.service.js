import store from '@/store'

class PermissionService {
  check({ permissions }) {
    const userRoles = store.getters.userRoles
    if (userRoles.includes('admin')) return true
    return false
  }
}
export default new PermissionService()
