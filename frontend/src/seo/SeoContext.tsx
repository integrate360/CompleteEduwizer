import { createContext, useContext, useEffect, useState } from 'react'
import { getSeoOverrides, type SeoOverride } from '../services/api'

type OverrideMap = Record<string, SeoOverride>

const SeoContext = createContext<OverrideMap>({})

/** Loads the admin-managed SEO overrides once and shares them app-wide. */
export function SeoProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<OverrideMap>({})

  useEffect(() => {
    getSeoOverrides()
      .then((r) => setOverrides(r.data ?? {}))
      .catch(() => {
        /* overrides are optional — pages fall back to their built-in defaults */
      })
  }, [])

  return <SeoContext.Provider value={overrides}>{children}</SeoContext.Provider>
}

/** Returns the admin override for a pageKey, or undefined. */
// eslint-disable-next-line react-refresh/only-export-components
export function useSeoOverride(pageKey?: string): SeoOverride | undefined {
  const map = useContext(SeoContext)
  return pageKey ? map[pageKey] : undefined
}
