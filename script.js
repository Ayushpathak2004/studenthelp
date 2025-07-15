// Modal interactivity for 'Report Found Item'
document.addEventListener('DOMContentLoaded', function () {
  const openModalBtn = document.getElementById('openFoundModal');
  const closeModalBtn = document.getElementById('closeFoundModal');
  const modal = document.getElementById('foundModal');

  if (openModalBtn && closeModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
      }, 10);
    });

    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0');
      setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }, 300);
    });

    // Optional: Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModalBtn.click();
      }
    });
  }
});

// In-memory array to store found items
let foundItems = [];

// Helper to render items
function renderItems(items) {
  const itemList = document.getElementById('itemList');
  if (!itemList) return;
  if (!items.length) {
    itemList.innerHTML = '<div class="text-center text-gray-500">No items to display.</div>';
    return;
  }
  itemList.innerHTML = items.map(item => `
    <div class="bg-white rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row gap-4 items-center">
      ${item.photo ? `<img src="${item.photo}" alt="Item photo" class="w-24 h-24 object-cover rounded-md border" />` : ''}
      <div class="flex-1">
        <h4 class="text-lg font-bold mb-1">${item.name}</h4>
        <p class="text-gray-700 mb-1">${item.description}</p>
        <div class="text-sm text-gray-500 mb-1">Location: ${item.location} | Date: ${item.date}</div>
        <div class="text-sm text-gray-600">Contact: ${item.contact}</div>
      </div>
    </div>
  `).join('');
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('hidden');
  }, 2000);
}

// Handle found item form submission
const foundForm = document.getElementById('foundForm');
if (foundForm) {
  foundForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const [nameInput, descInput, locSelect, dateInput, photoInput, contactInput] = foundForm.elements;
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const location = locSelect.value;
    const date = dateInput.value;
    const contact = contactInput.value.trim();
    let photo = '';
    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (event) {
        photo = event.target.result;
        foundItems.unshift({ name, description, location, date, contact, photo });
        renderItems(foundItems);
        showToast('Item reported successfully!');
        foundForm.reset();
        document.getElementById('closeFoundModal').click();
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      foundItems.unshift({ name, description, location, date, contact, photo: '' });
      renderItems(foundItems);
      showToast('Item reported successfully!');
      foundForm.reset();
      document.getElementById('closeFoundModal').click();
    }
  });
}

// Search/filter logic
const searchForm = document.querySelector('form');
if (searchForm) {
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const keyword = searchForm.elements[0].value.trim().toLowerCase();
    const location = searchForm.elements[1].value;
    let filtered = foundItems;
    if (keyword) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    }
    if (location && location !== 'All Campus') {
      filtered = filtered.filter(item => item.location === location);
    }
    renderItems(filtered);
  });
}

// Initial render
renderItems(foundItems); 