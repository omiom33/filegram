
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

let fileSystem = {
    files: [],
    folders: {}
};

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const filePath = req.body.path || '';
    const fileName = req.file.originalname;
    
    let currentFolder = fileSystem;
    const folders = filePath.split('/').filter(Boolean);
    
    folders.forEach(folder => {
        if (!currentFolder.folders[folder]) {
            currentFolder.folders[folder] = { files: [], folders: {} };
        }
        currentFolder = currentFolder.folders[folder];
    });
    
    currentFolder.files.push(fileName);
    
    res.status(200).send('File uploaded successfully.');
});

app.get('/files', (req, res) => {
    res.json(fileSystem);
});

app.post('/createFolder', (req, res) => {
    const { path, folderName } = req.body;
    
    let currentFolder = fileSystem;
    const folders = path.split('/').filter(Boolean);
    
    folders.forEach(folder => {
        if (!currentFolder.folders[folder]) {
            currentFolder.folders[folder] = { files: [], folders: {} };
        }
        currentFolder = currentFolder.folders[folder];
    });
    
    if (!currentFolder.folders[folderName]) {
        currentFolder.folders[folderName] = { files: [], folders: {} };
        res.status(200).send('Folder created successfully.');
    } else {
        res.status(400).send('Folder already exists.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));