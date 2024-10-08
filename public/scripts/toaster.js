function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block';
  const bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'none';
}

// Handle form submission
document.getElementById('resultForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(this);

  fetch('/submitresult', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (response.ok) {
          showToast(); // Show toast on success
          this.reset(); // Reset the form
      } else {
          console.error('Error:', response.statusText);
      }
  })
  .catch(error => console.error('Error:', error));
});
