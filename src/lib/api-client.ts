export const apiClient = async (url: string, options: RequestInit = {}) => {
    // Implement common fetch logic
    return fetch(url, options);
};
