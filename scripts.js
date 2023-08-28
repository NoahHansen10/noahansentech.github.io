const headerContainer = document.querySelector('header');
const footerContainer = document.querySelector('footer');
const navContainer = document.querySelector('nav');

fetch('/header2.html')
  .then(response => response.text())
  .then(content => {
    headerContainer.innerHTML = content;
  })
  .catch(error => {
    console.error('Error fetching header content:', error);
  });

fetch('/navbar.html')
  .then(response => response.text())
  .then(content => {
    navContainer.innerHTML = content;
  })
  .catch(error => {
    console.error('Error fetching navbar:', error);
  });

fetch('/footer.html')
  .then(response => response.text())
  .then(content => {
    footerContainer.innerHTML = content;
  })
  .catch(error => {
    console.error('Error fetching footer:', error);
  });
