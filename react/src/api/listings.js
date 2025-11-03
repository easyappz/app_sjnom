import instance from './axios';

export async function getTopListings({ limit = 20, offset = 0, ordering = '-view_count' } = {}) {
  try {
    const res = await instance.get('/api/listings/', {
      params: { limit, offset, ordering },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function resolveListing({ url }) {
  try {
    const res = await instance.post('/api/listings/resolve/', { url });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getListing({ id }) {
  try {
    const res = await instance.get(`/api/listings/${id}/`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
