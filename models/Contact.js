import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
  },
  message: { 
    type: String, 
    required: [true, 'Message cannot be empty'],
    minlength: 10
  },
  reply: { 
    type: String,
    trim: true,
    default: null
  }, // Admin's reply, optional

  status: { 
    type: String, 
    enum: ['new', 'replied', 'archived'], 
    default: 'new' 
  },
  adminReply: String
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
