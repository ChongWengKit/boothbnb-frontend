'use server'

import { cookies } from 'next/headers';

export async function getCurrency() {
  const cookieStore = await cookies();
  return cookieStore.get('user-currency')?.value || null;
}

export async function setCurrency(currency: string) {
  const cookieStore = await cookies();
  cookieStore.set('user-currency', currency, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}