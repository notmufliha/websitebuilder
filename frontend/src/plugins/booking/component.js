export default (editor, opt = {}) => {
  const c = opt
  const dc = editor.DomComponents
  const defaultType = dc.getType('default')
  const defaultModel = defaultType.model

  dc.addType('form', {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          'custom-name': c.labelForm,
          draggable: false,
          droppable: false,
          copyable: false,
          removable: false,
          script: function () {
            this.onsubmit = function (e) {
              e.preventDefault()
              alert('Form submitted!')
            }
          }
        }
      },
      {
        isComponent (el) {
          if (el.tagName === 'FORM') {
            return { type: 'form' }
          }
        }
      }
    ),

    view: defaultType.view
  })
}
