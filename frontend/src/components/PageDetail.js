import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deletePage } from "../redux/actions/pageAction";

function PageDetail({ page }) {
  const { _id, name } = page;
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deletePage(page._id));
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>{name}</span>

      <div>
        <Link to={`/editor/${_id}`} className="btn btn-sm btn-outline-primary">
          <i className="fa fa-pencil"></i>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDelete()}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </li>
  );
}

export default PageDetail;
