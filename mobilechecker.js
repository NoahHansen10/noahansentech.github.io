 fetch('footer2.html')
  .then(response => response.text())
  .then(content => {
    console.log(content); // Add this line to check the fetched content
    footerContainer.innerHTML = content;
  })
  .catch(error => {
    console.error('Error fetching footer:', error);
  });

    // Function to detect if the user is using a mobile device
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Redirect to the mobile subdomain if user is on a mobile device
    if (isMobileDevice()) {
      window.location.href = "mobile"; // Replace with your mobile subdomain URL
    }
