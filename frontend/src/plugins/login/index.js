import grapesjs from "grapesjs";
import loadBlock from './block';
import loadComponent from './component';
export default grapesjs.plugins.add('grapesjsloginform', (editor, opts = {}) => {
 const config = {
   ...{
     // default options
   },
   ...opts,
 };
 // Load the block
 loadBlock(editor, config);
 // Load the component
 loadComponent(editor, config);
});