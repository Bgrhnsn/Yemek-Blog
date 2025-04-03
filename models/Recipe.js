const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: String,
  content: String,
  category: String,
  image: String, // ileride dosya yüklemeye uygun olacak
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Slug otomatik oluşturulsun
recipeSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);
