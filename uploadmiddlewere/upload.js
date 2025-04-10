const multer =require("multer");
const path = require("path");

const storage=multer.diskStorage({
    destination:"./uploads/",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+ Date.now()+path.extname(file.originalname));
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true)

    }else[
        cb(new Error("Only image is allowed"),false)
    ]
}
const upload=multer({
    storage:storage, fileFilter:fileFilter
})
module.exports= upload;