'use server'
import { cookies } from 'next/headers'

export async function setThemeCookie(theme: 'light' | 'dark') {
  const cookieStore = await cookies()
  cookieStore.set('theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, 
    sameSite: 'lax',
  })
}

export async function getThemeCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('theme')?.value
}