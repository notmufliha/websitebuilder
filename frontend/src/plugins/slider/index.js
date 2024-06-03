import grapesjs from "grapesjs";
import loadComponents from "./component";
import loadBlocks from "./block";

export default grapesjs.plugins.add("sliderComponent", (editor, opts = {}) => {
  let options = {
    label: "Slider",
    name: "cslider",
    category: "Custom",
  };
  for (let name in options) {
    if (!(name in opts)) opts[name] = options[name];
  }

  loadBlocks(editor, options);
  loadComponents(editor, opts);
});
