import { DataProvider } from "@refinedev/core";
import { generateFilter, generateSort } from "@refinedev/simple-rest";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const httpClient = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response;
};

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async ({ resource, pagination, filters, sorters }) => {
    const url = new URL(`${API_URL}/${resource}`);

    // Pagination
    if (pagination) {
      const current = (pagination as any).current || 1;
      const pageSize = (pagination as any).pageSize || 10;
      url.searchParams.append("_start", String((current - 1) * pageSize));
      url.searchParams.append("_end", String(pageSize));
    }

    // Filters
    if (filters) {
      const generatedFilters = generateFilter(filters);
      Object.keys(generatedFilters).forEach((key) => {
        const value = generatedFilters[key];
        if (value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Sorters
    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        url.searchParams.append("_sort", _sort.join(","));
        url.searchParams.append("_order", _order.join(","));
      }
    }

    const response = await httpClient(url.toString());
    const data = await response.json();

    return {
      data: data.data || data,
      total: data.total || data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;
    const response = await httpClient(url);
    const data = await response.json();

    return {
      data: data.data || data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${API_URL}/${resource}`;
    const response = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(variables),
    });
    const data = await response.json();

    return {
      data: data.data || data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${API_URL}/${resource}/${id}`;
    const response = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(variables),
    });
    const data = await response.json();

    return {
      data: data.data || data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;
    const response = await httpClient(url, {
      method: "DELETE",
    });
    const data = await response.json();

    return {
      data: data.data || data,
    };
  },

  getMany: async ({ resource, ids }) => {
    const url = new URL(`${API_URL}/${resource}`);
    ids.forEach((id) => url.searchParams.append("id", String(id)));

    const response = await httpClient(url.toString());
    const data = await response.json();

    return {
      data: data.data || data,
    };
  },

  custom: async ({ url, method, payload, query, headers }) => {
    let requestUrl = `${API_URL}${url}`;

    if (query) {
      const queryParams = new URLSearchParams(query);
      requestUrl = `${requestUrl}?${queryParams.toString()}`;
    }

    const requestOptions: RequestInit = {
      method: method || "GET",
      headers: headers || {},
    };

    if (payload) {
      requestOptions.body = JSON.stringify(payload);
    }

    const response = await httpClient(requestUrl, requestOptions);

    const data = await response.json();

    return {
      data: data.data || data,
    };
  },
};
