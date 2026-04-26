'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('authentication_token')?.value;
}
export async function getProfilePhoto() {
  const cookieStore = await cookies();
  return cookieStore.get('profile_photo')?.value;
}
export async function setProfilePhoto(url: string) {
  const cookieStore = await cookies();
  cookieStore.set('profile_photo', url, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: 'lax',
    path: '/'
  });
}
export async function validateResponse(status: number) {
  if (status === 401) {
    redirect('/login?reason=session_expired');
  }
}

export async function deleteAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('profile_photo');
  cookieStore.delete('authentication_token');
}

export async function setAuthToken(token: string, profile_photo?: string) {
  const cookieStore = await cookies();
  cookieStore.set('authentication_token', token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: 'lax',
    path: '/'
  });
  if (profile_photo !== undefined) {
    cookieStore.set('profile_photo', profile_photo || '', {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
  }
}