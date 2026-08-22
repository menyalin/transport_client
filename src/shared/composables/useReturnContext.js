import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'return-context-stack'
const TTL = 30 * 60 * 1000

const storage = () => sessionStorage

/**
 * @typedef {Object} ReturnContext
 * @property {string} id
 * @property {string} from
 * @property {string} action
 * @property {Record<string, unknown>} params
 * @property {number} createdAt
 */

function readStack() {
  try {
    return JSON.parse(storage().getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeStack(stack) {
  storage().setItem(STORAGE_KEY, JSON.stringify(stack))
}

function clearExpired(stack) {
  const now = Date.now()
  return stack.filter((c) => now - c.createdAt < TTL)
}

/**
 * Сохранить контекст и получить ID для передачи в URL.
 * @param {string} from
 * @param {string} action
 * @param {Record<string, unknown>} params
 * @returns {string}
 */
export function pushContext(from, action, params = {}) {
  const stack = clearExpired(readStack())
  const ctx = {
    id: uuidv4().slice(0, 8),
    from,
    action,
    params,
    createdAt: Date.now(),
  }
  stack.push(ctx)
  writeStack(stack)
  return ctx.id
}

/**
 * Извлечь и удалить контекст. Возвращает null, если не найден или истёк.
 * @param {string} contextId
 * @returns {ReturnContext|null}
 */
export function popContext(contextId) {
  const stack = readStack()
  const idx = stack.findIndex((c) => c.id === contextId && Date.now() - c.createdAt < TTL)
  if (idx === -1) return null
  const [ctx] = stack.splice(idx, 1)
  writeStack(stack)
  return ctx
}

/**
 * Прочитать контекст без удаления.
 * @param {string} contextId
 * @returns {ReturnContext|null}
 */
export function getContext(contextId) {
  return readStack().find((c) => c.id === contextId && Date.now() - c.createdAt < TTL) ?? null
}

/**
 * Удалить все истёкшие контексты.
 */
export function cleanupExpiredContexts() {
  writeStack(clearExpired(readStack()))
}
