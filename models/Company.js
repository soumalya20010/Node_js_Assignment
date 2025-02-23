import mongoose from 'mongoose';

const { Schema } = mongoose;

const CompanySchema = new Schema({
  name: { 
    type: String, 
    required: true,
    index: true 
  },
  parentCompany: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    default: null 
  },
  hierarchyLevel: { 
    type: Number, 
    default: 0 
  }
});

// Optional: Create a text index for full-text search on company name
CompanySchema.index({ name: 'text' });

export default mongoose.model('Company', CompanySchema);