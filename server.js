const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Endpoint for file uploads
app.post('/upload', upload.array('files'), (req, res) => {
    res.status(200).send('Files uploaded successfully!');
});

// Endpoint for fetching media files
app.get('/media', (req, res) => {
    const mediaFiles = [];
    const files = fs.readdirSync('uploads/');
    files.forEach(file => {
        mediaFiles.push({ url: `http://${req.hostname}:${PORT}/uploads/${file}` });
    });
    res.json(mediaFiles);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
