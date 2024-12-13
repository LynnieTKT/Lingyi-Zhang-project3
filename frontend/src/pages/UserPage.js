import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import "../styles/UserPage.css";

function UserPage() {
  const { id } = useParams(); 
  const [user, setUser] = useState(null); 
  const [statuses, setStatuses] = useState([]); 
  const [description, setDescription] = useState(""); 
  const [isEditingDescription, setIsEditingDescription] = useState(false); 


useEffect(() => {
  const fetchData = async () => {
    try {
      if (!id) throw new Error("User ID not defined");
      const userResponse = await api.get(`/api/users/${id}`);
      const statusesResponse = await api.get(`/api/status/user/${id}`);
      setUser(userResponse.data);
      setStatuses(statusesResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
    }
  };

  fetchData();
}, [id]);


  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${id}`, { description });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Page</h1>
      {user ? (
        <div>
          <h2>{user.username}</h2>
          <div>
            {isEditingDescription ? (
              <form onSubmit={handleDescriptionSubmit}>
                <label>
                  Description:
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <button type="submit">Update</button>
              </form>
            ) : (
              <div>
                <p>Description: {user.description || "No description provided"}</p>
                <button onClick={() => setIsEditingDescription(true)}>Edit Description</button>
              </div>
            )}
          </div>
          <h3>Statuses</h3>
          {statuses.length > 0 ? (
            statuses.map((status) => (
              <div key={status._id} className="card mb-3">
                <div className="card-body">
                  <p>{status.content}</p>
                  {status.image && <img src={status.image} alt="Status" className="img-fluid" />}
                  <small className="text-muted">
                    {new Date(status.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p>No statuses available</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserPage;
