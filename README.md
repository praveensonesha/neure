# Neure

**Neure** is a backend API project that provides authentication and user management services using Node.js, Express, and MySQL. The application supports user signup, login with password hashing, and JWT token generation for session management.

## Features

- User Signup
- User Login
- Password Hashing with MD5
- JWT-based Authentication
- MySQL stored procedures for database operations

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MySQL](https://www.mysql.com/) for database setup

## Setup Instructions

Follow these steps to set up the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/praveensonesha/neure.git
```

Navigate into the project directory:

```bash
cd neure
```

### 2. Install Dependencies

Install the necessary Node.js packages by running:

```bash
npm install
```

This will install all the dependencies listed in `package.json`, including Express, MySQL, JWT, and other required modules.

### 3. Configure the Database

- Set up a MySQL database and create the necessary tables and stored procedures.

#### Create the `users` Table

Run the following SQL script in your MySQL database to create the `users` table:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stored Procedure: `spSignUp`

Create the `spSignUp` stored procedure for handling user signups:

```sql
CREATE PROCEDURE spSignUp(IN p JSON)
BEGIN
    DECLARE v_firstName VARCHAR(100) DEFAULT NULL;
    DECLARE v_lastName VARCHAR(100) DEFAULT NULL;
    DECLARE v_email VARCHAR(100) DEFAULT NULL;
    DECLARE v_password VARCHAR(255) DEFAULT NULL;
    DECLARE email_count INT DEFAULT 0;
	
    -- Start transaction
    START TRANSACTION;

    -- Extract the fields from the JSON input
    SET v_firstName = JSON_UNQUOTE(JSON_EXTRACT(p, '$.firstName'));
    SET v_lastName = JSON_UNQUOTE(JSON_EXTRACT(p, '$.lastName'));
    SET v_email = JSON_UNQUOTE(JSON_EXTRACT(p, '$.email'));
    SET v_password = JSON_UNQUOTE(JSON_EXTRACT(p, '$.password'));

    -- Check if the email already exists
    SELECT COUNT(*) INTO email_count
    FROM users 
    WHERE email = v_email;

    -- If email already exists, return an error message
    IF email_count > 0 THEN
    	SELECT -1 AS user_id, 'Email already exists' AS msg;
    ELSE 	
	    -- Insert new user
	    INSERT INTO users (firstName, lastName, email, password)
	    VALUES (v_firstName, v_lastName, v_email, v_password);
	   
	    -- Return the newly created user ID
	    SELECT LAST_INSERT_ID() AS user_id, 'User Created' AS msg;
	END IF;

    -- Commit the transaction
    COMMIT;
END;
```

#### Stored Procedure: `spLogin`

Create the `spLogin` stored procedure for handling user logins:

```sql
CREATE PROCEDURE spLogin(IN p JSON)
BEGIN
    DECLARE v_email VARCHAR(100);
    DECLARE v_password VARCHAR(255);
    DECLARE v_stored_password VARCHAR(255);
    DECLARE v_user_id INT;

    -- Initialize output
    DECLARE v_success TINYINT DEFAULT 0;
    DECLARE v_message VARCHAR(255) DEFAULT 'Login failed! Invalid email or password.';

    -- Extract email and password from the JSON input
    SET v_email = JSON_UNQUOTE(JSON_EXTRACT(p, '$.email'));
    SET v_password = JSON_UNQUOTE(JSON_EXTRACT(p, '$.password'));

    -- Retrieve the hashed password and user ID from the users table
    SELECT id, password INTO v_user_id, v_stored_password
    FROM users
    WHERE email = v_email;

    -- Check if the retrieved password matches the input password
    IF v_user_id IS NOT NULL AND v_stored_password = v_password THEN
        SET v_success = 1;
        SET v_message = 'Login successful!';
    END IF;

    -- Return success and message
    SELECT v_success AS success, v_user_id AS userId, v_message AS message;
END;
```

### 4. Create `.env` File

Create a `.env` file in the root directory and configure your environment variables:

```env
DB_HOST=your_mysql_host
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

### 5. Run the Application

Start the server using the following command:

```bash
npm start
```

By default, the application will run on `http://localhost:3000`.

### 6. API Endpoints

Here are the main API endpoints:

- **POST `/api/users/signup`**  
  Endpoint for user registration.  
  **Payload:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "password": "123456"
  }
  ```

- **POST `/api/users/login`**  
  Endpoint for user login, which returns a JWT token upon successful authentication.  
  **Payload:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "123456"
  }
  ```

### 7. Testing the API

Use [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to test the API. Example payloads for signup and login are provided above.

### 8. JWT Authentication

For protected routes, include the JWT token in the `Authorization` header:

```bash
Authorization: Bearer <your_token>
```

### 9. Additional Notes

- Ensure your MySQL database is running and accessible via the credentials provided in the `.env` file.
- The stored procedures handle user authentication and password hashing via the API.
