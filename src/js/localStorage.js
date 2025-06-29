export function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function addToFavorites(book) {
  const current = loadFromLocalStorage('favorites') || [];
  const exists = current.find(b => b.id === book.id);
  if (!exists) {
    current.push(book);
    saveToLocalStorage('favorites', current);
  }
}