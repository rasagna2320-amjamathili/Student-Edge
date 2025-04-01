import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  _id: { type: String, default: 'visitorCount' }, // Fixed ID
  count: { type: Number, default: 0 }
});

const UserLoginCount = mongoose.model('UserLoginCount', visitorSchema);

export { UserLoginCount };
