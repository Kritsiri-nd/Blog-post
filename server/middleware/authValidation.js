// Validation middleware สำหรับ Auth endpoints

// Validation function สำหรับ register
function validateRegisterData(data) {
    const errors = [];

    // ตรวจสอบว่า data มีค่าหรือไม่
    if (!data || typeof data !== 'object') {
        errors.push("Request body is required");
        return errors;
    }

    // ตรวจสอบ email
    if (!data.email) {
        errors.push("Email is required");
    } else if (typeof data.email !== 'string') {
        errors.push("Email must be a string");
    } else if (!data.email.includes('@')) {
        errors.push("Email must be a valid email address");
    }

    // ตรวจสอบ password
    if (!data.password) {
        errors.push("Password is required");
    } else if (typeof data.password !== 'string') {
        errors.push("Password must be a string");
    } else if (data.password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }

    // ตรวจสอบ username
    if (!data.username) {
        errors.push("Username is required");
    } else if (typeof data.username !== 'string') {
        errors.push("Username must be a string");
    } else if (data.username.length < 3) {
        errors.push("Username must be at least 3 characters");
    }

    // ตรวจสอบ name
    if (!data.name) {
        errors.push("Name is required");
    } else if (typeof data.name !== 'string') {
        errors.push("Name must be a string");
    } else if (data.name.length < 2) {
        errors.push("Name must be at least 2 characters");
    }

    return errors;
}

// Validation function สำหรับ login
function validateLoginData(data) {
    const errors = [];

    // ตรวจสอบว่า data มีค่าหรือไม่
    if (!data || typeof data !== 'object') {
        errors.push("Request body is required");
        return errors;
    }

    // ตรวจสอบ email
    if (!data.email) {
        errors.push("Email is required");
    } else if (typeof data.email !== 'string') {
        errors.push("Email must be a string");
    } else if (!data.email.includes('@')) {
        errors.push("Email must be a valid email address");
    }

    // ตรวจสอบ password
    if (!data.password) {
        errors.push("Password is required");
    } else if (typeof data.password !== 'string') {
        errors.push("Password must be a string");
    }

    return errors;
}

// Validation function สำหรับ reset password
function validateResetPasswordData(data) {
    const errors = [];

    // ตรวจสอบว่า data มีค่าหรือไม่
    if (!data || typeof data !== 'object') {
        errors.push("Request body is required");
        return errors;
    }

    // ตรวจสอบ currentPassword
    if (!data.currentPassword) {
        errors.push("Current password is required");
    } else if (typeof data.currentPassword !== 'string') {
        errors.push("Current password must be a string");
    }

    // ตรวจสอบ newPassword
    if (!data.newPassword) {
        errors.push("New password is required");
    } else if (typeof data.newPassword !== 'string') {
        errors.push("New password must be a string");
    } else if (data.newPassword.length < 6) {
        errors.push("New password must be at least 6 characters");
    }

    return errors;
}

// Middleware function สำหรับ register validation
function validateRegister(req, res, next) {
    const validationErrors = validateRegisterData(req.body);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            "error": validationErrors[0] // ส่ง error แรก
        });
    }
    
    next();
}

// Middleware function สำหรับ login validation
function validateLogin(req, res, next) {
    const validationErrors = validateLoginData(req.body);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            "error": validationErrors[0] // ส่ง error แรก
        });
    }
    
    next();
}

// Middleware function สำหรับ reset password validation
function validateResetPassword(req, res, next) {
    const validationErrors = validateResetPasswordData(req.body);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            "error": validationErrors[0] // ส่ง error แรก
        });
    }
    
    next();
}

export { validateRegister, validateLogin, validateResetPassword };
