import { searchBooks } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const resultsContainer = document.getElementById('bookResults');

  async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = '<p>Loading...</p>';
    const books = await searchBooks(query);
    renderBooks(books);
  }

  function renderBooks(books) {
    resultsContainer.innerHTML = '';
    if (books.length === 0) {
      resultsContainer.innerHTML = '<p>No books found.</p>';
      return;
    }

    books.forEach(book => {
      const info = book.volumeInfo;

      const card = document.createElement('div');
      card.className = 'book-card';

      const img = document.createElement('img');
      img.src = info.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150?text=No+Image';
      img.alt = info.title;

      const title = document.createElement('h3');
      title.textContent = info.title;

      const author = document.createElement('p');
      author.textContent = info.authors ? `by ${info.authors.join(', ')}` : 'No author listed';

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(author);

      resultsContainer.appendChild(card);
    });
  }

  searchButton.addEventListener('click', handleSearch);
});