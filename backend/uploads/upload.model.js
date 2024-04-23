const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
