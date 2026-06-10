document.addEventListener('DOMContentLoaded', () => {
  const filterInput = document.getElementById('courseFilter');
  if (filterInput) {
    filterInput.addEventListener('input', () => {
      const search = filterInput.value.toLowerCase().trim();
      document.querySelectorAll('.course-card').forEach(card => {
        const title = card.dataset.title || '';
        const desc = card.dataset.description || '';
        card.style.display = title.includes(search) || desc.includes(search) ? '' : 'none';
      });
    });
  }

  const searchInput = document.getElementById('liveSearch');
  const searchResults = document.getElementById('searchResults');
  if (searchInput && searchResults) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const q = searchInput.value.trim();
      if (q.length < 2) { searchResults.innerHTML = ''; searchResults.classList.add('d-none'); return; }
      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          const data = await res.json();
          if (data.length === 0) {
            searchResults.innerHTML = '<div class="p-2 text-muted">No courses found</div>';
          } else {
            searchResults.innerHTML = data.slice(0, 10).map(c =>
              `<a href="/course/${c.id}" class="list-group-item list-group-item-action">
                <strong>${c.name}</strong> <small class="text-muted">— ${c.category_name}</small>
                <br><small>${c.description || ''}</small>
              </a>`
            ).join('');
          }
          searchResults.classList.remove('d-none');
        } catch (e) {
          console.error('Search error:', e);
        }
      }, 300);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#liveSearch') && !e.target.closest('#searchResults')) {
        searchResults.classList.add('d-none');
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
      const phone = signupForm.phone.value.trim();
      const phonePattern = /^(\+250|\+234|\+27|\+233|\+225|\+254|\+256|\+237|\+212|\+213|\+1|\+44|\+33|\+49|\+20|\+966|\+91|\+234|\+27|\+81|\+7|\+55|\+34|\+39|\+90|\+62|\+60|\+82|\+972|\+351|\+358|\+46|\+48|\+380|\+998|\+84|\+66|\+63|\+64|\+61|\+64|\+1)[0-9]{7,15}$/;
      if (!phonePattern.test(phone)) { signupForm.phone.setCustomValidity('Please enter a valid phone number (e.g. +250..., +234..., +1...)'); }
      else { signupForm.phone.setCustomValidity(''); }
      const email = signupForm.email.value.trim();
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) { signupForm.email.setCustomValidity('Please enter a valid email address.'); }
      else { signupForm.email.setCustomValidity(''); }
      const pw = signupForm.password.value;
      const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$/;
      if (!pwPattern.test(pw)) { signupForm.password.setCustomValidity('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'); }
      else { signupForm.password.setCustomValidity(''); }
      const cpw = signupForm.confirmPassword.value;
      if (pw !== cpw) { signupForm.confirmPassword.setCustomValidity('Passwords do not match'); }
      else { signupForm.confirmPassword.setCustomValidity(''); }
    });
  }

  const courseDetailForm = document.getElementById('enquiryForm');
  if (courseDetailForm) {
    courseDetailForm.addEventListener('submit', function(e) {
      const name = courseDetailForm.name.value.trim();
      const email = courseDetailForm.email.value.trim();
      if (!name || !email) {
        e.preventDefault();
        alert('Please fill in name and email.');
      }
    });
  }

  document.querySelectorAll('.register-course-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const courseId = this.dataset.courseId;
      const messageEl = document.getElementById('registerMessage');
      try {
        this.disabled = true;
        this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registering...';
        const res = await fetch(`/api/course/${courseId}/register`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          messageEl.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
          this.textContent = 'Registered ✓';
          this.classList.remove('btn-primary');
          this.classList.add('btn-success');
        } else {
          messageEl.innerHTML = `<div class="alert alert-warning">${data.error}</div>`;
          this.disabled = false;
          this.textContent = 'Register for this Course';
        }
      } catch (e) {
        messageEl.innerHTML = '<div class="alert alert-danger">Registration failed. Please try again.</div>';
        this.disabled = false;
        this.textContent = 'Register for this Course';
      }
    });
  });
});
