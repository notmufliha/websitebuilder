import Upload from './upload.model';
import upload from './upload.services';
import fs from 'fs';

export const uploadImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).json({ success: false, message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ success: false, message: 'Error: No File Selected!' });
            } else {
                // Save file information to the database
                try {
                    const newUpload = new Upload({
                        fileName: req.file.filename,
                        filePath: req.file.path,
                        fileType: req.file.mimetype,
                        fileSize: req.file.size
                    });

                    const savedFile = await newUpload.save();

                    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${savedFile.fileName}`;
                    res.json({ success: true, file: savedFile, imageUrl: imageUrl });
                } catch (dbError) {
                    res.status(500).json({ success: false, message: 'Database operation failed', error: dbError });
                }
            }
        }
    });
};

export const getImages = async (req, res) => {
    try {
        const uploads = await Upload.find({});
        const assets = uploads.map(upload => {
            return {
                id: upload._id,
                name: upload.fileName,
                url: `${req.protocol}://${req.get('host')}/uploads/${upload.fileName}`,
            };
        });
        res.json({ success: true, assets: assets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch images', error: error });
    }
};

export const deleteImage = async (req, res) => {
    console.log('Request to delete image received, image ID:', req.params.id);
    try {
        const image = await Upload.findById(req.params.id);
        console.log('Found image in database:', image);

        if (!image) {
            console.log('No image found with the given ID.');
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        const filePath = image.filePath;
        console.log('File path resolved:', filePath);

        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error encountered during file deletion:', err);
                return res.status(500).json({ success: false, message: 'Failed to delete the file', error: err });
            }
            console.log('File deleted successfully. Removing database record.');

            await image.remove();
            console.log('Database record removed successfully.');
            res.json({ success: true, message: 'Image deleted successfully' });
        });
    } catch (error) {
        console.error('Caught error in deleteImage function:', error);
        res.status(500).json({ success: false, message: 'Failed to delete image', error: error });
    }
};
