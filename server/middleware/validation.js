// Validation middleware สำหรับ POST และ PUT posts
function validatePostData(data, isUpdate = false) {
    const errors = [];

    // สำหรับ PUT (update) - fields เป็น optional
    if (isUpdate) {
        // ตรวจสอบเฉพาะ fields ที่ส่งมา
        if (data.title !== undefined && typeof data.title !== 'string') {
            errors.push("Title must be a string");
        }
        if (data.image !== undefined && typeof data.image !== 'string') {
            errors.push("Image must be a string");
        }
        if (data.category_id !== undefined && typeof data.category_id !== 'number') {
            errors.push("Category_id must be a number");
        }
        if (data.description !== undefined && typeof data.description !== 'string') {
            errors.push("Description must be a string");
        }
        if (data.content !== undefined && typeof data.content !== 'string') {
            errors.push("Content must be a string");
        }
        if (data.status_id !== undefined && typeof data.status_id !== 'number') {
            errors.push("Status_id must be a number");
        }
    } else {
        // สำหรับ POST (create) - fields เป็น required
        if (!data.title) {
            errors.push("Title is required");
        } else if (typeof data.title !== 'string') {
            errors.push("Title must be a string");
        }

        if (!data.image) {
            errors.push("Image is required");
        } else if (typeof data.image !== 'string') {
            errors.push("Image must be a string");
        }

        if (data.category_id === undefined || data.category_id === null) {
            errors.push("Category_id is required");
        } else if (typeof data.category_id !== 'number') {
            errors.push("Category_id must be a number");
        }

        if (!data.description) {
            errors.push("Description is required");
        } else if (typeof data.description !== 'string') {
            errors.push("Description must be a string");
        }

        if (!data.content) {
            errors.push("Content is required");
        } else if (typeof data.content !== 'string') {
            errors.push("Content must be a string");
        }

        if (data.status_id === undefined || data.status_id === null) {
            errors.push("Status_id is required");
        } else if (typeof data.status_id !== 'number') {
            errors.push("Status_id must be a number");
        }
    }

    return errors;
}

// Middleware function สำหรับ PUT validation
function validatePutPost(req, res, next) {
    const validationErrors = validatePostData(req.body, true); // isUpdate = true
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            "message": validationErrors[0] // ส่ง error แรก
        });
    }
    
    next();
}

// Middleware function สำหรับ POST validation
function validatePostPost(req, res, next) {
    const validationErrors = validatePostData(req.body, false); // isUpdate = false
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            "message": validationErrors[0] // ส่ง error แรก
        });
    }
    
    next();
}

export { validatePutPost, validatePostPost };