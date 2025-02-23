import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    role: {
        type: String,
        default: 'user'
    }
});

UserSchema.index({ name: 'text', email: 'text' });

export default mongoose.model('User', UserSchema);