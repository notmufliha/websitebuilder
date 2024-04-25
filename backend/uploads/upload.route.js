import express from 'express';
import { uploadImage, getImages, deleteImage } from './upload.controller';

const uploadRoute = express.Router();

// POST request to upload an image
uploadRoute.post('/', uploadImage);

// GET request to fetch all uploaded images
uploadRoute.get('/', getImages);

uploadRoute.delete('/:id', deleteImage);

export default uploadRoute;
