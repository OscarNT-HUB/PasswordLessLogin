require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_seguro_cambiame';
const DB_PATH = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

function loadUsers() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function generatePassword(length = 8) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%^&*()_+';
  const all = upper + lower + digits + special;
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendPasswordEmail(toEmail, name, password) {
  const mailOptions = {
    from: `"Auto Password Generator" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Tu contraseña generada - Auto Password Login',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #6200EE;">¡Bienvenido, ${name}!</h2>
        <p>Tu cuenta ha sido creada exitosamente.</p>
        <p>Esta es tu contraseña generada automáticamente:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 20px; letter-spacing: 2px; font-weight: bold; color: #333;">
          ${password}
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.
        </p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

app.post('/api/register', async (req, res) => {
  try {
    const { name, dob, email } = req.body;
    if (!name || !dob || !email) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const users = loadUsers();
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newUser = {
      id: uuidv4(),
      name,
      dob,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    await sendPasswordEmail(email, name, plainPassword);
    res.json({ success: true, message: 'Registro exitoso. Revisa tu correo para obtener la contraseña.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Error al registrar. Verifica tu conexión e intenta de nuevo.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' });
    }
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, dob: user.dob },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
