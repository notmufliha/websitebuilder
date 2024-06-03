import grapesjs from "grapesjs";
import loadComponents from "./component";
import loadBlocks from "./block";

export default grapesjs.plugins.add("swiperComponent2", (editor, opts = {}) => {
  let options = {
    label: "Swiper2",
    name: "cswiper2",
    category: "Custom",
  };
  for (let name in options) {
    if (!(name in opts)) opts[name] = options[name];
  }

  loadBlocks(editor, options);
  loadComponents(editor, opts);
});
