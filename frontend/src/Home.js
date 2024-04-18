import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPage } from "./redux/actions/pageAction";
import { deletePage } from "./redux/actions/pageAction";
import "./styles/Home.css";

const Home = () => {
  const [name, setName] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();

  const { pageStore } = useSelector((state) => state);
  const { pages } = pageStore;

  const handleSubmit = async () => {
    if (!name) {
      setIsValid(false);
      return;
    }
    createPage(name)(dispatch);
  };
  const handleDelete = async (pageId) => {
    if (!pageId) return; // Check if there's an ID to delete
    try {
      await deletePage(pageId)(dispatch);
      setIdToDelete(""); // Clear the ID after deletion
    } catch (error) {
      console.error("Error deleting page:", error);
      // Handle error if necessary
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form id="create-page">
            <div className="card">
              <div className="card-header">
                <h5>Create a New Page</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Page Name</label>
                  <input
                    type="text"
                    className={`form-control ${isValid ? "" : "is-invalid"}`}
                    id="name"
                    placeholder="Enter page name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {!isValid && (
                    <div className="invalid-feedback">
                      Please provide a valid name.
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setName("")}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-12 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pages && pages.length > 0 ? pages.map((page) => (
                  <tr key={page._id}>
                    <td>{page._id}</td>
                    <td>{page.name}</td>
                    <td>{page.slug}</td>
                    <td>
                      <Link to={`/editor/${page._id}`} className="btn btn-info btn-sm">Edit</Link>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleDelete(page._id)} // Set the ID for deletion
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center">No pages found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
