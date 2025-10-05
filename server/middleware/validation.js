// Validation middleware สำหรับ PUT posts เท่านั้น
function validatePutData(data) {
    const errors = [];

    // ตรวจสอบเฉพาะ fields ที่ส่งมา (PUT - fields เป็น optional)
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

    return errors;
}

// Middleware function สำหรับ PUT validation
function validatePutPost(req, res, next) {
    const validationErrors = validatePutData(req.body);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            "message": validationErrors[0] // ส่ง error แรก
        });
    }
    
    next();
}

export { validatePutPost };
