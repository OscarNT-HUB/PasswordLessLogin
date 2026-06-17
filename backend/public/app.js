const API_URL = 'https://passwordless-login-vc59.onrender.com';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function setLoading(form, loading) {
  const btn = form.querySelector('button');
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  text.style.display = loading ? 'none' : '';
  loader.style.display = loading ? '' : 'none';
  btn.disabled = loading;
}

async function apiCall(endpoint, body) {
  const res = await fetch(API_URL + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  setLoading(form, true);
  try {
    const data = await apiCall('/api/register', {
      name: document.getElementById('reg-name').value.trim(),
      dob: document.getElementById('reg-dob').value,
      email: document.getElementById('reg-email').value.trim(),
    });
    if (data.success) {
      showToast(data.message, 'success');
      form.reset();
      showScreen('login');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Error de conexión. Verifica tu internet.', 'error');
  } finally {
    setLoading(form, false);
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  setLoading(form, true);
  try {
    const data = await apiCall('/api/login', {
      email: document.getElementById('login-email').value.trim(),
      password: document.getElementById('login-password').value,
    });
    if (data.success) {
      showToast('Sesión iniciada correctamente', 'success');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showHome(data.user);
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Error de conexión. Verifica tu internet.', 'error');
  } finally {
    setLoading(form, false);
  }
});

function showHome(user) {
  document.getElementById('home-name').textContent = 'Bienvenido, ' + user.name;
  document.getElementById('home-email').textContent = user.email;
  document.getElementById('home-name-detail').textContent = user.name;
  document.getElementById('home-email-detail').textContent = user.email;
  document.getElementById('home-dob-detail').textContent = user.dob;
  document.getElementById('home-avatar').textContent = user.name.charAt(0).toUpperCase();
  showScreen('home');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showScreen('login');
}

const savedUser = localStorage.getItem('user');
if (savedUser) {
  showHome(JSON.parse(savedUser));
}
