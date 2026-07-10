const API_URL = 'http://localhost:5000/api';

// Load subscriptions on homepage
async function loadSubscriptions() {
  try {
    const response = await fetch(`${API_URL}/subscriptions`);
    const subscriptions = await response.json();
    
    const container = document.getElementById('subscriptionsContainer');
    if (!container) return;
    
    container.innerHTML = subscriptions.map(sub => `
      <div class="subscription-card">
        <h3>${sub.name}</h3>
        <div class="price">${sub.price} ريال</div>
        <ul>
          ${sub.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button class="btn btn-primary" onclick="selectSubscription('${sub._id}')">
          اشترك الآن
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading subscriptions:', error);
  }
}

function selectSubscription(subscriptionId) {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
  } else {
    window.location.href = '/dashboard.html';
  }
}

// Load contact form
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    name: e.target[0].value,
    email: e.target[1].value,
    phone: e.target[2].value,
    subject: e.target[3].value,
    message: e.target[4].value
  };

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا');
      e.target.reset();
    } else {
      alert('حدث خطأ أثناء إرسال الرسالة');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('حدث خطأ في الاتصال بالخادم');
  }
});

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSubscriptions();
});
