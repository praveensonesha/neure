const express = require('express');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors'); 

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());


// Use user routes
app.get('/',(req,res)=>{
    res.send({msg:"hello it is working. Thank you for using !"});
  });
  
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
