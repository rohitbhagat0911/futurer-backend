const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const db = require('./db');
const fs = require('fs');
const farmerRouter = require('./farmer_route');
const verifyToken = require('./verify_token');

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     port: 3306,
//     password: "",
//     database: "futurer"
// }
// );

const app = express();
// app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '2gb' }));
app.use(bodyParser.urlencoded({limit: '2gb', extended: true}));
const secretKey = 'sT1mQ3cR4zV6bN7X';

app.get("/api/get/", (req, res) => {
        const sqlGet = "SELECT * FROM users";
        db.query(sqlGet, (error, result) => {
          console.log(result);
            res.json(result);
        })
}); 

app.get('/api/data', (req, res) => {
  
  const data = { message: 'Hello from Express!' };
  res.json(data); 
  console.log(data);
});


// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   const storedEmail = 'test@example.com';
//   const storedPassword = '$2b$10$6ELfy/SstvZqHvLLH7beHOX5BzO6sEz5T5kMwHm2ZxlV61YvWNYBG'; // Hashed password

//   bcrypt.compare(password, storedPassword, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else if (result) {
//       const token = jwt.sign({ email: storedEmail }, 'your-secret-key');
//       res.json({ token });
//     } else {
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   });
// });


// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Please enter email and password' });
//   }

//   if (email === 'john' && password === '12') {
//     const token = 'your_token_here';
//     return res.status(200).json({ token });
//   } else {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }
// });


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Perform input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter email and password' });
  }


    try {
      // Query the database to validate email and password
      const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
      const [results] = await db.execute(query, [email, password]);

      // Check if the email and password are valid
      if (results.length > 0) {
        const user = results[0];
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  
});


// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Perform input validation
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Please enter email and password' });
//   }
//     console.log(email);
//     console.log(password);
    
//   // Query the database to validate email and password
//   const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  
//   db.query(query, [email, password], (err, results) => {
//     if (err) {
//       console.error('Error executing SQL query:', err);
//       return res.status(500).json({ error: 'An error occurred' });
//     }
// console.log('email');
//     // Check if the email and password are valid
//     if (results.length > 0) {
//       const user = results[0];
//       const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
//       console.log('succ');
//       return res.status(200).json({ token });
//     } else {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//   });
// });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/members/farmers');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fieldName = file.fieldname;
    cb(null, fieldName + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

app.post('/regFarmer',upload.fields([
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

    const query = "INSERT INTO farmers (name, profile_path, pin_code, phone, address, gender, date, document_path, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [name, profilePath, pinCode, mobile, address, gender, date, documentPath, userId];

    await db.execute(query, values);

    return res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});


const regScraper = require('./reg_scraper');

app.use(regScraper);


app.use('/farmerInfo',farmerRouter);

const scraperRouter = require('./scraper_route');
app.use('/scraperInfo', scraperRouter);

const craftRouter = require('./craft_route');
app.use('/craftInfo', craftRouter);

const ideaRouter = require('./idea_route');
app.use('/ideaInfo', ideaRouter);

const regSeller = require('./reg_seller');
app.use(regSeller);

const addProduct = require('./add_products');
app.post('/addProduct', addProduct);

const productRouter = require('./product_route');
app.use('/productInfo', productRouter);

const regCharity = require('./reg_charity');
app.use(regCharity);

const charityRouter = require('./charity_route');
app.use('/charityInfo', charityRouter);

const regUser = require('./reg_user');
app.use(regUser);

const userRoute = require('./user_route');
app.use('/userInfo', userRoute);

const farmerCheckerRoute = require('./checker/farmer_checker_route');
app.use('/farmerCheckerInfo', farmerCheckerRoute);

const scraperCheckerRoute = require('./checker/scraper_checker_route');
app.use('/scraperCheckerInfo', scraperCheckerRoute);

const charitiesCheckerRoute = require('./checker/charities_checker_route');
app.use('/charitiesCheckerInfo', charitiesCheckerRoute);

const sellerCheckerRoute = require('./checker/seller_checker_route');
app.use('/sellerCheckerInfo', sellerCheckerRoute);

const userProductRouter = require('./user_product_route');
app.use('/userProductInfo', userProductRouter);

const deleteProductRouter = require('./delete_product_route');
app.use(deleteProductRouter);

const currentFarmer = require('./current_user_details/current_farmer');
app.use('/currentFarmerInfo',currentFarmer);

const farmerUpdateRoute = require('./update/farmer_update_route');
app.use(farmerUpdateRoute);

const currentScraper = require('./current_user_details/current_scraper');
app.use('/currentScraperInfo',currentScraper);

const scraperUpdateRoute = require('./update/scraper_update_route');
app.use(scraperUpdateRoute);

const currentCharities = require('./current_user_details/current_charities');
app.use('/currentCharityInfo',currentCharities);

const currentSeller = require('./current_user_details/current_seller');
app.use('/currentSellerInfo',currentSeller);

const charitieUpdateRoute = require('./update/charities_update_route');
app.use(charitieUpdateRoute);

const sellerUpdateRoute = require('./update/seller_update_route');
app.use(sellerUpdateRoute);

const sellerNumberRoute = require('./user_details/seller_number');
app.use('/sellerNumberInfo', sellerNumberRoute); 

const tipsRoute = require('./tips_route');
app.use('/tipsInfo', tipsRoute);

// Express route to handle data submission and image upload
// app.post('/submitData', upload.single('image'), (req, res) => {
//   const { name, gender } = req.body;
//   const imagePath = req.file.path; // Get the file path of the uploaded image

//   // Perform validation checks on the received data
//   if (!name || !gender || !imagePath) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Save the data to the database
//   const query = 'INSERT INTO members (name, gender, imagePath) VALUES (?, ?, ?)';
//   const values = [name, gender, imagePath];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to save data' });
//     }

//     // Data saved successfully
//     return res.status(200).json({ message: 'Data saved successfully' });
//   });
// });




  
  


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

  