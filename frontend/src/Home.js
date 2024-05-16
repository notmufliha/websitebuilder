import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createPage } from './redux/actions/pageAction'
import { deletePage } from './redux/actions/pageAction'
// import "./styles/Home.css";
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import axios from 'axios'
const cheerio = require('cheerio')

const Home = () => {
  const [name, setName] = useState('')
  const [selectedPages, setSelectedPages] = useState([])
  const [idToDelete, setIdToDelete] = useState('')
  const [isValid, setIsValid] = useState(true)
  const dispatch = useDispatch()

  const { pageStore } = useSelector(state => state)
  const { pages } = pageStore

  const handleSubmit = async () => {
    if (!name) {
      setIsValid(false)
      toast.error('Please provide a valid name.')
      return
    }
    try {
      await createPage(name)(dispatch)
      setName('')
      toast.success('Page created successfully!')
    } catch (error) {
      toast.error('Failed to create page.')
    }
  }

  const confirmDelete = async pageId => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      handleDelete(pageId)
    }
  }

  const handleDelete = async pageId => {
    if (!pageId) return // Check if there's an ID to delete
    try {
      await deletePage(pageId)(dispatch)
      setIdToDelete('')
      toast.success('Page deleted successfully!')
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Error deleting page.')
    }
  }

  const handlePageCheckboxChange = pageId => {
    if (selectedPages.includes(pageId)) {
      setSelectedPages(selectedPages.filter(id => id !== pageId))
    } else {
      setSelectedPages([...selectedPages, pageId])
    }
  }

  const handleExport = async () => {
    const pageDataPromises = selectedPages.map(async pageId => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/pages/${pageId}`
        )
        if (!response.ok) throw new Error('Network response was not ok.')
        const data = await response.json()

        if (!data || !data.content || !data.content['mycustom-html']) {
          toast.error(`Page ${data.name} has no content or does not exist.`)
          return null
        }

        const cleanedHTML = data.content['mycustom-html']
        const cleanedCSS = data.content['mycustom-css']
        const cleanedComponents = JSON.parse(
          data.content['mycustom-components']
        )
        const cleanedAssets = JSON.parse(data.content['mycustom-assets'])

        const componentsResponse = await fetch(
          `http://localhost:8080/api/pages/${pageId}/components`
        )
        if (!componentsResponse.ok)
          throw new Error('Failed to fetch components.')
        const componentsData = await componentsResponse.json()

        await fetch('http://localhost:8080/api/pages/components', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            components: componentsData.components
          })
        })

        const sqlResponse = await fetch(
          `http://localhost:8080/api/pages/${pageId}/sqldump`
        )
        if (!sqlResponse.ok) throw new Error('Failed to fetch SQL dump.')
        const sqlBlob = await sqlResponse.blob()

        return {
          html: cleanedHTML,
          css: cleanedCSS,
          components: cleanedComponents,
          assets: cleanedAssets,
          pageId,
          name: data.name,
          sqlBlob
        }
      } catch (error) {
        console.error('Error fetching page data:', error)
        toast.error('Error fetching page data. Please try again later.')
        return null
      }
    })

    const pageData = await Promise.all(pageDataPromises)
    const validPageData = pageData.filter(page => page !== null)

    if (validPageData.length === 0) {
      toast.error(`Page chosen has no content or does not exist.`)
      return
    }

    const zip = new JSZip()
    const cssFolder = zip.folder('css')
    const sqlFolder = zip.folder('sql')

    validPageData.forEach(({ html, css, assets, pageId, name, sqlBlob }) => {
      function createTemplatePlaceholders (html) {
        const userInputPlaceholder = '{{userInputPlaceholder}}'
        const tagPlaceholders = {
          a: true,
          div: true,
          img: true,
          video: true,
          iframe: true
        }

        let template = html
        let index = 1

        for (const [tag, _] of Object.entries(tagPlaceholders)) {
          const regex = new RegExp(`(<${tag}[^>]*>)([^<]+)(<\/${tag}>)`, 'g')
          template = template.replace(
            regex,
            (match, startTag, innerText, endTag) => {
              const idMatch = startTag.match(/id="([^"]*)"/)
              const idAttribute = idMatch ? idMatch[0] : '' // Keep id attribute if exists
              const classMatch = startTag.match(/class="([^"]*)"/)
              const classAttribute = classMatch ? classMatch[0] : '' // Keep class attribute if exists
              const replacedStartTag = startTag.replace() // Remove id and class attributes
              return `${replacedStartTag}${userInputPlaceholder}${endTag}`
            }
          )
          index++
        }

        // Replace src, width, height, and other attributes
        const attributeRegex = /(\w+)=("[^"]*")/g
        template = template.replace(
          attributeRegex,
          (match, attributeName, attributeValue) => {
            console.log(attributeName)
            if (
              attributeName !== 'id' &&
              attributeName !== 'class' &&
              attributeName !== 'gjs'
            ) {
              return `${attributeName}=${userInputPlaceholder}`
            }
            return match
          }
        )

        return template
      }
      const sqlFolder = zip.folder('sql')

      validPageData.forEach(({ html, css, assets, pageId, name, sqlBlob }) => {
        const html2 = createTemplatePlaceholders(html)
        console.log(html2)
        if (html) {
          const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name}</title>
            <link rel="stylesheet" href="css/style_${name
              .replace(/\s/g, '_')
              .toLowerCase()}.css">
          </head>
          <body>${html2}</body>
          </html>
        `

          zip.file(`${name}.html`, htmlContent)
          cssFolder.file(
            `style_${name.replace(/\s/g, '_').toLowerCase()}.css`,
            css
          )
          console.log(`HTML and CSS files created for page ${pageId}`)

          assets.forEach((asset, index) => {
            const filename = `images/${pageId}_image_${index + 1}.jpg`
            fetch(asset.src, { mode: 'no-cors' })
              .then(response => response.blob())
              .then(blob => {
                zip.file(filename, blob)
              })
              .catch(error => console.error('Error fetching asset:', error))
          })

          sqlFolder.file(`${pageId}.sql`, sqlBlob) // Add the SQL dump to the ZIP
        }
      })

      zip.generateAsync({ type: 'blob' }).then(async content => {
        toast.success(`Page successfully exported.`)
        saveAs(content, 'pages.zip')
      })

      setSelectedPages([])
    })
  }

  const handleExport2 = async () => {
    const pageDataPromises = selectedPages.map(async pageId => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/pages/${pageId}`
        )
        const data = await response.json()

        // Check if data or content is null or empty
        if (!data || !data.content || !data.content['mycustom-html']) {
          // Notify user if the page data is null or empty
          toast.error(`Page ${data.name} has no content or does not exist.`)
          return null
        }

        // Clean the HTML string
        const cleanedHTML = data.content['mycustom-html']
        const cleanedCSS = data.content['mycustom-css']
        const cleanedComponents = JSON.parse(
          data.content['mycustom-components']
        )
        const cleanedAssets = JSON.parse(data.content['mycustom-assets'])

        return {
          html: cleanedHTML,
          css: cleanedCSS,
          components: cleanedComponents,
          assets: cleanedAssets,
          pageId,
          name: data.name
        }
      } catch (error) {
        console.error('Error fetching page data:', error)
        // Notify user if there's an error fetching page data
        toast.error('Error fetching page data. Please try again later.')
        return null
      }
    })

    // Wait for all page data promises to resolve
    const pageData = await Promise.all(pageDataPromises)

    // Filter out null entries before further processing
    const validPageData = pageData.filter(page => page !== null)

    // If no valid page data, return without exporting
    if (validPageData.length === 0) {
      toast.error(`Page chosen has no content or does not exist.`)
      return
    }

    const filesArray = []

    // Add HTML and CSS files to the filesArray
    validPageData.forEach(({ html, css, name }) => {
      if (html && css) {
        // Construct HTML content with proper structure
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name}</title>
            <link rel="stylesheet" href="css/style_${name
              .replace(/\s/g, '_')
              .toLowerCase()}.css">
          </head>
          <body>
            ${html}
          </body>
          </html>
        `
        filesArray.push({ name: `${name}.html`, content: htmlContent })
        filesArray.push({
          name: `style_${name.replace(/\s/g, '_').toLowerCase()}.css`,
          content: css
        })
      }
    })

    try {
      // Send the HTML and CSS files array to the server using fetch
      const response = await fetch('http://localhost:8080/api/pages/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: filesArray })
      })

      if (response.ok) {
        toast.success(`Page successfully exported.`)
      } else {
        toast.error(`Failed to export page. Status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error exporting page:', error)
      toast.error(`Failed to export page. ${error.message}`)
    }

    setSelectedPages([])
  }

  return (
    <div style={{ paddingTop: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <form>
          <div
            style={{
              background: '#f7f7f7',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
              <h5>Create a New Page</h5>
            </div>
            <div style={{ padding: '20px' }}>
              <label
                htmlFor='name'
                style={{ display: 'block', marginBottom: '10px' }}
              >
                Page Name
              </label>
              <input
                type='text'
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: `1px solid ${isValid ? '#ccc' : '#ff4d4f'}`,
                  boxShadow: `0 0 0 ${isValid ? '0' : '1px'} #ff4d4f inset`
                }}
                id='name'
                placeholder='Enter page name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {!isValid && (
                <div style={{ color: '#ff4d4f', marginTop: '5px' }}>
                  Please provide a valid name.
                </div>
              )}
            </div>
            <div
              style={{
                padding: '20px',
                borderTop: '1px solid #ddd',
                textAlign: 'right'
              }}
            >
              <button
                type='button'
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '4px'
                }}
                onClick={() => setName('')}
              >
                Clear
              </button>
              <button
                type='button'
                style={{
                  padding: '10px 20px',
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px'
                }}
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </form>

        <div style={{ marginTop: '20px' }}>
          <button
            type='button'
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
            onClick={handleExport}
            disabled={selectedPages.length === 0}
          >
            Export
          </button>
          <button
            type='button'
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
            onClick={handleExport2}
            disabled={selectedPages.length === 0} // Disable the button if no pages are selected
          >
            Testing
          </button>
          <div className='table-responsive'>
            <table className='table table-striped table-hover'>
              <thead className='table-dark'>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    Select
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    Name
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    Slug
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages && pages.length > 0 ? (
                  pages.map(page => (
                    <tr key={page._id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <input
                          type='checkbox'
                          value={page._id}
                          checked={selectedPages.includes(page._id)}
                          onChange={() => handlePageCheckboxChange(page._id)}
                        />
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {page._id}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {page.name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <Link
                          to={`/editor/${page._id}`}
                          style={{
                            padding: '5px 10px',
                            background: '#17a2b8',
                            color: '#fff',
                            borderRadius: '4px',
                            textDecoration: 'none'
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          type='button'
                          style={{
                            padding: '5px 10px',
                            marginLeft: '10px',
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px'
                          }}
                          onClick={() => confirmDelete(page._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='5'
                      style={{
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid #ddd'
                      }}
                    >
                      No pages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
export default Home
