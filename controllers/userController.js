const jwt = require('jsonwebtoken');
const {signUpUserService,loginUserService} = require('../services/userService.js');
const  JWT_SECRET  = 'bitroot';


const signUpUser = async(req,res)=>{
    const payload = req.body;
    const { firstName, lastName, email, password } = payload;
    try {
        const result = await signUpUserService(payload);
        return res.status(200).send({
            success : true,
            data:result,
            msg:result.msg
        });
    } catch (error) {
        console.log("Signup error:", error)
        res.status(500).send({
           success:false,
           message:'Error in signup',
           error ,
        });
        
    }
}

const loginUser = async (req, res) => {
    const payload = req.body;
    const { email, password } = payload;
    try {
        const result = await loginUserService(payload); // Don't destructure here, as it's an array
        
        // Since result is an array, access the first element
        const loginResult = result[0]; // Get the first (and only) object in the array

        console.log('Result from service:', loginResult); // Log the result

        if (loginResult.success === 1) {  // Check if login was successful
            const token = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: '4h' });
            return res.status(200).send({
                success: true,
                data: loginResult,
                token,
                msg: loginResult.message
            });
        } else {
            return res.status(401).send({
                success: false,
                message: loginResult.message || 'Invalid credentials!'
            });
        }
    } catch (error) {
        console.log("Error in loginUser:", error);
        return res.status(500).send({
            success: false,
            message: 'Error in login',
            error,
        });
    }
};


module.exports= {signUpUser,loginUser};