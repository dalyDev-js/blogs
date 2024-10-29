// src/services/api.js
import axios from "axios";

export async function fetchPosts(page = 1, perPage = 12) {
  try {
    const response = await axios.get("https://dev.to/api/articles", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
