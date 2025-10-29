"use client"

import { useEffect, useState } from "react"
import type { Language } from "@/src/app/page"

const PREFERENCES_KEY = "cgu-chatbot-preferences"

export interface UserPreferences {
  language: Language | null
  termsAccepted: boolean
  termsAcceptedAt?: string
}

const defaultPreferences: UserPreferences = {
  language: null,
  termsAccepted: false,
}

// Funcao para salvar preferencias no localStorage
export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error("Erro ao salvar preferencias:", error)
  }
}

// Funcao para carregar preferencias do localStorage
export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return defaultPreferences
  
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (!stored) return defaultPreferences
    
    const parsed = JSON.parse(stored) as UserPreferences
    return {
      ...defaultPreferences,
      ...parsed,
    }
  } catch (error) {
    console.error("Erro ao carregar preferencias:", error)
    return defaultPreferences
  }
}

// Hook personalizado para gerenciar preferencias
export function useUserPreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loaded = loadPreferences()
    setPreferencesState(loaded)
    setIsLoaded(true)
  }, [])

  const setPreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferencesState(updated)
    savePreferences(updated)
  }

  const setLanguage = (language: Language) => {
    setPreferences({ language })
  }

  const acceptTerms = () => {
    setPreferences({
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    })
  }

  const clearPreferences = () => {
    const cleared = defaultPreferences
    setPreferencesState(cleared)
    savePreferences(cleared)
  }

  return {
    preferences,
    isLoaded,
    setPreferences,
    setLanguage,
    acceptTerms,
    clearPreferences,
  }
}


