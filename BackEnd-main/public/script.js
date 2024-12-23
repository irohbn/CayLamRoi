document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupImage = document.querySelector('.popup-image');
    const popupTitle = document.querySelector('.popup-title');
    const popupAuthor = document.querySelector('.popup-author');
    const popupGenre = document.querySelector('.popup-genre');
    const popupDescription = document.querySelector('.popup-description');
    const closePopupButton = document.querySelector('.close-popup');
  
    document.querySelectorAll('.open-popup').forEach(button => {
      button.addEventListener('click', function() {
        const bookId = this.getAttribute('data-id');
  
        fetch(`/book/${bookId}`)
          .then(response => response.json())
          .then(book => {
            popupImage.src = book.image;
            popupTitle.textContent = book.title;
            popupAuthor.textContent = `Author: ${book.author}`;
            popupGenre.textContent = `Genre: ${book.genre}`;
            popupDescription.textContent = book.description;
            popupOverlay.style.display = 'flex';
          });
      });
    });
  
    closePopupButton.addEventListener('click', () => {
      popupOverlay.style.display = 'none';
    });
  
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
      }
    });
  });
  