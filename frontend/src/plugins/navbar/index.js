import grapesjs from 'grapesjs';
import loadBlocks from './block';
import loadComponents from './component';
import {
  hNavbarRef
} from './consts';

export default grapesjs.plugins.add('gjsnavbar', (editor, opts = {}) => {
  let c = opts;

  let defaults = {
    blocks: [hNavbarRef],
    defaultStyle: 1,
    navbarClsPfx: 'navbar',
    labelNavbar: 'Navbar',
    labelNavbarContainer: 'Navbar Container',
    labelMenu: 'Navbar Menu',
    labelMenuLink: 'Menu link',
    labelBurger: 'Burger',
    labelBurgerLine: 'Burger Line',
    labelNavbarBlock: 'Navbar',
    labelNavbarCategory: 'Extra',
    labelHome: 'Home',
    labelAbout: 'About',
    labelContact: 'Contact',
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  loadBlocks(editor, c);
  loadComponents(editor, c);
});
