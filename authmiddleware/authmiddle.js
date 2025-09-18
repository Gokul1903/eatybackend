const jwt=require('jsonwebtoken')
const Authmiddleware=(req,res,next)=>{
    const token=req.cookies.token ||    req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(400).json({success: false,message:"unauthorised"});

    }
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decode
        next()
    } catch (error) {
        return res.status(401).json({success: false, message: "Invalid Token" });
    }

}
const AuthmiddlewareoWNER = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
        
    }

    try {
        const decode = jwt.verify(token, process.env.OWNER_SECRET);
        req.userId = decode.userId;  
        req.user = decode;
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};
const AuthmiddlewareAdmin = (req, res, next) => {
    const token = req.cookies.admin_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decode = jwt.verify(token, process.env.ADMIN_SECRET);
        req.user = decode; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports={Authmiddleware,AuthmiddlewareoWNER,AuthmiddlewareAdmin}