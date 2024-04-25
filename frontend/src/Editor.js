import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_HOST } from "./api_utils";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import geditorConfig from "./api_utils/geditor_config";
import PageSection from "./components/PageSection";

const Editor = () => {
  const [editor, setEditor] = useState(null);
  const [assets, setAssets] = useState([]);
  const { pageId } = useParams();

  const { pageStore } = useSelector((state) => state);
  const { pages } = pageStore;

  useEffect(() => {
    async function getAllAssets() {
      try {
        // Updated to use the new endpoint for fetching assets
        const response = await axios.get(`${API_HOST}uploads`);
        if (response.data.success) {
          // Update the editor's Asset Manager with new assets
          const assets = response.data.assets.map(asset => ({
            src: asset.url, // Assuming 'url' is the key that contains the asset URL
            // Add other properties if necessary
          }));
          if (editor) {
            editor.AssetManager.add(assets);
          }
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    }

    // Call the function if the editor is initialized
    if (editor) {
      getAllAssets();
    }
  }, [editor]);

  useEffect(() => {
    // Initialize the GrapesJS editor
    const initEditor = geditorConfig(pageId, assets);
    setEditor(initEditor);
  }, [pageId, assets]);


  return (
    <div className="App">
      <div
        id="navbar"
        className="sidenav d-flex flex-column overflow-scroll position-fixed"
      >
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h3 logo">darius</span>
          </div>
        </nav>
        <PageSection pages={pages} />
        <Sidebar />
      </div>
      <div
        className="main-content position-relative w-85 start-15"
        id="main-content"
      >
        <TopNav />
        <div id="editor"></div>
      </div>
    </div>
  );
};

export default Editor;
