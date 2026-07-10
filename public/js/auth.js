const API_URL = 'http://localhost:5000/api';

// Handle Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('role').value;

  if (password !== confirmPassword) {
    alert('كلمات المرور غير متطابقة');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, phone, password, role })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('تم التسجيل بنجاح!');
      window.location.href = '/dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('حدث خطأ أثناء التسجيل');
  }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('تم تسجيل الدخول بنجاح!');
      window.location.href = '/dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('حدث خطأ أثناء تسجيل الدخول');
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function getToken() {
  return localStorage.getItem('token');
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}
