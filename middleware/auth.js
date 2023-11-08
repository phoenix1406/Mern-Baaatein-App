import jwt from "jsonwebtoken";
export const verifyToken = (req,res,next) =>{

  console.log(req.header("authorization"));
 
    try{
  
      let token = req.header("authorization");
      if(!token){
        res.status(403).send("Access Denied");
      }

      if(token.startsWith("Bearer ")){
        // getting token from front end from 0 character to length -1 character
        token = token.slice(7,token.length).trimLeft();

      }
      
      const verified = jwt.verify(token,process.env.JWT_SECRET);
      req.user = verified;

      
  
      
      next();


    }catch(err){
        res.status(500).json({error:err.message, Problem: "response in middleware"});
    }
}