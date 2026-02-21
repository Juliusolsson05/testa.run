export type ApiClientConfig = {
  baseUrl: string;
};

export const createApiClient = (config: ApiClientConfig) => {
  return {
    get: async <T>(path: string): Promise<T> => {
      const res = await fetch(`${config.baseUrl}${path}`);
      if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`);
      return res.json() as Promise<T>;
    },
  };
};
