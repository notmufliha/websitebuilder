import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import uiRoute from './ui/ui.route'
import pageRoute from './page/page.route'
import assetRoute from './assets/assets.route'
import projectRoute from './project/project.route'
import renderHtml from './render/render.controller'
import uploadRoute from './uploads/upload.route'

const controller = require('./controller/postsController')
const os = require('os')
const http = require('http')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const fs = require('fs')
const archiver = require('archiver')
// Initialize App
const app = express()
app.use(express.json())
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
  },
  credentials: true,
}
app.use(cors(corsOptions))

// Serve static files from the static directory
app.use('/static', express.static(path.join(__dirname, 'page/static/frontend')))

// HTML and Static file
app.use('/resources', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.get('/fetch-data', async (req, res) => {
  try {
    const url =
      'http://raw.githubusercontent.com/notmufliha/websiteC/main/freebies/space/index.html'

    // Make a GET request to the external URL
    http
      .get(url, response => {
        let data = ''

        // Concatenate the chunks of data
        response.on('data', chunk => {
          data += chunk
        })

        // Send the concatenated data when the response ends
        response.on('end', () => {
          res.send(data)
        })
      })
      .on('error', error => {
        console.error(error)
        res.status(500).send('Internal Server Error')
      })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

const mongoUri =
  'mongodb+srv://dariuschew1050:e0Lw6qNiRBs5wYqF@webpagebuilder.kvkmygy.mongodb.net/?retryWrites=true&w=majority&appName=webpagebuilder'
mongoose.connect(
  mongoUri,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    if (err) {
      console.error('Failed to connect to MongoDB', err)
      throw err
    }
    console.log('Connected to MongoDB')
  },
)

app.post('/api/generateAndSendBackend', async (req, res) => {
  try {
    console.log('generateAndSendBackend: Starting process')

    // Generate a temporary directory path
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'backend-'))
    console.log(`generateAndSendBackend: Temporary directory created at ${tempDir}`)

    // Generate backend using express-generator in the temporary directory
    await exec(`express ${tempDir}`)
    console.log(`generateAndSendBackend: Express application generated at ${tempDir}`)

    // Add the new import statement to the generated app.js
    const appJsPath = path.join(tempDir, 'app.js')
    const appJsContent = fs.readFileSync(appJsPath, 'utf-8')
    console.log(`generateAndSendBackend: Read app.js content from ${appJsPath}`)

    const imports = `const { Pool } = require('pg');

      const port = process.env.PORT || 5000;

      const pool = new Pool({
        user: 'root',
        host: 'localhost',
        database: 'mydatabase',
        password: , // Ensure to add your password here
        port: 3306,
      });

      app.get('/', async (req, res) => {
        try {
          const result = await pool.query('SELECT * FROM my_table');
          res.json(result.rows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching data');
        }
      });
    `
    const newAppJsContent = addImportStatement(appJsContent, imports)
    console.log(`generateAndSendBackend: New app.js content: ${newAppJsContent}`)

    fs.writeFileSync(appJsPath, newAppJsContent, 'utf-8')
    console.log(`generateAndSendBackend: Updated app.js at ${appJsPath}`)

    // Zip the generated backend folders
    const zipFilePath = `${tempDir}.zip`
    const output = fs.createWriteStream(zipFilePath)
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level
    })

    output.on('close', () => {
      console.log(`generateAndSendBackend: ZIP file created at ${zipFilePath}`)
      // Send the ZIP file to the client
      res.download(zipFilePath, () => {
        // Cleanup temporary files after download
        try {
          fs.unlinkSync(zipFilePath)
          console.log(`generateAndSendBackend: Deleted ZIP file at ${zipFilePath}`)
          fs.rm(tempDir, { recursive: true }, cleanupError => {
            if (cleanupError) {
              console.error('generateAndSendBackend: Error during cleanup:', cleanupError)
            } else {
              console.log(`generateAndSendBackend: Deleted temporary directory at ${tempDir}`)
            }
          })
          console.log(`generateAndSendBackend: Deleted temporary directory at ${tempDir}`)
        } catch (cleanupError) {
          console.error('generateAndSendBackend: Error during cleanup:', cleanupError)
        }
      })
    })

    archive.on('error', err => {
      console.error('generateAndSendBackend: Error zipping backend:', err)
      res.status(500).send('Error zipping backend')
    })

    archive.pipe(output)
    archive.directory(tempDir, false) // Add generated backend folders to ZIP
    await archive.finalize()
    console.log('generateAndSendBackend: Archive finalized and ZIP file created')
  } catch (error) {
    console.error('generateAndSendBackend: Error generating and sending backend:', error)
    res.status(500).send('Error generating and sending backend')
  }
})

function addImportStatement (appJsContent, imports) {
  // Extract the app.get route from the imports string
  const appGetRouteRegex = /app\.get\(.*\{[^]*?\}\);/
  const appGetRouteMatch = imports.match(appGetRouteRegex)
  const appGetRoute = appGetRouteMatch ? appGetRouteMatch[0] : ''

  // Remove the app.get route from the imports string
  const modifiedImports = imports.replace(appGetRouteRegex, '').trim()

  // Find the last var statement
  const varRegex = /var .*;/g
  const varStatements = appJsContent.match(varRegex)

  let lastIndex = 0
  if (varStatements && varStatements.length > 0) {
    const lastVarStatementIndex = varStatements.length - 1
    lastIndex =
      appJsContent.lastIndexOf(varStatements[lastVarStatementIndex]) +
      varStatements[lastVarStatementIndex].length
  }

  // Add the import statements after the last var statement
  let modifiedContent = appJsContent.slice(0, lastIndex)
  modifiedContent += '\n\n' + modifiedImports + '\n\n'
  modifiedContent += appJsContent.slice(lastIndex)

  // Find the app.use('/users', usersRouter); line
  const usersRouterIndex = modifiedContent.indexOf("app.use('/users', usersRouter);")

  if (usersRouterIndex !== -1 && appGetRoute) {
    const insertionIndex = modifiedContent.indexOf('\n', usersRouterIndex) + 1
    modifiedContent =
      modifiedContent.slice(0, insertionIndex) +
      '\n' +
      appGetRoute +
      '\n' +
      modifiedContent.slice(insertionIndex)
  }

  // Add the app.listen block before module.exports if it's not already there
  const moduleExportsIndex = modifiedContent.lastIndexOf('module.exports')
  const listenBlock = `
    app.listen(port, () => {
      console.log(\`Server running on port \${port}\`);
    });
  `
  if (moduleExportsIndex === -1) {
    // If module.exports not found, add listenBlock at the end
    modifiedContent += '\n' + listenBlock
  } else {
    // If module.exports found, add listenBlock before it
    const insertionIndex = modifiedContent.lastIndexOf('\n', moduleExportsIndex)
    modifiedContent =
      modifiedContent.slice(0, insertionIndex) +
      '\n' +
      listenBlock.trim() +
      '\n\n' +
      modifiedContent.slice(insertionIndex)
  }

  return modifiedContent
}

// function addImportStatement(appJsContent, imports) {
//   // Find the last var statement
//   const varRegex = /var .*;/g;
//   const varStatements = appJsContent.match(varRegex);

//   let lastIndex = 0;
//   if (varStatements && varStatements.length > 0) {
//     const lastVarStatementIndex = varStatements.length - 1;
//     lastIndex = appJsContent.lastIndexOf(varStatements[lastVarStatementIndex]);
//   }

//   // Add the import statements after the last var statement
//   let modifiedContent = appJsContent.slice(0, lastIndex);
//   modifiedContent += imports.trim() + '\n\n';
//   modifiedContent += appJsContent.slice(lastIndex);

//   // Add the app.listen block before module.exports if it's not already there
//   const moduleExportsIndex = modifiedContent.lastIndexOf('module.exports');
//   const listenBlock = `
//     app.listen(port, () => {
//       console.log(\`Server running on port \${port}\`);
//     });
//   `;
//   if (moduleExportsIndex === -1) {
//     // If module.exports not found, add listenBlock at the end
//     modifiedContent += '\n' + listenBlock;
//   } else {
//     // If module.exports found, add listenBlock before it
//     const insertionIndex = modifiedContent.lastIndexOf('\n', moduleExportsIndex);
//     modifiedContent = modifiedContent.slice(0, insertionIndex) + '\n' +
//                       listenBlock.trim() + '\n\n' +
//                       modifiedContent.slice(insertionIndex);
//   }

//   return modifiedContent;
// }
app.get(
  '/api/pages/sql/:page_id',
  (req, res, next) => {
    console.log('Accessing /api/pages/sql')
    next()
  },
  controller.getAllPages,
)

// Routes with added console logs
app.use(
  '/api/projects',
  (req, res, next) => {
    console.log('Accessing /api/projects')
    next()
  },
  projectRoute,
)

app.use(
  '/api/pages',
  (req, res, next) => {
    console.log('Accessing /api/pages')
    next()
  },
  pageRoute,
)

app.use(
  '/api/assets',
  (req, res, next) => {
    console.log('Accessing /api/assets')
    next()
  },
  assetRoute,
)

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.use(
  '/api/uploads',
  (req, res, next) => {
    console.log('Accessing /api/uploads')
    next()
  },
  uploadRoute,
)

app.use(
  '/api/',
  (req, res, next) => {
    console.log('Accessing /api/')
    next()
  },
  uiRoute,
)

app.get(
  '/:pageId?',
  (req, res, next) => {
    console.log('Accessing /:pageId?', req.params)
    next()
  },
  renderHtml,
)

const PORT = process.env.APP_PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
