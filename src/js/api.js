
const API_KEY = "AIzaSyDfEnqZjIJjx-1ZBLlV5uaQAYP2cz5Pdoc";
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query) {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=10`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error('Failed to fetch books:', err);
    return [];
  }
}
