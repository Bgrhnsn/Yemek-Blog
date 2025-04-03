const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// Yorum ekleme
router.post('/:slug/comments', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug });
    if (!recipe) return res.send('Tarif bulunamadı.');

    const comment = new Comment({
      recipe: recipe._id,
      username: req.body.username || 'Anonim',
      text: req.body.text
    });

    await comment.save();
    res.redirect(`/recipes/${recipe.slug}`);
  } catch (err) {
    res.send('Yorum eklenemedi: ' + err.message);
  }
});

module.exports = router;
