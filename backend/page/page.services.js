import Pages from './page.modal'
import { extractComponentsData } from './utils/htmlParser'
import connection from '../db'
import mysql from 'mysql'
const fs = require('fs')
const path = require('path')

export const createPage = async pageBody => {
  const slug = pageBody.name.toLowerCase().split(' ').join('-')
  pageBody.slug = slug
  const page = new Pages(pageBody)
  const pageResponse = await page.save()
  return pageResponse
}

export const listPages = async () => {
  const pages = await Pages.find({})
  return pages
}

export const deletePage = async pageId => {
  try {
    await Pages.findByIdAndDelete(pageId)
    console.log('Page deleted successfully')
    return { success: true, message: 'Page deleted successfully' }
  } catch (error) {
    console.error('Error deleting page:', error)
    return { success: false, message: 'Error deleting page' }
  }
}

export const updatePage = async (pageId, pageBody) => {}
export const pageDetails = async pageId => {
  const pages = await Pages.findOne({ _id: pageId })
  return pages
}

export const savePageContent = async (pageId, content) => {
  const pageUpdated = await Pages.findOneAndUpdate({ _id: pageId }, { content })
  return pageUpdated
}

export const findPageById = async pageId => {
  const page = await Pages.findById(pageId)
  return page
}

export const getPageComponents = async pageId => {
  const page = await Pages.findById(pageId)
  if (!page) {
    throw new Error('Page not found')
  }
  console.log(page.content) // Debug to see what you get here
  if (!page.content || !page.content['mycustom-html']) {
    throw new Error('Page does not contain HTML content')
  }
  return extractComponentsData(page.content['mycustom-html'])
}

export const insertComponentAndAttributes = (component, pageId) => {
  console.log('Starting transaction for component:', component)

  connection.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err)
      return
    }

    console.log(`Looking up type_id for component type: ${component.type}`)

    connection.query(
      'SELECT type_id FROM component_types WHERE type_name = ?',
      [component.type],
      (err, typeResults) => {
        if (err) {
          console.error('Error querying component_types:', err)
          connection.rollback(() => console.error('Transaction rollback due to query error.'))
          return
        }

        if (typeResults.length === 0) {
          console.log(`No matching component type found, creating new type: ${component.type}`)
          connection.query(
            'INSERT INTO component_types (type_name) VALUES (?)',
            [component.type],
            (err, insertTypeResult) => {
              if (err) {
                console.error('Error inserting new component type:', err)
                connection.rollback(() =>
                  console.error('Transaction rollback due to type insert error.'),
                )
                return
              }
              const typeId = insertTypeResult.insertId
              insertComponent(typeId, component, pageId)
            },
          )
        } else {
          const typeId = typeResults[0].type_id
          insertComponent(typeId, component, pageId)
        }
      },
    )
  })

  function insertComponent (typeId, component, pageId) {
    console.log(
      `Found or created type_id ${typeId} for component type: ${component.type}, Inserting component.`,
    )
    connection.query(
      'INSERT INTO components (component_id , type_id, page_id, created_at, updated_at) VALUES (?,?, ?, NOW(), NOW())',
      [component.component_id, typeId, pageId],
      (err, componentResults) => {
        if (err) {
          console.error('Error inserting component:', err)
          connection.rollback(() =>
            console.error('Transaction rollback due to component insert error.'),
          )
          return
        }

        const componentId = component.component_id
        console.log(`Component inserted with component_id ${componentId}, Inserting attributes.`)

        component.attributes.forEach(attr => {
          connection.query(
            'INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES (?, ?, ?)',
            [componentId, attr.key, attr.value],
            (err, attributeResults) => {
              if (err) {
                console.error('Error inserting component attributes:', err)
                connection.rollback(() =>
                  console.error('Transaction rollback due to attribute insert error.'),
                )
                return
              }

              console.log(`Attribute ${attr.key} inserted for component_id ${componentId}.`)
            },
          )
        })

        connection.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err)
            connection.rollback(() => console.error('Transaction rollback due to commit error.'))
            return
          }
          console.log('Transaction committed successfully.')
        })
      },
    )
  }
}
// Ensure the dumps directory exists
const ensureDirectoryExistence = filePath => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

export const fetchPageDataAsSqlDump = async (pageId, schemaName = 'default_schema') => {
  const escapedPageId = mysql.escape(pageId)
  const schemaCreation = `CREATE DATABASE IF NOT EXISTS ${schemaName}; USE ${schemaName};`
  const tableCreation = `
    CREATE TABLE IF NOT EXISTS components (
      component_id INT AUTO_INCREMENT PRIMARY KEY,
      page_id VARCHAR(255)
    ); 
    CREATE TABLE IF NOT EXISTS component_attributes (
      component_id INT,
      attribute_key VARCHAR(255),
      attribute_value TEXT,
      PRIMARY KEY (component_id, attribute_key),
      FOREIGN KEY (component_id) REFERENCES components(component_id)
    );
  `.replace(/\n/g, ' ')

  // Add a query to fetch component data as well
  const queries = [
    `SELECT component_id, page_id FROM components WHERE page_id = ${escapedPageId}`,
    `SELECT component_id, attribute_key, attribute_value FROM component_attributes WHERE component_id IN (SELECT component_id FROM components WHERE page_id = ${escapedPageId})`,
  ]

  console.log(`Starting SQL dump for page ID: ${pageId}`)

  try {
    const results = await Promise.all(
      queries.map(
        query =>
          new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
              if (err) {
                console.error(`Error executing query: ${query}`, err)
                reject(err)
              } else {
                resolve(results)
              }
            })
          }),
      ),
    )

    // Generate SQL insert statements for components first
    const componentInserts = results[0].map(
      row =>
        `INSERT INTO components (component_id, page_id) VALUES (${mysql.escape(
          row.component_id,
        )}, ${mysql.escape(row.page_id)});`,
    )

    // Generate SQL insert statements for component attributes
    const attributeInserts = results[1].map(
      row =>
        `INSERT INTO component_attributes (component_id, attribute_key, attribute_value) VALUES (${mysql.escape(
          row.component_id,
        )}, ${mysql.escape(row.attribute_key)}, ${mysql.escape(row.attribute_value)});`,
    )
    const dumpText = [schemaCreation, tableCreation, ...componentInserts, ...attributeInserts].join(
      ' ',
    )

    console.log(`SQL dump completed for page ID: ${pageId}`)
    // Write the SQL dump to a file
    const filePath = path.join(__dirname, `../dumps/${pageId}.sql`)

    // Ensure the dumps directory exists
    ensureDirectoryExistence(filePath)

    fs.writeFileSync(filePath, dumpText, 'utf8')

    console.log(`SQL dump completed for page ID: ${pageId}`)
    return filePath
  } catch (error) {
    console.error('Failed to generate SQL dump:', error)
    throw error
  }
}
