import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState(""); 
    const [results, setResults] = useState([]); 
    const userId = localStorage.getItem("user"); 

    useEffect(() => {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        document.querySelector(".main-content").style.marginTop = `${navbarHeight}px`;
    }, []); 

    const handleLogout = () => {
        localStorage.removeItem("user"); 
        navigate("/login"); 
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const response = await api.get(`/users/search?query=${query}`);
            setResults(response.data); 
        } catch (error) {
            console.error("Failed to search users:", error);
        }
    };

    const handleResultClick = (id) => {
        setResults([]); 
        if (id) {
            navigate(`/user/${id}`); 
        } else {
            console.error("Invalid ID for navigation");
        }
    };
    

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <div className="navbar-brand no-click">MySocialApp</div>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {!userId && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            )}
                            {userId && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/user/${userId}`}>My Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                        <form className="d-flex ms-auto" onSubmit={handleSearch}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search users"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
                {results.length > 0 && (
                    <ul className="list-group position-absolute" style={{ top: "100%", zIndex: 1000 }}>
                        {results.map((user) => (
                            <li
                                key={user._id}
                                className="list-group-item"
                                onClick={() => handleResultClick(user._id)}
                            >
                                {user.username}
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
            <div className="main-content">
                {/* pages */}
            </div>
        </>
    );
};

export default Navbar;
