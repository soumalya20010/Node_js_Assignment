import mongoose from 'mongoose';
import Company from '../models/Company.js';
import User from '../models/User.js';

export const createCompany = async (req, res) => {
    try {
        const { name, parentCompanyId } = req.body;

        // Validate input data
        if (!name) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        let hierarchyLevel = 0;
        let parentCompany = null;

        if (parentCompanyId) {
            // Validate parentCompanyId
            if (!mongoose.isValidObjectId(parentCompanyId)) {
                return res.status(400).json({ error: 'Invalid parent company ID' });
            }

            parentCompany = await Company.findById(parentCompanyId);
            if (!parentCompany) {
                return res.status(404).json({ error: 'Parent company not found' });
            }
            hierarchyLevel = parentCompany.hierarchyLevel + 1;
        }

        const company = new Company({
            name,
            parentCompany: parentCompany ? parentCompany._id : null,
            hierarchyLevel
        });

        const savedCompany = await company.save();

        res.status(201).json({
            companyId: savedCompany._id,
            hierarchyLevel: savedCompany.hierarchyLevel
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId).lean();
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

       
        const users = await User.find({ company: companyId }).lean();

        // Fetch sub-companies (companies that have this company as parent)
        const subCompanies = await Company.find({ parentCompany: companyId }).lean();

        res.json({
            company,
            users,
            subCompanies
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};