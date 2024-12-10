const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded!' });
  }

  res.send({
    message: 'File uploaded successfully!',
    filePath: path.join('uploads', req.file.filename),
  });
});

app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDirectory, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: 'File not found!' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).send({ message: 'Error deleting file!' });
    }

    res.send({ message: 'File deleted successfully!' });
  });
});

app.get('/', (req, res) => {
  res.send('Upload API is running! POST /upload to test file uploads.');
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`File upload API running on http://localhost:${PORT}`);
  });
};

startServer();
