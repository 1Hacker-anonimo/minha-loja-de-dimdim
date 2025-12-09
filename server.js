import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ==========================================
// CONFIGURAÇÃO
// ==========================================
const ADMIN_PASSWORD = 'admin123'; // EDITAR AQUI: Sua senha de administrador
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const STATIC_DIR = path.join(__dirname, 'admin'); // Pasta do painel admin

// Certificar que diretórios existem
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/admin', express.static(STATIC_DIR)); // Acessar em http://localhost:3000/admin
app.use('/uploads', express.static(UPLOADS_DIR)); // Acessar imagens

// Configuração do Upload (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        // Sanitizar nome do arquivo e adicionar timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'img-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    }
});

// Autenticação Simples (Middleware)
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    // Token fixo para simplificação do demo "s3cr3t-t0k3n" obtido no login
    if (token === 'Bearer s3cr3t-t0k3n') {
        next();
    } else {
        res.status(401).json({ error: 'Não autorizado' });
    }
};

// Helpers de Banco de Dados (JSON)
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// ==========================================
// ROTAS API
// ==========================================

// Login
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ token: 's3cr3t-t0k3n' });
    } else {
        res.status(401).json({ error: 'Senha incorreta' });
    }
});

// Listar Produtos
app.get('/api/products', (req, res) => {
    const products = readData();
    // Ordenar por 'order' index
    products.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(products);
});

// Criar Produto
app.post('/api/products', authMiddleware, upload.single('image'), (req, res) => {
    try {
        const products = readData();
        const { name, description, price, available, imageUrl, useLocalImage } = req.body;

        // Sanitização básica
        const cleanName = name.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const cleanDesc = description.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

        let imagePath = imageUrl;
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        }

        const newProduct = {
            id: Date.now().toString(),
            name: cleanName,
            description: cleanDesc,
            price: parseFloat(price),
            image: imagePath || 'https://placehold.co/100x100?text=Sem+Imagem',
            available: available === 'true',
            order: products.length // Adiciona ao final
        };

        products.push(newProduct);
        writeData(products);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Atualizar Produto
app.put('/api/products/:id', authMiddleware, upload.single('image'), (req, res) => {
    try {
        const products = readData();
        const index = products.findIndex(p => p.id === req.params.id);

        if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

        const { name, description, price, available, imageUrl } = req.body;

        // Atualizar campos se fornecidos
        if (name) products[index].name = name.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (description) products[index].description = description.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (price) products[index].price = parseFloat(price);
        if (available !== undefined) products[index].available = available === 'true';

        // Imagem: Se enviou arquivo, usa ele. Se enviou URL e não arquivo, usa URL. 
        if (req.file) {
            // (Opcional) Poderíamos deletar a imagem antiga aqui
            products[index].image = '/uploads/' + req.file.filename;
        } else if (imageUrl) {
            products[index].image = imageUrl;
        }

        writeData(products);
        res.json(products[index]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Deletar Produto
app.delete('/api/products/:id', authMiddleware, (req, res) => {
    let products = readData();
    const product = products.find(p => p.id === req.params.id);

    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    // (Opcional) Deletar arquivo de imagem local se existir
    // if (product.image.startsWith('/uploads/')) ...

    products = products.filter(p => p.id !== req.params.id);
    writeData(products);
    res.json({ success: true });
});

// Reordenar Produtos
app.patch('/api/products/reorder', authMiddleware, (req, res) => {
    const { orderedIds } = req.body; // Array de IDs na nova ordem
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'Formato inválido' });

    let products = readData();

    // Atualizar o campo 'order' de cada produto baseado no índice do orderedIds
    products.forEach(p => {
        const newIndex = orderedIds.indexOf(p.id);
        if (newIndex !== -1) {
            p.order = newIndex;
        }
    });

    writeData(products);
    res.json({ success: true, message: 'Ordem atualizada' });
});

// Inicialização
app.listen(PORT, () => {
    console.log(`\nServidor rodando em http://localhost:${PORT}`);
    console.log(`Painel Admin: http://localhost:${PORT}/admin`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/products`);
    console.log(`\nUse a senha '${ADMIN_PASSWORD}' para entrar no painel.`);
});
