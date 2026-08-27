import { ref, watch } from 'vue'

function firstQueryValue(value) {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Keeps a durable, user-visible subview in the URL query string.
 * Route params describe the application and main stage; query values retain
 * the selected tab, source and page inside that stage across a refresh.
 */
export function useRouteQueryState(route, router, key, fallback, options = {}) {
  const parse = options.parse || ((value) => value ?? fallback)
  const serialize = options.serialize || ((value) => (value === fallback ? undefined : String(value)))
  const read = (value) => {
    const parsed = parse(firstQueryValue(value))
    return parsed == null ? fallback : parsed
  }

  const state = ref(read(route.query[key]))

  watch(() => route.query[key], (value) => {
    const next = read(value)
    if (next !== state.value) state.value = next
  })

  watch(state, (value) => {
    const nextValue = serialize(value)
    const currentValue = firstQueryValue(route.query[key])
    if ((nextValue ?? undefined) === (currentValue ?? undefined)) return

    const query = { ...route.query }
    if (nextValue == null || nextValue === '') delete query[key]
    else query[key] = nextValue
    router.replace({ query })
  })

  return state
}

export function routeChoice(choices, fallback) {
  return {
    parse(value) {
      return choices.includes(value) ? value : fallback
    },
  }
}

export function routePositiveInteger(fallback = 1) {
  return {
    parse(value) {
      const parsed = Number.parseInt(value, 10)
      return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
    },
    serialize(value) {
      const parsed = Number.parseInt(value, 10)
      return parsed === fallback ? undefined : String(Math.max(1, parsed || fallback))
    },
  }
}

export function routeBoolean(fallback = false) {
  return {
    parse(value) {
      if (value === 'true') return true
      if (value === 'false') return false
      return fallback
    },
    serialize(value) {
      return value ? 'true' : undefined
    },
  }
}
