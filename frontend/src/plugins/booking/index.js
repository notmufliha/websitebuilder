import grapesjs from 'grapesjs'
import loadBlocks from './block'
import loadComponents from './component'
import { formRef } from './consts'

export default grapesjs.plugins.add('gjsform', (editor, opts = {}) => {
  console.log('Initializing gjsform plugin...')
  let c = opts

  let defaults = {
    blocks: [formRef],
    defaultStyle: 1,
    formClsPfx: 'form',
    labelForm: 'Form',
    labelFormContainer: 'Form Container',
    labelFormBlock: 'Booking Form',
    labelFormCategory: 'Forms',
    labelFormFields: 'Form Fields'
  }

  // Load defaults
  for (let name in defaults) {
    if (!(name in c)) c[name] = defaults[name]
  }

  console.log('Loading blocks...')
  loadBlocks(editor, c)

  console.log('Loading components...')
  loadComponents(editor, c)

  console.log('gjsform plugin initialized.')
})
