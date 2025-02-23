import React, { useState, useEffect } from 'react';
import { search } from '../services/api';
import './SearchResults.css'; // Import the CSS file for styling

const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], companies: [] });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('name');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchResults = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await search(query, page, limit, sort);
            setResults(data);
        } catch (error) {
            setError('Error fetching search results');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (query) {
            fetchResults();
        }
    }, [page, limit, sort]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearch = () => {
        setPage(1); // Reset to the first page on new search
        fetchResults();
    };

    return (
        <div>
            <h1>Company and User Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <div>
                <label>
                    Sort by:
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>
                </label>
            </div>
            <button onClick={handleSearch}>Search</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div>
                {results.companies && results.companies.length > 0 && (
                    <div>
                        <h2>Companies</h2>
                        {results.companies.map((company) => (
                            <div key={company._id} className="card">
                                <h3>Company Name: {company.name}</h3>
                                <p>Hierarchy Level: {company.hierarchyLevel}</p>
                                <h4>Users</h4>
                                {company.users.map((user) => (
                                    <div key={user._id} className="user-card">
                                        <p>Name: {user.name}</p>
                                        <p>Email: {user.email}</p>
                                        <p>Role: {user.role}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                {results.users && results.users.length > 0 && (
                    <div>
                        <h2>Users</h2>
                        {results.users.map((user) => (
                            <div key={user._id} className="card">
                                <h3>Name:{user.name}</h3>
                                <p>Email:{user.email}</p>
                                <p>Role:{user.role}</p>
                                <p>Company: {user.company.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => handlePageChange(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default SearchResults;