const headerContainer = document.querySelector('header');
const footerContainer = document.querySelector('footer');
const navContainer = document.querySelector('nav');

fetch('/components/header-brand.html')
  .then(response => response.text())
  .then(content => {
    if (headerContainer) {
      headerContainer.innerHTML = content;
    }
  })
  .catch(error => {
    console.error('Error fetching header content:', error);
  });

fetch('/components/navbar.html')
  .then(response => response.text())
  .then(content => {
    if (navContainer) {
      navContainer.innerHTML = content;
    }
  })
  .catch(error => {
    console.error('Error fetching navbar:', error);
  });

fetch('/components/footer-mobile.html')
  .then(response => response.text())
  .then(content => {
    if (footerContainer) {
      footerContainer.innerHTML = content;
    }
  })
  .catch(error => {
    console.error('Error fetching footer:', error);
  });
