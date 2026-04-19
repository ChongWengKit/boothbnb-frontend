'use server'
import { cookies } from 'next/headers'

export async function setSidebarCookie(isOpen: boolean) {
  const cookieStore = await cookies()
  cookieStore.set('sidebar_expanded', String(isOpen))
}

export async function getSidebarCookie() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('sidebar_expanded')
  return cookie?.value === 'true'
}