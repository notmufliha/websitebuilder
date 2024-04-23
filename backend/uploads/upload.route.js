import express from 'express';
import { uploadImage } from './upload.controller';

const uploadRoute = express.Router();

// POST request to upload an image
uploadRoute.post('/', uploadImage);

// GET request for testing with hardcoded values
uploadRoute.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'This is a test endpoint.',
        data: [
            { id: 1, name: 'Test Image 1', url: 'http://example.com/image1.jpg' },
            { id: 2, name: 'Test Image 2', url: 'http://example.com/image2.jpg' }
        ]
    });
});

export default uploadRoute;
