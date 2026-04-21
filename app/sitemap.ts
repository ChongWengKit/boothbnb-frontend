export default async function sitemap() {
    const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://boothbnb.com';

    try {
        const response = await fetch(`${API_DOMAIN}/site`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 },
        });

        const result = await response.json();
        const slugs = result.data || [];

        const eventUrls = slugs.map((slug: string) => ({
            url: `${BASE_URL}/dashboard/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

        return [
            { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
            { url: `${BASE_URL}/dashboard`, lastModified: new Date() },
            ...eventUrls,
        ];
    } catch (error) {
        return [{ url: BASE_URL, lastModified: new Date() },
        { url: `${BASE_URL}/dashboard`, lastModified: new Date() }
        ];

    }
}