import grapesjs from "grapesjs";
import gjsBlockBasic from "grapesjs-blocks-basic";
import $ from "jquery";
import grapesjsBlockBootstrap from "grapesjs-blocks-bootstrap4";
import grapesjsPluginExport from "grapesjs-plugin-export";
import grapesjsStyleBg from "grapesjs-style-bg";
import { API_HOST } from ".";
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
import chartLibComponent from "../plugins/charts";

const geditorConfig = (assets, pageId) => {
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
    // assetManager: {
    //   upload: `${API_HOST}uploads/`, // Endpoint for uploading files
    //   uploadName: 'myImage', // Name of the POST parameter to pass files
    //   multiUpload: false, // Allow uploading multiple files at once
    //   add: function (asset, opts) {
    //     // Function to add an asset after it's uploaded
    //     console.log('Asset added', asset);
    //   },
    //   uploadFile: function (e) {
    //     var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    //     var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]; // Only take the first file
    //     // Create a FormData object
    //     var formData = new FormData();
    //     formData.append('myImage', file);

    //     // Send the request
    //     $.ajax({
    //       url: this.upload,
    //       type: 'POST',
    //       data: formData,
    //       contentType: false,
    //       // crossDomain: true,
    //       dataType: 'json',
    //       mimeType: "multipart/form-data",
    //       processData: false,
    //       success: function (result) {
    //         console.log('Result: ', result);
    //         // Assuming result contains the path to the image, e.g., result.imageUrl
    //         // Add the uploaded image to the assets in the GrapesJS Asset Manager
    //         editor.AssetManager.addAsset({
    //           src: result.imageUrl,
    //           name: result.file.fileName
    //         });
    //       },
    //       error: function (xhr, status, err) {
    //         console.error('Upload error: ', err);
    //       },
    //     });
    //   },

    //   uploadText: 'Drop files here or click to upload',
    // },
    assetManager: {
      upload: `${API_HOST}uploads/`, // Endpoint for uploading files
      uploadName: 'myImage', // Name of the POST parameter to pass files
      multiUpload: false, 
      uploadFile: function (e) {
        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (files.length > 0) {
          var file = files[0]; // Only take the first file
          var formData = new FormData();
          formData.append('myImage', file);
    
          $.ajax({
            url: this.upload,
            type: 'POST',
            data: formData,
            contentType: false,
            dataType: 'json',
            mimeType: "multipart/form-data",
            processData: false,
            success: function (result) {
              editor.AssetManager.addAsset({
                src: result.imageUrl,
                name: result.file.fileName
              });
            },
            error: function (xhr, status, err) {
              console.error('Upload error: ', status, err);
            },
          });
        } else {
          console.log('No files to upload');
        }
      },
    
      uploadText: 'Drop files here or click to upload',// Allow uploading multiple files at once
      // add: function (asset, opts) {
      //   // Function to add an asset after it's uploaded
      //   console.log('Asset added', asset);
      // },
      // uploadFile: function (e) {
      //   console.log('uploadFile triggered'); // Check if function is triggered

      //   // Check if event is triggered with correct data
      //   if (e.dataTransfer) {
      //     console.log('Files dropped', e.dataTransfer.files);
      //   } else if (e.target) {
      //     console.log('Files selected', e.target.files);
      //   }

      //   var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
      //   // Check if files are found
      //   console.log('Files array', files);

      //   if (files.length > 0) {
      //     var file = files[0]; // Only take the first file
      //     console.log('Uploading file:', file.name); // Log the file name being uploaded

      //     // Create a FormData object
      //     var formData = new FormData();
      //     formData.append('myImage', file);

      //     // Send the request
      //     $.ajax({
      //       url: this.upload,
      //       type: 'POST',
      //       data: formData,
      //       contentType: false,
      //       dataType: 'json',
      //       mimeType: "multipart/form-data",
      //       processData: false,
      //       success: function (result) {
      //         console.log('Upload successful, server result:', result);
      //         // Assuming result contains the path to the image, e.g., result.imageUrl
      //         // Add the uploaded image to the assets in the GrapesJS Asset Manager
      //         editor.AssetManager.addAsset({
      //           src: result.imageUrl,
      //           name: result.file.fileName
      //         });
      //       },
      //       error: function (xhr, status, err) {
      //         console.error('Upload error: ', status, err);
      //       },
      //     });
      //   } else {
      //     console.log('No files to upload');
      //   }
      // },

      // uploadText: 'Drop files here or click to upload',
    },

    storageManager: storageSetting(pageId),
    canvas: {
      styles: styles,
      scripts: scripts,
    },
    plugins: [
      tailwindComponent,
      gjsBlockBasic,
      swiperComponent,
      grapesjsBlockBootstrap,
      grapesjsPluginExport,
      grapesjsStyleBg,
      chartLibComponent,
    ],
    pluginsOpts: {
      tailwindComponent: {},
      gjsBlockBasic: {},
      swiperComponent: {},
      grapesjsBlockBootstrap: {},
      grapesjsPluginExport: {},
      grapesjsStyleBg: {},
      chartLibComponent: {},
    },
  });

  addEditorCommand(editor);
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

  setTimeout(() => {
    let categories = editor.BlockManager.getCategories();
    categories.each((category) => category.set("open", false));
  }, 1000);
  return editor;
};

export default geditorConfig;
