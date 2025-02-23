import Company from '../models/Company.js';
import User from '../models/User.js';

export const search = async (req, res) => {
    try {
        const { query, page = 1, limit = 5, sort = 'name' } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const regex = new RegExp(query, 'i');
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: { [sort]: 1 }
        };

        // Ensure indexes on the fields being searched
        await User.createIndexes({ name: 'text', email: 'text' });
        await Company.createIndexes({ name: 'text' });

        // Search users using an aggregation pipeline with a lookup to companies
        const users = await User.aggregate([
            { $match: { $or: [{ name: regex }, { email: regex }] } },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            { $unwind: '$companyDetails' },
            {
                $project: {
                    name: 1,
                    email: 1,
                    role: 1,
                    company: {
                        name: '$companyDetails.name',
                        hierarchyLevel: '$companyDetails.hierarchyLevel',
                        parentCompany: '$companyDetails.parentCompany'
                    }
                }
            },
            { $sort: { [sort]: 1 } }, // Apply sorting
            { $skip: options.skip }, // Apply pagination
            { $limit: options.limit } // Limit the number of user results
        ]);

        // Search companies using an aggregation pipeline with a lookup to users (limit users to 5)
        const companies = await Company.aggregate([
            { $match: { name: regex } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'company',
                    as: 'users'
                }
            },
            {
                $addFields: {
                    users: { $slice: ['$users', 5] }
                }
            },
            {
                $project: {
                    name: 1,
                    hierarchyLevel: 1,
                    users: {
                        name: 1,
                        email: 1,
                        role: 1
                    }
                }
            },
            { $sort: { [sort]: 1 } }, 
            { $skip: options.skip }, 
            { $limit: options.limit } 
        ]);

        const response = {};
        if (users.length > 0) {
            response.users = users;
        }
        if (companies.length > 0) {
            response.companies = companies;
        }

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};