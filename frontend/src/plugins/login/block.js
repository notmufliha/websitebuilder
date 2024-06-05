export default (editor, opts = {}) => {
    const bm = editor.BlockManager;
    bm.add('login-form-block', {
      label: 'Login Form',
      category: 'Forms',
      content: {
        type: 'login-form-component',
      },
      attributes: { class: 'fa fa-user' },
    });
   };