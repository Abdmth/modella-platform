const API_URL = 'http://localhost:5000/api';

// Check authentication
if (!localStorage.getItem('token')) {
  window.location.href = '/login.html';
}

// Get token from storage
function getToken() {
  return localStorage.getItem('token');
}

// Load user profile
async function loadProfile() {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const data = await response.json();
    const user = data.user;

    document.getElementById('userName').textContent = user.username;
    document.getElementById('profileUsername').value = user.username;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profilePhone').value = user.phone;
    document.getElementById('storeName').value = user.storeName || '';
    document.getElementById('storeDescription').value = user.storeDescription || '';
    document.getElementById('walletBalance').textContent = data.walletBalance + ' ريال';
    document.getElementById('walletBalanceDetail').textContent = data.walletBalance + ' ريال';
    document.getElementById('currentPlan').textContent = user.subscription?.plan || 'بدون اشتراك';
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// Update profile
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    username: document.getElementById('profileUsername').value,
    phone: document.getElementById('profilePhone').value,
    storeName: document.getElementById('storeName').value,
    storeDescription: document.getElementById('storeDescription').value
  };

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('تم تحديث الملف الشخصي بنجاح');
      loadProfile();
    } else {
      alert('حدث خطأ في التحديث');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Section Navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.dataset.section;
    showSection(sectionId);
    
    // Update active link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  
  const titles = {
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    models: 'العارضات',
    clothes: 'الملابس',
    wallet: 'المحفظة',
    subscriptions: 'الاشتراكات',
    settings: 'الإعدادات'
  };
  
  document.getElementById('pageTitle').textContent = titles[sectionId];
}

// Modal functions
function openAddModelModal() {
  document.getElementById('addModelModal').style.display = 'block';
}

function openAddClothingModal() {
  document.getElementById('addClothingModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

window.onclick = (event) => {
  const modal = document.querySelector('.modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Add Model
document.getElementById('addModelForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('modelName').value,
    measurements: {
      height: document.getElementById('modelHeight').value,
      chest: document.getElementById('modelChest').value,
      waist: document.getElementById('modelWaist').value
    }
  };

  try {
    const response = await fetch(`${API_URL}/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('تم إضافة العارضة بنجاح');
      closeModal('addModelModal');
      e.target.reset();
      loadModels();
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Load Models
async function loadModels() {
  try {
    const response = await fetch(`${API_URL}/models/my-models`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const models = await response.json();
    const container = document.getElementById('modelsList');
    
    container.innerHTML = models.map(model => `
      <div class="item-card">
        <h3>${model.name}</h3>
        <p>الطول: ${model.measurements.height}</p>
        <p>الصدر: ${model.measurements.chest}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadModels();
});
