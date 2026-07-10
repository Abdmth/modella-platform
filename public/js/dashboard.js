// Load user data
async function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            
            document.getElementById('userName').textContent = user.username;
            document.getElementById('walletBalance').textContent = `${data.wallet} د.ع`;
            document.getElementById('currentBalance').textContent = `${data.wallet} د.ع`;
            document.getElementById('subscriptionPlan').textContent = user.subscription.plan || 'مجاني';
            
            document.getElementById('profileUsername').value = user.username;
            document.getElementById('profileEmail').value = user.email;
            document.getElementById('profilePhone').value = user.phone;
            
            // Show store options if user is store owner
            if (user.role === 'store') {
                document.querySelectorAll('.store-only').forEach(el => el.style.display = 'block');
            }
            
            // Show admin options if user is admin
            if (user.role === 'admin') {
                document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
            }
            
            loadTransactions();
        } else {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load transactions
async function loadTransactions() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/users/wallet/transactions', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const transactions = await response.json();
            const container = document.getElementById('transactionsList');
            
            if (transactions.length === 0) {
                container.innerHTML = '<p class="text-muted">لا توجد عمليات بعد</p>';
                return;
            }
            
            container.innerHTML = transactions.map(t => `
                <div class="p-3 border-bottom">
                    <div class="d-flex justify-content-between">
                        <span>${t.description}</span>
                        <span class="text-${t.type === 'deposit' ? 'success' : 'danger'}">
                            ${t.type === 'deposit' ? '+' : '-'}${t.amount}
                        </span>
                    </div>
                    <small class="text-muted">${new Date(t.createdAt).toLocaleDateString('ar-IQ')}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    
    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                if (section) {
                    section.style.display = 'block';
                }
                
                link.classList.add('active');
            }
        });
    });
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            
            try {
                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: document.getElementById('profileUsername').value,
                        phone: document.getElementById('profilePhone').value
                    })
                });
                
                if (response.ok) {
                    alert('تم حفظ التغييرات بنجاح');
                }
            } catch (error) {
                alert('حدث خطأ في الحفظ');
            }
        });
    }
});

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}