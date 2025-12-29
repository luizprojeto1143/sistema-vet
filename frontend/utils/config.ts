export const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;

    if (!url && process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: NEXT_PUBLIC_API_URL is missing in production!');
    }

    return url || 'http://localhost:4000';
};

export const API_URL = getApiUrl();
