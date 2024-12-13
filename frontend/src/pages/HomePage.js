import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    const [statuses, setStatuses] = useState([]);
    const [newStatus, setNewStatus] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await api.get("/api/status");
                console.log("Fetched statuses:", response.data); // Debugging log
                setStatuses(response.data || []);
            } catch (error) {
                console.error("Failed to fetch statuses:", error.response?.data || error.message);
                setStatuses([]);
            }
        };

        fetchStatuses();
    }, []);

    // Create new status
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newStatus.trim() && !newImage) {
            alert("Status or image is required");
            return;
        }

        const formData = new FormData();
        formData.append("content", newStatus);
        if (newImage) {
            formData.append("image", newImage);
        }

        try {
            const response = await api.post("/api/status", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("New post response:", response.data); // Debugging log
            setStatuses((prevStatuses) => [response.data, ...prevStatuses]);
            setNewStatus("");
            setNewImage(null);
        } catch (error) {
            console.error("Failed to create status:", error.response?.data || error.message);
            alert("Failed to create status");
        }
    };

    // Start editing a status
    const handleEdit = (status) => {
        setEditingStatus(status._id);
        setEditContent(status.content);
    };

    // Submit edited status
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) {
            alert("Edited content cannot be empty");
            return;
        }

        try {
            const response = await api.put(`/api/status/${editingStatus}`, { content: editContent });
            console.log("Edit response:", response.data); // Debugging log
            setStatuses((prevStatuses) =>
                prevStatuses.map((status) =>
                    status._id === editingStatus
                        ? { ...status, content: response.data.content }
                        : status
                )
            );
            setEditingStatus(null);
            setEditContent("");
        } catch (error) {
            console.error("Failed to update status:", error.response?.data || error.message);
            alert("Failed to update status");
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingStatus(null);
        setEditContent("");
    };

    // Delete a status
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this status?")) {
            try {
                await api.delete(`/api/status/${id}`);
                setStatuses((prevStatuses) => prevStatuses.filter((status) => status._id !== id));
            } catch (error) {
                console.error("Failed to delete status:", error.response?.data || error.message);
                alert("Failed to delete status");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Home</h1>

            {localStorage.getItem("token") && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            placeholder="What's on your mind?"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setNewImage(e.target.files[0])}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Post
                    </button>
                </form>
            )}

            {statuses.map((status) => (
                <div key={status._id || Math.random()} className="card mb-3">
                    <div className="card-body">
                        {editingStatus === status._id ? (
                            <form onSubmit={handleEditSubmit}>
                                <textarea
                                    className="form-control mb-2"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <button className="btn btn-success btn-sm me-2" type="submit">
                                    Save
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <p className="card-text">
                                    <strong>
                                        {status.userId && status.userId._id ? (
                                            <Link to={`/user/${status.userId._id}`}>
                                                {status.userId.username || "Unknown User"}
                                            </Link>
                                        ) : (
                                            "Unknown User"
                                        )}
                                    </strong>
                                    : {status.content || "No content available"}
                                </p>
                                {status.image && (
                                    <img
                                        src={`http://localhost:8080${status.image}`} 
                                        alt="Status"
                                        className="img-fluid mb-2"
                                        style={{ maxHeight: "300px", objectFit: "cover" }}
                                    />
                                )}

                                <small className="text-muted">
                                    {status.timestamp
                                        ? new Date(status.timestamp).toLocaleString()
                                        : "No timestamp available"}
                                </small>
                                {localStorage.getItem("user") === (status.userId?._id || "") && (
                                    <>
                                        <button
                                            className="btn btn-primary btn-sm ms-2"
                                            onClick={() => handleEdit(status)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm ms-2"
                                            onClick={() => handleDelete(status._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HomePage;
