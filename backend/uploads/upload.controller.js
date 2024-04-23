import Upload from './upload.model';
import upload from './upload.services';

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
