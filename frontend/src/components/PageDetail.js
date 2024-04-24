import { Link } from "react-router-dom";
function PageDetail({ page }) {
  const { name } = page;
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <a href={`/editor/${page._id}`} class="text-decoration-none">
        {name}
      </a>

      <div>
        <button className="btn btn-sm btn-outline-primary">
          <i className="fa fa-pencil"></i>
        </button>
        <button className="btn btn-sm btn-outline-danger">
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </li>
  );
}

export default PageDetail;
