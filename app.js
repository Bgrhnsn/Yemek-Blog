const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const path = require('path');
//route
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commentRoutes = require('./routes/commentRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');

//model
const Visit = require('./models/Visit');
const Announcement = require('./models/Announcement');




const app = express();

// 🔌 SOCKET.IO Kurulumu
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);





// 🌐 MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/yemekblog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB bağlantısı başarılı"))
.catch((err) => console.log("MongoDB bağlantı hatası:", err));

// 🔧 View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 📁 Public klasör
app.use(express.static(path.join(__dirname, 'public')));

// 🧾 Form verisi
app.use(express.urlencoded({ extended: true }));

// 🧠 Session
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

// 🛡️ CSRF
app.use(csrf());

// 📊 Ziyaretçi Sayacı
app.use(async (req, res, next) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit();
    }
    visit.count += 1;
    await visit.save();
    res.locals.visitCount = visit.count;
    next();
  } catch (err) {
    console.log("Ziyaretçi sayacı hatası:", err);
    next();
  }
});

// 🛡️ CSRF Token View'a Gönder
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// 🏠 Anasayfa
app.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.render('index', { announcements });
  } catch (err) {
    console.log("Duyuru çekme hatası:", err);
    res.render('index', { announcements: [] });
  }
});

// 🛣️ Route'lar
app.use('/recipes', recipeRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use('/recipes', commentRoutes); // slug için
const announcementRoutes = require('./routes/announcementRoutes');
app.use(announcementRoutes);
app.use(sitemapRoutes);

// 🟢 Online Kullanıcı Sayısı
let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('updateOnlineUsers', onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('updateOnlineUsers', onlineUsers);
  });
});

// 🔥 SUNUCU BAŞLAT
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

