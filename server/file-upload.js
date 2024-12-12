const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const uploadDirectory = path.join(__dirname, 'uploads');
const jsonFilePath = path.join(__dirname, 'data.json');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}
if (!fs.existsSync(jsonFilePath)) {
  fs.writeFileSync(jsonFilePath, JSON.stringify([]));
}

app.use(cors());
app.use(express.json());
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

app.post('/deleteFile', (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).send({ message: 'Filename is required!' });
  }

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

app.post('/editPage', (req, res) => {
  const { id, name, type, startdt, enddt } = req.body;

  if (!name || !type || !startdt || !enddt) {
    return res.status(400).send({ message: 'Invalid payload!' });
  }

  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).send({ message: 'Error reading data!' });
    }

    let jsonData = [];
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing JSON file:', parseErr);
      return res.status(500).send({ message: 'Error parsing data!' });
    }

    if (id) {
      const existingIndex = jsonData.findIndex((item) => item.id === id);
      if (existingIndex !== -1) {
        jsonData[existingIndex] = {...req.body, status: '尚未上架'};
      } else {
        return res.status(404).send({ message: 'Record not found for update!' });
      }
    } else {
      const newId = uuidv4();
      const newRecord = { id: newId, status: '尚未上架', ...req.body };
      jsonData.push(newRecord);
    }

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing JSON file:', writeErr);
        return res.status(500).send({ message: 'Error saving data!' });
      }

      res.send({
        message: id ? 'Record updated successfully!' : 'Record added successfully!',
        data: id ? jsonData.find((item) => item.id === id) : jsonData[jsonData.length - 1],
      });
    });
  });
});

app.post('/deletePage', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send({ message: 'ID is required!' });
  }

  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).send({ message: 'Error reading data!' });
    }

    let jsonData = [];
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing JSON file:', parseErr);
      return res.status(500).send({ message: 'Error parsing data!' });
    }

    const updatedData = jsonData.filter((item) => item.id !== id);

    if (updatedData.length === jsonData.length) {
      return res.status(404).send({ message: 'Record not found for deletion!' });
    }

    fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing JSON file:', writeErr);
        return res.status(500).send({ message: 'Error saving data!' });
      }

      res.send({ message: 'Record deleted successfully!' });
    });
  });
});

app.get('/getData', (req, res) => {
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).send({ message: 'Error reading data!' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.send(jsonData);
    } catch (parseErr) {
      console.error('Error parsing JSON file:', parseErr);
      res.status(500).send({ message: 'Error parsing data!' });
    }
  });
});

app.get('/getData/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).send({ message: 'Error reading data!' });
    }

    try {
      const jsonData = JSON.parse(data)
      const record = jsonData.find((item) => item.id === id);

      if (!record) {
        return res.status(404).send({ message: 'Record not found!' });
      }

      res.send(record);
    } catch (parseErr) {
      console.error('Error parsing JSON file:', parseErr);
      res.status(500).send({ message: 'Error parsing data!' });
    }
  });
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`upload API running on http://localhost:${PORT}`);
  });
};

startServer();
