const db = require('../config/db');
const crypto = require('crypto');

const signUpUserService = async (payload) => {
    let { firstName, lastName, email, password } = payload;
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    payload.password = hashedPassword;
    try {
        console.log(JSON.stringify(payload))
        const [[result]] = await db.query(`CALL spSignup(?)`, [JSON.stringify(payload)]);
        return result; 
    } catch (error) {
        console.error("Error in signUpUserService:", error);
        throw error;
    }
};
const loginUserService = async (payload) => {
    let { email, password } = payload;
    try {
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        console.log('Hashed Password from user:', hashedPassword); // Log for debugging
        payload.password = hashedPassword; // Replace plain password with hashed one
        const [[result]] = await db.query(`CALL spLogin(?)`, [JSON.stringify(payload)]);
        // console.log('Login result from DB:', result); // Log the result received from DB
        return result; 
    } catch (error) {
        console.error("Error in loginUserService:", error);
        throw error;
    }
};


module.exports = {
    signUpUserService,
    loginUserService
};
