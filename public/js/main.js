// Load designs
async function loadDesigns() {
    try {
        const response = await fetch('/api/clothes');
        const data = await response.json();
        
        const container = document.getElementById('designs-container');
        container.innerHTML = '';
        
        data.clothes.slice(0, 6).forEach(item => {
            const card = `
                <div class="col-md-6 col-lg-4">
                    <div class="design-card">
                        <img src="${item.originalImage}" alt="${item.name}">
                        <div class="design-card-body">
                            <h6 class="design-card-title">${item.name}</h6>
                            <p class="text-muted mb-3">${item.category}</p>
                            <p class="text-success fw-bold">\$${item.price || 'تواصل'}</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Error loading designs:', error);
    }
}

// Load subscriptions
async function loadSubscriptions() {
    try {
        const response = await fetch('/api/subscriptions');
        const subscriptions = await response.json();
        
        const container = document.getElementById('subscriptions-container');
        container.innerHTML = '';
        
        subscriptions.forEach((sub, index) => {
            const featured = index === 1 ? 'featured' : '';
            const card = `
                <div class="col-md-6 col-lg-4">
                    <div class="subscription-card ${featured}">
                        <h4>${sub.name}</h4>
                        <div class="subscription-price">\$${sub.price}</div>
                        <p class="text-muted mb-3">كل ${sub.duration} يوم</p>
                        <ul class="subscription-features list-unstyled">
                            ${sub.features.map(f => `<li><i class="fas fa-check text-success me-2"></i>${f}</li>`).join('')}
                        </ul>
                        <button class="btn btn-primary w-100" onclick="subscribeNow('${sub._id}')">اشترك الآن</button>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Error loading subscriptions:', error);
    }
}

// Subscribe
function subscribeNow(subId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    alert('يتم المعالجة... سيتم إعادة توجيهك إلى لوحة التحكم');
}

// Contact form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: contactForm.querySelector('input[type="text"]').value,
                        email: contactForm.querySelector('input[type="email"]').value,
                        phone: contactForm.querySelector('input[type="tel"]').value,
                        subject: contactForm.querySelectorAll('input')[3].value,
                        message: contactForm.querySelector('textarea').value
                    })
                });
                
                if (response.ok) {
                    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
                    contactForm.reset();
                }
            } catch (error) {
                alert('حدث خطأ في الإرسال');
            }
        });
    }
    
    loadDesigns();
    loadSubscriptions();
});