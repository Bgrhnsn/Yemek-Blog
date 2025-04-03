const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Announcement = require('../models/Announcement');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const announcements = await Announcement.find();

    let urls = [];

    // Anasayfa
    urls.push(`<url><loc>http://localhost:3000/</loc></url>`);

    // Tarifler
    recipes.forEach(recipe => {
      urls.push(`<url><loc>http://localhost:3000/recipes/${recipe.slug}</loc></url>`);
    });

    // Duyurular (isteğe bağlı)
    announcements.forEach(a => {
      urls.push(`<url><loc>http://localhost:3000/</loc></url>`);
    });

    // XML cevabı
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Sitemap oluşturulamadı: ' + err.message);
  }
});

module.exports = router;
