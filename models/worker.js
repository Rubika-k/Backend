import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  profilePicture: { type: String },
  address: { type: String },
  experience: { type: Number, default: 0 },
  category: { type:mongoose.Schema.Types.ObjectId, ref: "Category" },
  isVerified: { type: Boolean, default: false },
  registrationFeePaid: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  nextAvailableTime: { type: Date }, //
  createdAt: { type: Date, default: Date.now }
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
