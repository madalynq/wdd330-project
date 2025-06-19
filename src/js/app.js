import { searchBooks } from './api.js';
import { saveToLocalStorage, loadFromLocalStorage, addToFavorites } from './localStorage.js';

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
    saveToLocalStorage('lastSearch', books);
  }

  function renderBooks(books) {
    resultsContainer.innerHTML = '';
    if (!books.length) {
      resultsContainer.innerHTML = '<p>No books found.</p>';
      return;
    }

    books.forEach(book => {
      const info = book.volumeInfo || book;

      const card = document.createElement('div');
      card.className = 'book-card';

      const img = document.createElement('img');
      img.src = info.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150?text=No+Image';
      img.alt = info.title;

      const title = document.createElement('h3');
      title.textContent = info.title;

      const author = document.createElement('p');
      author.textContent = info.authors ? `by ${info.authors.join(', ')}` : 'No author listed';


      const favoriteButton = document.createElement('button');
      favoriteButton.textContent = '❤️ Favorite';
      favoriteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click from triggering details
        addToFavorites(info);
      });

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(author)
      card.appendChild(favoriteButton);
      
      card.addEventListener('click', async () => {
      card.classList.toggle('expanded');

      const existingDetails = card.querySelector('.more-info');
      if (existingDetails) {
        existingDetails.remove();
        return;
      }

      const moreInfo = document.createElement('div');
      moreInfo.className = 'more-info';

      const description = info.description || 'No description available.';
      let authorBio = 'Not available.';

      if (info.authors && info.authors.length > 0) {
        const author = info.authors[0];
        try {
          const res = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(author)}`);
          const data = await res.json();
          if (data.docs && data.docs[0] && data.docs[0].top_work) {
            authorBio = data.docs[0].top_work;
          }
        } catch (err) {
          console.error('Error fetching author bio:', err);
        }
      }

      moreInfo.innerHTML = `
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Author bio:</strong> ${authorBio}</p>
      `;

      card.appendChild(moreInfo);
    });


      // card.addEventListener('click', () => {
      //   showBookDetails(info);
      //   });

      resultsContainer.appendChild(card);
    });
  }

  function addToFavorites(bookInfo) {
    const favorites = loadFromLocalStorage('favorites') || [];
    const exists = favorites.some(b => b.title === bookInfo.title);
    if (!exists) {
      favorites.push(bookInfo);
      saveToLocalStorage('favorites', favorites);
      alert(`Added "${bookInfo.title}" to favorites!`);
    } else {
      alert('Already in favorites!');
    }
  }

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    handleSearch(query);
  });

  // On page load, check localStorage or show default books
  const previous = loadFromLocalStorage('lastSearch');
  if (previous && previous.length > 0) {
    renderBooks(previous);
  } else {
    handleSearch('bestsellers'); // Default search
  }

  const viewFavoritesBtn = document.getElementById('viewFavorites');
  viewFavoritesBtn.addEventListener('click', () => {
    const favorites = loadFromLocalStorage('favorites') || [];
    if (favorites.length === 0) {
      resultsContainer.innerHTML = '<p>No favorites saved yet.</p>';
    } else {
      renderBooks(favorites);
    }
  });
  

});


