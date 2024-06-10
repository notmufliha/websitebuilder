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
    try {
      // const generateBackendResponse = await fetch(
      //   'http://localhost:8080/api/generateAndSendBackend',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       /* Any necessary parameters */
      //     })
      //   }
      // )
      // if (!generateBackendResponse.ok) {
      //   throw new Error('Error generating backend')
      // }

      const pageDataPromises = selectedPages.map(async pageId => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/pages/${pageId}`
          )
          if (!response.ok) throw new Error('Network response was not ok.')
          const data = await response.json()

          // Check if data or content is null or empty
          if (!data || !data.content || !data.content['mycustom-html']) {
            // Notify user if the page data is null or empty
            toast.error(`Page ${data.name} has no content or does not exist.`)
            return null
          }

          const cleanedHTML = data.content['mycustom-html']
          const cleanedCSS = data.content['mycustom-css']
          const cleanedComponents = JSON.parse(
            data.content['mycustom-components']
          )
          const cleanedAssets = JSON.parse(data.content['mycustom-assets'])

          // const componentsResponse = await fetch(
          //   `http://localhost:8080/api/pages/${pageId}/components`
          // )
          // if (!componentsResponse.ok)
          //   throw new Error('Failed to fetch components.')
          // const componentsData = await componentsResponse.json()

          // await fetch('http://localhost:8080/api/pages/components', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     pageId,
          //     components: componentsData.components
          //   })
          // })

          // const sqlResponse = await fetch(
          //   `http://localhost:8080/api/pages/${pageId}/sqldump`
          // );
          // if (!sqlResponse.ok) throw new Error('Failed to fetch SQL dump.');
          // const sqlBlob = await sqlResponse.blob();

          return {
            html: cleanedHTML,
            css: cleanedCSS,
            components: cleanedComponents,
            assets: cleanedAssets,
            pageId,
            name: data.name
            // sqlBlob
          }
        } catch (error) {
          console.error('Error fetching page data:', error)
          // Notify user if there's an error fetching page data
          toast.error('Error fetching page data. Please try again later.')
          return null
        }
      })
      const pageData = await Promise.all(pageDataPromises)

      // Filter out null entries before further processing
      const validPageData = pageData.filter(page => page !== null)

      // If no valid page data, return without exporting
      if (validPageData.length === 0) {
        toast.error(`Page chosen has no content or does not exist.`)
        return
      }

      // Create a new ZIP archive
      // const zipBlob = await generateBackendResponse.blob()
      const zip = new JSZip()
      // const sqlFolder = zip.folder('sql')

      // const zip2 = await JSZip.loadAsync(zipBlob)

      // Create a new folder called 'backend' if it doesn't exist
      // const backendFolder = zip.folder('backend') || zip.folder()

      // const filesToRemove = [] // Store files to remove after iteration

      // zip2.forEach((relativePath, file) => {
      //   if (!file.dir) {
      //     // Move files into the 'backend' folder
      //     backendFolder.file(relativePath, file.async('blob'))
      //     console.log(relativePath)
      //     // Store the original file to remove later
      //     filesToRemove.push(relativePath)
      //   }
      // })

      // Remove the original files from the zip
      // filesToRemove.forEach(relativePath => {
      //   delete zip.files[relativePath]
      // })

      const frontendFolder = zip.folder('frontend')

      const cssFolder = frontendFolder.folder('css')

      // Fix the function to handle HTML template placeholders
      function createTemplatePlaceholders (html) {
        const userInputPlaceholder = '{{userInputPlaceholder}}'
        const tagPlaceholders = {} // Define tagPlaceholders if it's not defined already

        // Loop through tagPlaceholders and replace attributes in html
        for (const [tag, _] of Object.entries(tagPlaceholders)) {
          const regex = new RegExp(`(<${tag}[^>]*>)([^<]+)(<\/${tag}>)`, 'g')
          html = html.replace(
            regex,
            (match, openingTag, content, closingTag) => {
              // Replace attributes except specific ones with userInputPlaceholder
              const replacedOpeningTag = openingTag.replace(
                /(\w+)="[^"]*"/g,
                attr => {
                  const attributeName = attr.split('=')[0]
                  if (
                    attributeName !== 'id' &&
                    attributeName !== 'class' &&
                    attributeName !== 'gjs' &&
                    attributeName !== 'customId' &&
                    attributeName !== 'frameborder'
                  ) {
                    return `${attributeName}=${userInputPlaceholder}`
                  }
                  return attr
                }
              )
              return replacedOpeningTag + content + closingTag
            }
          )
        }
        return html
      }

      // Add the HTML and CSS for each page to the ZIP archive
      validPageData.forEach(({ html, css, assets, pageId, name }) => {
        // validPageData.forEach(({ html, css, assets, pageId, name, sqlBlob }) => {
        const htmlWithPlaceholders = createTemplatePlaceholders(html)
        console.log(htmlWithPlaceholders)
        if (html) {
          // Construct HTML content with proper structure
          const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css">
                    <title>${name}</title>
                    <link rel="stylesheet" href="css/style_${name
                      .replace(/\s/g, '_')
                      .toLowerCase()}.css">
                </head>
                <body>
                    ${htmlWithPlaceholders}
                </body>
            </html>
          `

          // Add HTML file to the ZIP archive
          frontendFolder.file(`${name}.html`, htmlContent)

          // Add CSS file to the CSS folder with naming convention style_pagename.css
          cssFolder.file(
            `style_${name.replace(/\s/g, '_').toLowerCase()}.css`,
            css
          )
          console.log(`HTML and CSS files created for page ${pageId}`)

          assets.forEach((asset, index) => {
            const filename = `images/${pageId}_image_${index + 1}.jpg`
            // Fetch assets and add them to the ZIP
            fetch(asset.src, { mode: 'no-cors' })
              .then(response => response.blob())
              .then(blob => {
                frontendFolder.file(filename, blob)
              })
              .catch(error => console.error('Error fetching asset:', error))
          })

          // sqlFolder.file(`${pageId}.sql`, sqlBlob) // Add the SQL dump to the ZIP
        }
      })

      // Generate the ZIP archive
      zip.generateAsync({ type: 'blob' }).then(async content => {
        console.log('{handleExport} Generated ZIP archive successfully')
        toast.success(`Page successfully exported.`)
        saveAs(content, 'pages.zip')
        console.log('{handleExport} Saved ZIP archive as pages.zip')
      })

      // Generate the final ZIP file
      const finalZipBlob = await zip.generateAsync({ type: 'blob' })
      console.log('{handleExport} Generated final ZIP file blob')

      // Create a FormData object
      const formData = new FormData()
      formData.append('file', finalZipBlob, 'pages.zip')
      console.log(
        '{handleExport} Created FormData object and appended the final ZIP blob'
      )

      // Send the ZIP file to the /save-export endpoint
      const response = await fetch(
        'http://localhost:8080/api/pages/save-export',
        {
          method: 'POST',
          body: formData
        }
      )
      console.log(
        '{handleExport} Sent the ZIP file to the /save-export endpoint'
      )

      if (!response.ok) {
        console.error(
          '{handleExport} Error response from /save-export endpoint:',
          response.statusText
        )
        throw new Error('Error saving exported files')
      } else {
        console.log('{handleExport} Successfully saved exported files')
      }

      // Notify user of success
      toast.success('Files have been successfully exported and saved')
      console.log('{handleExport} Notified user of successful export')

      setSelectedPages([])
    } catch (error) {
      console.error('Error generating backend and exporting pages:', error)
      toast.error(
        'Error generating backend and exporting pages. Please try again later.'
      )
    }
  }

  const handleExport2 = async () => {
    const pageDataPromises = selectedPages.map(async pageId => {
      try {
        console.log(`[Page ${pageId}] Fetching page data...`)
        const response = await fetch(
          `http://localhost:8080/api/pages/${pageId}`
        )
        const data = await response.json()

        if (!data || !data.content || !data.content['mycustom-html']) {
          toast.error(`Page ${data.name} has no content or does not exist.`)
          console.log(`[Page ${pageId}] No content or page does not exist.`)
          return null
        }

        const cleanedHTML = data.content['mycustom-html']
        const cleanedCSS = data.content['mycustom-css']
        const cleanedComponents = JSON.parse(
          data.content['mycustom-components']
        )
        const cleanedAssets = JSON.parse(data.content['mycustom-assets'])

        console.log(`[Page ${pageId}] Fetching additional components data...`)
        const componentsResponse = await fetch(
          `http://localhost:8080/api/pages/${pageId}/components`
        )
        if (!componentsResponse.ok)
          throw new Error('Failed to fetch components.')
        const componentsData = await componentsResponse.json()

        console.log(`[Page ${pageId}] Posting components data...`)
        await fetch('http://localhost:8080/api/pages/components', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            components: componentsData.components
          })
        })

        return {
          html: cleanedHTML,
          css: cleanedCSS,
          components: cleanedComponents,
          assets: cleanedAssets,
          pageId,
          name: data.name
        }
      } catch (error) {
        console.error(`[Page ${pageId}] Error fetching page data:`, error)
        toast.error('Error fetching page data. Please try again later.')
        return null
      }
    })

    const pageData = await Promise.all(pageDataPromises)
    const validPageData = pageData.filter(page => page !== null)

    if (validPageData.length === 0) {
      toast.error(`Page chosen has no content or does not exist.`)
      console.log(`No valid page data available for export.`)
      return
    }

    try {
      const filesArray = []

      for (const { html, css, pageId, name } of validPageData) {
        // console.log(`[Page ${pageId}] Fetching SQL dump...`)
        // const sqlDumpResponse = await fetch(
        //   `http://localhost:8080/api/pages/${pageId}/sqldump`
        // )
        // if (!sqlDumpResponse.ok) {
        //   throw new Error(
        //     `Failed to fetch SQL dump for page ${pageId}. Status: ${sqlDumpResponse.status}`
        //   )
        // }
        // const sqlDump = await sqlDumpResponse.text()

        //         const content2 = `
        //   #!/bin/bash
        //   LOG_FILE="/home/user/logfile.log"
        //   exec > >(tee -i $LOG_FILE)
        //   exec 2>&1

        //   echo "Starting the script execution..."

        //   check_mysql_installed() {
        //       echo "Checking if MySQL is installed..."
        //       mysql --version >/dev/null 2>&1
        //       if [ $? -eq 0 ]; then
        //           echo "MySQL is installed."
        //       else
        //           echo "MySQL is not installed."
        //       fi
        //       return $?
        //   }

        //   install_mysql() {
        //       echo "Installing MySQL..."
        //       sudo apt-get update
        //       sudo apt-get install mysql-server -y
        //       if [ $? -eq 0 ]; then
        //           echo "MySQL installed successfully."
        //       else
        //           echo "Failed to install MySQL."
        //           exit 1
        //       fi
        //   }

        //   create_table() {
        //       echo "Creating database and tables..."
        //       read -p "Enter MySQL root password (leave empty if none): " mysql_password
        //       if [ -z "$mysql_password" ]; then
        //           echo "No password provided, using default authentication method."
        //           mysql -u root <<\`EOF\`
        //   CREATE DATABASE IF NOT EXISTS test_db;
        //   USE test_db;
        //   ${sqlDump}
        // \`EOF\`
        //           if [ $? -eq 0 ]; then
        //               echo "Database and tables created successfully with default authentication."
        //           else
        //               echo "Failed to create database and tables with default authentication."
        //               exit 1
        //           fi
        //       else
        //           echo "Password provided, using it for authentication."
        //           mysql -u root -p"\$mysql_password" <<\`EOF\`
        //   CREATE DATABASE IF NOT EXISTS test_db;
        //   USE test_db;
        //   ${sqlDump}
        // \`EOF\`
        //           if [ $? -eq 0 ]; then
        //               echo "Database and tables created successfully with provided password."
        //           else
        //               echo "Failed to create database and tables with provided password."
        //               exit 1
        //           fi
        //       fi
        //   }

        //   main() {
        //       echo "Starting script execution..."
        //       if check_mysql_installed; then
        //           echo "MySQL is already installed."
        //       else
        //           echo "MySQL is not installed. Installing..."
        //           install_mysql
        //       fi
        //       create_table
        //       echo "Script execution completed."
        //   }
        //   main
        //   `

        const content2 = `
#!/bin/bash
# Function to check if MySQL is installed
check_mysql_installed() {
    mysql --version >/dev/null 2>&1
    return $?
}
# Function to install MySQL
install_mysql() {
    sudo apt-get update
    sudo apt-get install mysql-server -y
}
# Function to create a MySQL table
create_table() {
    read -p "Enter MySQL root password (leave empty if none): " mysql_password
    # Login to MySQL and create a database and table
    if [ -z "$mysql_password" ]; then
        mysql -u root <<\`EOF\`
CREATE DATABASE IF NOT EXISTS test_db;
USE test_db;
CREATE TABLE IF NOT EXISTS test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);
\`EOF\`
    else
        mysql -u root -p"\$mysql_password" <<\`EOF\`
CREATE DATABASE IF NOT EXISTS test_db;
USE test_db;
CREATE TABLE IF NOT EXISTS test1_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);
\`EOF\`
    fi
}
# Function to change MySQL root password forcefully
change_root_password() {
  sudo service mysql stop
    
  # Ensure directories exist and set permissions
  sudo mkdir -p /var/log/mysql/
  sudo mkdir -p /var/run/mysqld/
  sudo chown -R mysql:mysql /var/log/mysql/
  sudo chown -R mysql:mysql /var/run/mysqld/
  sudo chmod -R 755 /var/log/mysql/
  sudo chmod -R 755 /var/run/mysqld/
  
  # Start MySQL with --skip-grant-tables
  sudo mysqld_safe --skip-grant-tables --skip-networking &>/dev/null &
  sleep 5 # Wait for MySQL to start
  
  # Update root password to "password"
  echo "USE mysql; UPDATE user SET authentication_string=PASSWORD('password') WHERE User='root'; FLUSH PRIVILEGES;" | sudo mysql

  # Stop MySQL
  sudo service mysql stop
  
  # Restart MySQL
  sudo service mysql restart
 
}

# Main function
main() {
   if check_mysql_installed; then
        echo "MySQL is already installed."
    else
        echo "MySQL is not installed. Installing..."
        install_mysql
    fi

    if ! check_mysql_installed; then
        echo "MySQL installation failed. Exiting."
        exit 1
    fi
    create_table
}
main
`

        filesArray.push({ name: `mysql_setup.sh`, content: content2 })

        if (html && css) {
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
      }

      console.log(`Sending files array to the server...`)
      const response = await fetch('http://localhost:8080/api/pages/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: filesArray })
      })

      if (response.ok) {
        toast.success(`Page successfully exported.`)
        console.log(`Page export successful.`)
      } else {
        toast.error(`Failed to export page. Status: ${response.status}`)
        console.error(`Failed to export page. Status: ${response.status}`)
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
                    ID
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    Name
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
