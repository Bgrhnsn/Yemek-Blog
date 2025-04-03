const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { requireLogin, requireAdmin } = require('../middleware/auth');
const Comment = require('../models/Comment');



// Tarif listesi
router.get('/', async (req, res) => {
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  res.render('recipes/index', { recipes });
});

router.get('/admin', requireLogin, requireAdmin, (req, res) => {
  res.render('admin/index');
});

router.get('/:slug', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug });

    if (!recipe) return res.send('Tarif bulunamadı.');

    const comments = await Comment.find({ recipe: recipe._id }).sort({ createdAt: -1 });

    res.render('recipes/show', { recipe: { ...recipe.toObject(), comments } });
  } catch (err) {
    res.send('Hata: ' + err.message);
  }
});




// Yeni tarif formu (GET)
router.get('/new', (req, res) => {
  res.render('recipes/new');
});

// Tarif ekleme işlemi (POST)
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.redirect(`/recipes/${recipe.slug}`);
  } catch (err) {
    res.send('Tarif eklenemedi: ' + err.message);
  }
});
// Tarif detay sayfası (slug)
router.get('/:slug', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug });
    if (!recipe) {
      return res.send('Tarif bulunamadı.');
    }
    res.render('recipes/show', { recipe });
  } catch (err) {
    res.send('Hata: ' + err.message);
  }
});


module.exports = router;
