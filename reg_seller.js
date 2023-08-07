const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const regSeller = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/members/sellers');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const fieldName = file.fieldname;
      cb(null, fieldName + '-' + uniqueSuffix + extension);
    },
  });
  
  const upload = multer({ storage });
  
  regSeller.post('/regSeller', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documentImage', maxCount: 1 },
  ]), async (req, res) => {
    try {
        const { name, gender, pinCode, mobile, address, date, userId } = req.body;
    
        if (!name || !gender || !pinCode || !mobile || !address || !date || !userId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const profilePath = req.files['profileImage'] ? req.files['profileImage'][0].path : '';
        const documentPath = req.files['documentImage'] ? req.files['documentImage'][0].path : '';
    
        const query = "INSERT INTO sellers (name, profile_path, pin_code, phone, address, gender, date, document_path, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [name, profilePath, pinCode, mobile, address, gender, date, documentPath, userId];
    
        await db.execute(query, values);
    
        return res.status(200).json({ message: 'Data saved successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
  });
  
  module.exports = regSeller;