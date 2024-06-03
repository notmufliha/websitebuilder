import grapesjs from "grapesjs";
import gjsBlockBasic from "grapesjs-blocks-basic";
import $ from "jquery";
import grapesjsBlockBootstrap from "grapesjs-blocks-bootstrap4";
import grapesjsPluginExport from "grapesjs-plugin-export";
import grapesjsStyleBg from "grapesjs-style-bg";
import customCodePlugin from "grapesjs-custom-code";

import { API_HOST } from ".";
import axios from "axios";
import {
  addEditorCommand,
  deviceManager,
  layerManager,
  panels,
  scripts,
  selectorManager,
  storageSetting,
  styleManager,
  styles,
  toggleSidebar,
  traitManager,
} from "./geditor_utils";
import tailwindComponent from "../plugins/tailwind";
import swiperComponent from "../plugins/swiper";
import gjsnavbar from "../plugins/navbar";
import chartLibComponent from "../plugins/charts";
import swiperComponent2 from "../plugins/template";
import customCodePlugin from 'grapesjs-custom-code';
import sliderComponent from "../plugins/slider";

function loadLastIdCounters() {
  const storedCounters = localStorage.getItem("idCounters");
  return storedCounters
    ? JSON.parse(storedCounters)
    : { text: 100, image: 100, video: 100 };
}

function saveIdCounters(counters) {
  localStorage.setItem("idCounters", JSON.stringify(counters));
}

let idCounters = loadLastIdCounters();

function generateCustomId(type) {
  console.log(type)
  let prefix = 'component_';  // Default prefix
  switch (type.toLowerCase()) {
    case "text":
      prefix = "textfield_";
      break;
    case "bs-image":
      prefix = "img_";
      break;
    case "image":
      prefix = "img_";
      break;
    case "video":
      prefix = "video_";
      break;
    case "bs-video":
      prefix = "video_";
      break;
    case "link":
      prefix = "link_";
      break;
    case "column":
      prefix = "col_";
      break;
    case "row":
      prefix = "row_";
      break;
    case "header":
      prefix = "header_";
      break;
    case "paragraph":
      prefix = "paragraph_";
      break;
    default:
      prefix = "component_";
      console.warn(`Unhandled component type: ${type}, using default prefix`);
  }

  if (idCounters[type] === undefined) {
    idCounters[type] = 100;
  }

  const newId = prefix + idCounters[type];
  idCounters[type]++;
  saveIdCounters(idCounters);

  console.log(`Generated ID for type ${type}: ${newId}`);
  return newId;
}

const geditorConfig = (pageId, assets) => {
  console.log("Starting geditorConfig...");
  $(".panel__devices").html("");
  $(".panel__basic-actions").html("");
  $(".panel__editor").html("");
  $("#blocks").html("");
  $("#styles-container").html("");
  $("#layers-container").html("");
  $("#trait-container").html("");

  // Content for Preview
  const navbar = $("#navbar");
  const mainContent = $("#main-content");
  const panelTopBar = $("#main-content > .navbar-light");

  const editor = grapesjs.init({
    container: "#editor",
    blockManager: {
      appendTo: "#blocks",
    },
    styleManager: styleManager,
    layerManager: layerManager,
    traitManager: traitManager,
    selectorManager: selectorManager,
    panels: panels,
    deviceManager: deviceManager,

    assetManager: {
      assets: assets,
      upload: `${API_HOST}uploads`, // Endpoint for uploading files
      uploadName: "myImage", // Name of the POST parameter to pass files
      uploadFile: function (e) {
        console.log("uploadFile triggered"); // Check if function is triggered

        // Check if event is triggered with correct data
        if (e.dataTransfer) {
          console.log("Files dropped", e.dataTransfer.files);
        } else if (e.target) {
          console.log("Files selected", e.target.files);
        }

        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        // Check if files are found
        console.log("Files array", files);

        if (files.length > 0) {
          var file = files[0]; // Only take the first file
          console.log("Uploading file:", file.name); // Log the file name being uploaded

          // Create a FormData object
          var formData = new FormData();
          formData.append("myImage", file);

          // Send the request
          $.ajax({
            url: `${API_HOST}uploads`,
            type: "POST",
            data: formData,
            contentType: false,
            dataType: "json",
            mimeType: "multipart/form-data",
            processData: false,
            success: function (result) {
              console.log("Upload successful, server result:", result);
              // Assuming result contains the path to the image, e.g., result.imageUrl
              // Add the uploaded image to the assets in the GrapesJS Asset Manager
              editor.AssetManager.add({
                id: result.file._id,
                src: result.imageUrl,
                name: result.file.fileName,
              });
            },
            error: function (xhr, status, err) {
              console.error("Upload error: ", status, err);
            },
          });
        }
      },
      uploadText: "Drop files here or click to upload",
    },

    storageManager: storageSetting(pageId),
    canvas: {
      styles: styles,
      scripts: scripts,
    },
    plugins: [
      tailwindComponent,
      gjsnavbar,
      gjsBlockBasic,
      swiperComponent,
      grapesjsBlockBootstrap,
      grapesjsPluginExport,
      grapesjsStyleBg,
      chartLibComponent,
      swiperComponent2,
      sliderComponent,
      customCodePlugin
    ],
    pluginsOpts: {
      tailwindComponent: {},
      gjsnavbar: {},
      gjsBlockBasic: {},
      swiperComponent: {},
      grapesjsBlockBootstrap: {},
      grapesjsPluginExport: {},
      grapesjsStyleBg: {},
      chartLibComponent: {},
      swiperComponent2: {},
      sliderComponent: {},
      [customCodePlugin]: {}
    },
  });

  editor.on("component:add", (component) => {
    const type = component.get("type");
    const customId = generateCustomId(type);
    component.addAttributes({ customId: customId });
    console.log(
      `Component of type ${type} added with custom ID set to ${customId}`
    );
    console.log(
      `Post-set verification, Custom ID on component: ${
        component.getAttributes().customId
      }`
    );
  });

  editor.on("export:start", () => {
    console.log("Export started");
    editor.getComponents().each((component) => {
      component.addAttributes({ id: component.getId() });
    });

    console.log(editor.getHtml());
    editor.getComponents().each((component) => {
      console.log(`Component HTML: ${component.toHTML()}`);
    });
  });

  editor.on("export:complete", () => {
    console.log("Export completed.");
  });

  editor.on("asset:remove", (asset) => {
    // Log the entire asset object to see all available properties
    console.log("Asset to remove:", asset);

    // Get the asset ID
    const assetId = asset.get("id"); // Ensure 'id' is the correct property name that holds the unique identifier for the asset
    console.log("Asset ID to remove:", assetId);

    if (!assetId) {
      console.error("No asset ID found, asset removal aborted.");
      return; // Stop further execution if assetId is not found
    }

    // Construct the URL for the DELETE request
    const url = `${API_HOST}uploads/${assetId}`;
    console.log("DELETE request URL:", url);

    // Call the backend endpoint to delete the asset
    axios
      .delete(url)
      .then((response) => {
        console.log("Image deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to delete image:", error);
      });
  });

  // addEditorCommand(editor);
  editor.on("run:preview", () => {
    console.log("It will trigger when we click on preview icon");
    // This will be used to hide border
    editor.stopCommand("sw-visibility");
    // This will hide the sidebar view
    navbar.removeClass("sidebar");
    // This will make the main-content to be full width
    mainContent.removeClass("main-content");

    // This will hide top panel where we have added the button
    panelTopBar.addClass("d-none");
  });
  editor.on("stop:preview", () => {
    // This event is reverse of the above event.
    console.log("It will trigger when we click on cancel preview icon");
    editor.runCommand("sw-visibility");
    navbar.addClass("sidebar");
    mainContent.addClass("main-content");
    panelTopBar.removeClass("d-none");
  });
  editor.on("component:selected", (component) => {
    const newTool = {
      icon: "fa fa-plus-square",
      title: "Check Toolbar",
      commandName: "new-tool-cmd",
      id: "new-tool",
    };

    const defaultToolbar = component.get("toolbar");
    const checkAlreadyExist = defaultToolbar.find(
      (toolbar) => toolbar.command === newTool.commandName
    );
    if (!checkAlreadyExist) {
      defaultToolbar.unshift({
        id: newTool.id,
        attributes: { class: newTool.icon, title: newTool.title },
        command: newTool.commandName,
      });
      component.set("toolbar", defaultToolbar);
    }
  });

  editor.BlockManager.add("youtube-video", {
    label: "YouTube",
    content: {
      type: "video",
      // src: 'https://www.youtube.com/watch?v=C4EGWQe4FJM',
      style: {
        height: "280px",
        width: "500px",
      },
    },
    category: "Media",
  });

  addEditorCommand(editor);

  setTimeout(() => {
    let categories = editor.BlockManager.getCategories();
    categories.each((category) => category.set("open", false));
  }, 1000);
  return editor;
};

export default geditorConfig;
