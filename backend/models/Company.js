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


CompanySchema.index({ name: 'text' });

export default mongoose.model('Company', CompanySchema);