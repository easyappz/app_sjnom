import instance from './axios';

export async function getComments({ listingId, ordering = '-likes' }) {
  try {
    const res = await instance.get(`/api/listings/${listingId}/comments/`, {
      params: { ordering },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createComment({ listingId, text }) {
  try {
    const res = await instance.post(`/api/listings/${listingId}/comments/`, { text });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function toggleLike({ commentId }) {
  try {
    const res = await instance.post(`/api/comments/${commentId}/like/`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
