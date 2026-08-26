// 前端 Demo 权限策略：统一身份能力与部门范围的判断，后端接入后应复用同名规则并在服务端强制执行。
export const DEMO_ROLE = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
})

export function normalizeRole(role) {
  return role === '管理员' || role === DEMO_ROLE.ADMIN ? DEMO_ROLE.ADMIN : DEMO_ROLE.USER
}

export function isManagementAdmin(profile) {
  return normalizeRole(profile?.role) === DEMO_ROLE.ADMIN
}

export function resolveVisibility(resource, fallbackOwnerDepartmentId = '') {
  const visibility = resource?.visibility || {}
  const mode = ['group', 'department', 'department-children', 'custom'].includes(visibility.mode)
    ? visibility.mode
    : 'department'

  return {
    mode,
    ownerDepartmentId: visibility.ownerDepartmentId || fallbackOwnerDepartmentId,
    departmentIds: Array.isArray(visibility.departmentIds) ? visibility.departmentIds.filter(Boolean) : [],
  }
}

export function isDepartmentInScope(departmentId, scopeDepartmentId, getDepartmentPath) {
  if (!departmentId || !scopeDepartmentId || typeof getDepartmentPath !== 'function') return false
  return getDepartmentPath(departmentId).includes(scopeDepartmentId)
}

export function isResourceVisibleToDepartment(resource, departmentId, getDepartmentPath, fallbackOwnerDepartmentId = '') {
  if (!departmentId) return false
  const visibility = resolveVisibility(resource, fallbackOwnerDepartmentId)
  if (visibility.mode === 'group') return true
  if (visibility.mode === 'department') return departmentId === visibility.ownerDepartmentId
  if (visibility.mode === 'department-children') {
    return isDepartmentInScope(departmentId, visibility.ownerDepartmentId, getDepartmentPath)
  }
  return visibility.departmentIds.some((scopeDepartmentId) => isDepartmentInScope(departmentId, scopeDepartmentId, getDepartmentPath))
}

export function canViewCompanyLibrary(profile, library, getDepartmentPath, fallbackOwnerDepartmentId = '') {
  return isResourceVisibleToDepartment(library, profile?.departmentId, getDepartmentPath, fallbackOwnerDepartmentId)
}

export function canEditCompanyLibrary(profile, library, getDepartmentPath, fallbackOwnerDepartmentId = '') {
  return isManagementAdmin(profile)
    && canViewCompanyLibrary(profile, library, getDepartmentPath, fallbackOwnerDepartmentId)
}
