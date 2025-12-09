const API_URL = 'https://geladinho-digital-card-production.up.railway.app//api';
let authToken = sessionStorage.getItem('authToken');
let products = [];
let sortableInstance = null;

// ==========================================
// AUTHENTICATION
// ==========================================
function checkAuth() {
    if (!authToken) {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-content').style.display = 'none';
        return false;
    }
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    return true;
}

async function login(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (res.ok) {
            authToken = `Bearer ${data.token}`;
            sessionStorage.setItem('authToken', authToken);
            checkAuth();
            loadProducts();
            showToast('Login realizado com sucesso', 'success');
        } else {
            showToast(data.error || 'Erro ao entrar', 'error');
        }
    } catch (err) {
        showToast('Erro de conexão', 'error');
    }
}

function logout() {
    sessionStorage.removeItem('authToken');
    authToken = null;
    checkAuth();
}

// ==========================================
// PRODUCTS CRUD
// ==========================================
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        products = await res.json();
        renderProducts(products);
    } catch (err) {
        showToast('Erro ao carregar produtos', 'error');
    }
}

function renderProducts(list) {
    const listEl = document.getElementById('product-list');
    listEl.innerHTML = '';

    list.forEach(item => {
        const el = document.createElement('div');
        el.className = 'product-item';
        el.setAttribute('data-id', item.id);
        el.innerHTML = `
            <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
            <img src="${item.image}" alt="${item.name}" class="product-thumb">
            <div class="product-info">
                <div class="product-name">${escapeHtml(item.name)}</div>
                <div class="product-desc">${escapeHtml(item.description)}</div>
                <div class="product-meta">
                    <span style="color: var(--primary); font-weight: bold;">R$ ${item.price.toFixed(2)}</span>
                    <span class="badge ${item.available ? 'badge-success' : 'badge-gray'}">
                        ${item.available ? 'Disponível' : 'Indisponível'}
                    </span>
                </div>
            </div>
            <div class="product-actions">
                <button onclick="openModal('${item.id}')" class="btn btn-secondary btn-icon" title="Editar">
                    <i class="fas fa-pen"></i>
                </button>
                <button onclick="confirmDelete('${item.id}')" class="btn btn-danger btn-icon" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listEl.appendChild(el);
    });

    initSortable();
}

// Search Filter
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
    renderProducts(filtered);
});

// ==========================================
// MODAL & FORMS
// ==========================================
const modal = document.getElementById('product-modal');
const form = document.getElementById('product-form');
let currentEditId = null;

function openModal(id = null) {
    currentEditId = id;
    const title = document.getElementById('modal-title');

    // Reset Form
    form.reset();
    document.getElementById('preview-image').src = '';
    document.querySelector('.preview-placeholder').style.display = 'block';

    if (id) {
        const p = products.find(p => p.id === id);
        if (!p) return;

        title.textContent = 'Editar Produto';
        document.getElementById('inp-name').value = p.name;
        document.getElementById('inp-desc').value = p.description;
        document.getElementById('inp-price').value = p.price;
        document.getElementById('inp-available').checked = p.available;

        // Handle Image URL or File logic visually
        // For simplicity, we just clear file input. The API handles keeping old image if not sent.
        if (p.image) {
            document.getElementById('preview-image').src = p.image;
            document.querySelector('.preview-placeholder').style.display = 'none';
        }
    } else {
        title.textContent = 'Novo Produto';
        document.getElementById('inp-available').checked = true;
    }

    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Handle Image Preview
document.getElementById('inp-file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-image').src = e.target.result;
            document.querySelector('.preview-placeholder').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});
document.getElementById('inp-url').addEventListener('input', function (e) {
    // Only show preview if no file selected
    if (!document.getElementById('inp-file').files.length && e.target.value) {
        document.getElementById('preview-image').src = e.target.value;
        document.querySelector('.preview-placeholder').style.display = 'none';
    }
});

// Save Product
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('inp-name').value);
    formData.append('description', document.getElementById('inp-desc').value);
    formData.append('price', document.getElementById('inp-price').value);
    formData.append('available', document.getElementById('inp-available').checked);

    const fileInput = document.getElementById('inp-file');
    const urlInput = document.getElementById('inp-url');

    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
    } else if (urlInput.value) {
        formData.append('imageUrl', urlInput.value);
    }

    const url = currentEditId
        ? `${API_URL}/products/${currentEditId}`
        : `${API_URL}/products`;

    const method = currentEditId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Authorization': authToken },
            body: formData
        });

        if (res.ok) {
            showToast('Produto salvo com sucesso!', 'success');
            closeModal();
            loadProducts();
        } else {
            const err = await res.json();
            showToast(err.error || 'Erro ao salvar', 'error');
        }
    } catch (err) {
        showToast('Erro de conexão ao salvar', 'error');
    }
});

// ==========================================
// DRAG & DROP
// ==========================================
function initSortable() {
    const el = document.getElementById('product-list');
    if (sortableInstance) sortableInstance.destroy();

    sortableInstance = new Sortable(el, {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: async function () {
            // Get new order
            const orderedIds = Array.from(el.children).map(child => child.getAttribute('data-id'));

            // Send to backend
            try {
                await fetch(`${API_URL}/products/reorder`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({ orderedIds })
                });
                // Update local list (optional if we trust the UI)
            } catch (err) {
                showToast('Erro ao reordenar', 'error');
            }
        },
    });
}

// ==========================================
// UTILS
// ==========================================
function confirmDelete(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        deleteProduct(id);
    }
}

async function deleteProduct(id) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': authToken }
        });

        if (res.ok) {
            showToast('Produto removido', 'success');
            loadProducts();
        } else {
            showToast('Erro ao remover', 'error');
        }
    } catch (err) {
        showToast('Erro de conexão', 'error');
    }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${type === 'success' ? '✓' : '⚠'}</span> ${msg}`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', login);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    // document.getElementById('modal-overlay').addEventListener('click', (e) => {
    //    if(e.target.id === 'modal-overlay') closeModal();
    // }); // Optional: Click outside to close

    if (checkAuth()) {
        loadProducts();
    }
});
