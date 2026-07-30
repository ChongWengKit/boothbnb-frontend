'use server';

export async function getAvailableCurrencies() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/currency/all`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    return [];
  }
}