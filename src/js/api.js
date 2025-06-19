
const API_KEY = "AIzaSyDfEnqZjIJjx-1ZBLlV5uaQAYP2cz5Pdoc";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const MAX_RESULTS = 10;

export async function searchBooks(query) {
  const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items || [];
}
