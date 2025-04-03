const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');
const app = express();

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/yemekblog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB bağlantısı başarılı"))
.catch((err) => console.log("MongoDB bağlantı hatası:", err));

// EJS template engine ayarı
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Public klasörü (CSS, JS, img)
app.use(express.static(path.join(__dirname, 'public')));

// Form verisi parse
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

// CSRF
app.use(csrf());

// CSRF token'ı her sayfaya gönder
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Basit anasayfa route
app.get('/', (req, res) => {
  res.render('index');
});

// Sunucuyu başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
app.use('/recipes', recipeRoutes);
