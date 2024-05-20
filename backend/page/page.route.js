import express from 'express';
import { exec } from 'child_process';
import {
  changeContent,
  create,
  update,
  deletePageRecord,
  details,
  list,
  loadContent,
} from './page.controller';
import { getPageComponents, insertComponentAndAttributes, fetchPageDataAsSqlDump } from './page.services';
const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const pageRoute = express.Router();

// Rsync function to sync files to VM
const syncToVM = (req, res) => {
  const rsyncCommand = 'wsl rsync -avz --delete /mnt/c/Users/exc/Downloads/EXPORTS/ user@192.168.28.129:/var/www/html/';

  exec(rsyncCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ message: 'Sync failed', error: error.message });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ message: 'Sync successful', details: stdout });
  });
};

// Define the route for syncing files
pageRoute.post('/sync-to-vm', syncToVM);



pageRoute.post('/', create);
pageRoute.post('/:pageId/content', changeContent);

pageRoute.put('/:pageId', update);

pageRoute.post('/test', async (req, res) => {
  try {
    // Ensure that files were uploaded
    const files = req.body.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    console.log('here1')
    // Connect to the VM via SSH
    const sshConfig = {
      host: process.env.VM_IP,
      port: 22, // Default SSH port
      username: process.env.VM_USER,
      password: process.env.VM_PASSWORD,
    };
    console.log('here2')
    const sshClient = new Client();

    await new Promise((resolve, reject) => {
      sshClient.on('error', reject);
      sshClient.on('ready', resolve);
      sshClient.connect(sshConfig);
    });
    console.log('here3')
    // Process each file in the array
    for (const file of files) {
      const { name, content } = file;
      console.log(name, content)
      // Save the file to a temporary directory
      const tempFilePath = path.join(__dirname, 'temp', name);
      console.log(tempFilePath)
      fs.writeFileSync(tempFilePath, content);

      // Send the file to the VM using SCP
      console.log('here4')

      let remoteDirectoryPath = name.endsWith('.css') ? 'wordpress_website/css' : 'wordpress_website';
      const remoteFilePath = `./${remoteDirectoryPath}/${name}`;

      // Ensure remote directory exists
      await createRemoteDirectoryIfNotExists(sshClient, remoteDirectoryPath);

      // Send the file to the VM using SCP
      await new Promise((resolve, reject) => {
        sshClient.sftp((err, sftp) => {
          if (err) reject(err);
          sftp.fastPut(tempFilePath, remoteFilePath, (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
    }

    // Close SSH connection
    sshClient.end();

    // Respond with a success message
    res.status(200).json({ message: 'Files uploaded and sent to VM successfully.' });
  } catch (error) {
    console.error('Error uploading and sending files to VM:', error);
    res.status(500).json({ error: 'Failed to upload and send files to VM' });
  }
});

async function createRemoteDirectoryIfNotExists(sshClient, remoteDirectoryPath) {
  return new Promise((resolve, reject) => {
    sshClient.exec(`mkdir -p ${remoteDirectoryPath}`, (err, stream) => {
      console.log('here5');
      if (err) {
        console.error('Error executing mkdir command:', err);
        reject(err);
        return; // Exit function early in case of error
      }

      stream.stdout.on('data', (data) => {
        console.log('Received stdout data:', data.toString());
      });

      stream.stderr.on('data', (data) => {
        console.error('Received stderr data:', data.toString());
        if (data.includes('File exists')) {
          // If directory already exists, resolve without rejecting
          console.log('Directory already exists.');
          resolve();
        }
      });

      stream.on('close', (code, signal) => {
        console.log('mkdir command completed with code:', code);
        if (code === 0) {
          // Directory created successfully
          resolve();
        } else {
          reject(`mkdir command failed with code ${code}`);
        }
      });
    });
  });
}



pageRoute.delete('/:pageId', deletePageRecord);

pageRoute.get('/:pageId', details);
pageRoute.get('/', list);
pageRoute.get('/:pageId/content', loadContent);

pageRoute.get('/:pageId/components', async (req, res) => {
  try {
    const { pageId } = req.params;
    const components = await getPageComponents(pageId);

    res.json({
      pageId: pageId,
      components: components
    });
  } catch (error) {
    console.error('Error retrieving components:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

pageRoute.post('/components', async (req, res) => {
  const { pageId, components } = req.body;

  console.log('{routes} Processing POST request to /components with pageId:', pageId);

  if (!components || components.length === 0) {
    console.error('{routes} No components provided in the request');
    return res.status(400).send({ message: "No components provided" });
  }

  try {
    console.log('{routes} Initiating the insertion of components. Total components:', components.length);

    components.forEach(component => {
      console.log('{routes} Inserting component with details:', component);
      insertComponentAndAttributes(component, pageId);
    });

    console.log('{routes} All component insertions initiated successfully');
    res.send({ message: "Components are being processed" });
  } catch (error) {
    console.error('{routes} Error during component insertion:', error);
    res.status(500).send({ message: "Error processing components" });
  }
});

// Route to export page data as SQL dump
pageRoute.get('/:pageId/sqldump', async (req, res) => {
  const { pageId } = req.params;
  try {
    const filePath = await fetchPageDataAsSqlDump(pageId);
    res.download(filePath, `${pageId}.sql`, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        res.status(500).send('Error downloading the file.');
      }
    });
  } catch (error) {
    res.status(500).send('Error generating SQL dump.');
  }
});
export default pageRoute;
