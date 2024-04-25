import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPage } from "./redux/actions/pageAction";
import { deletePage } from "./redux/actions/pageAction";
import "./styles/Home.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Home = () => {
  const [name, setName] = useState("");
  const [selectedPages, setSelectedPages] = useState([])
  const [idToDelete, setIdToDelete] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();

  const { pageStore } = useSelector((state) => state);
  const { pages } = pageStore;
  console.log(pages)

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
  const handlePageCheckboxChange = (pageId) => {
    if (selectedPages.includes(pageId)) {
      setSelectedPages(selectedPages.filter((id) => id !== pageId));
    } else {
      setSelectedPages([...selectedPages, pageId]);
    }
  };

  const handleExport = async () => {
    const pageDataPromises = selectedPages.map(async (pageId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/pages/${pageId}`);
        const data = await response.json();

        // Clean the HTML string
        const cleanedHTML = data.content['mycustom-html']
        const cleanedCSS = data.content['mycustom-css']
        const cleanedComponents = JSON.parse(data.content['mycustom-components']);
        const cleanedAssets = JSON.parse(data.content['mycustom-assets']);
        console.log(cleanedComponents)
        console.log(cleanedAssets)
        return { html: cleanedHTML, css: cleanedCSS, components: cleanedComponents, assets: cleanedAssets, pageId };

      } catch (error) {
        console.error('Error fetching page data:', error);
        return null;
      }
    });


    // Wait for all page data promises to resolve
    const pageData = await Promise.all(pageDataPromises);

    // Create a new ZIP archive 
    const zip = new JSZip();
    const assets = {};

    // Add the HTML for each page to the ZIP archive 
    pageData.forEach(({ html, css, components, assets, pageId }) => {
      if (html) {
        const htmlContent = `
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <link rel="stylesheet" href="./css/style.css">
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
        console.log(htmlContent)
        // components.forEach((component, index) => {
        //   const filename = `${pageId}_component_${index + 1}.json`;
        //   zip.file(filename, JSON.stringify(component));
        // });

        // Handle custom assets
        assets.forEach((asset, index) => {
          const filename = `images/${pageId}_image_${index + 1}.jpg`;
          // Fetch assets and add them to the zip
          // Adjust the path as per your server setup
          fetch(asset.src, { mode: 'no-cors' })
            .then(response => response.blob())
            .then(blob => {
              zip.file(filename, blob);
            })
            .catch(error => console.error('Error fetching asset:', error));

        });

        zip.file(`page_${pageId}/index.html`, htmlContent);
        zip.file(`page_${pageId}/style.css`, css);
      }
    });

    // // Generate the ZIP archive 
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'pages.zip');
    });

    setSelectedPages([]);
  };


  // Fetch the HTML and CSS for each selected page from the backend
  // const pageDataPromises = selectedPages.map(pageId =>
  //     fetch(`http://localhost:8080/api/pages/${pageId}`)
  //     .then(response => {
  //       console.log(response.text())
  //         if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //         }
  //         return response.text(); // Get the raw text content
  //     })
  //     .then(data => ({
  //         html: data, // Assign HTML directly
  //         pageId
  //     }))
  //     .catch(error => console.error('Error fetching page data:', error))
  // );

  // var parser = new DOMParser();

  // Parse the text
  // var doc = parser.parseFromString(html, "text/html");

  // // Wait for all page data to be fetched 
  // const pageData = await Promise.all(pageDataPromises);

  // Create a new ZIP archive 
  // const zip = new JSZip();

  // Add the HTML for each page to the ZIP archive 
  // pageData.forEach(({ html, pageId }) => {
  //     const htmlContent = `
  //         <html lang="en">
  //         <head>
  //             <meta charset="utf-8">
  //             <link rel="stylesheet" href="./css/style.css">
  //         </head>
  //         <body>
  //             ${html}
  //         </body>
  //         </html>
  //     `;
  //     zip.file(`page_${pageId}/index.html`, htmlContent);
  // });

  // // Generate the ZIP archive 
  // zip.generateAsync({ type: 'blob' }).then((content) => {
  //     saveAs(content, 'pages.zip');
  // });

  // Clear selected pages after export 





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
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={handleExport}
            disabled={selectedPages.length === 0} // Disable the button if no pages are selected
          >
            Export
          </button>
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
                    <td>
                      <input
                        type="checkbox"
                        value={page._id}
                        checked={selectedPages.includes(page._id)}
                        onChange={() => handlePageCheckboxChange(page._id)}
                      />
                    </td>
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