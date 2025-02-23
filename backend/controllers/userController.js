import User from '../models/User.js';
import Company from '../models/Company.js';

export const createUser = async (req, res) => {
    try {
        const { name, email, companyId } = req.body;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email must be unique' });
        }
        
        const user = new User({
            name,
            email,
            company: companyId,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            userId: user._id,
            companyId: user.company,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('company').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};