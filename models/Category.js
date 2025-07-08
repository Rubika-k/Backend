// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // ex: "Electrical Services"
  icon: { type: String, default: '' },
  description: { type: String, default: '' },  // NEW
  image: { type: String, default: '' },        // NEW
  workers: { type: Number, default: 0 },       // NEW
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
