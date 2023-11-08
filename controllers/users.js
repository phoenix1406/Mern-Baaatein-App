import User from "../model/User.js";
export const getUser = async (req,res)=>{
   try{
     const {id}  =req.params;
     const user  = await User.findById(id);

     res.status(200).json(user);
   }catch(err){
    res.status(500).json({errors:err.message});
   }
};

export const getUserFriends =async (req,res)=>{
 try{
   const  {id}  =req.params;
   const user  = await User.findById(id);
   
   // we are going to make multiple call  to our  databases therefore we are using promise.all
   const friends = await Promise.all(
    //returning list of all freinds of user  we might have friends = [1,2,3];
    user.friends.map((id)=>User.findById(id))
   );

   const formattedfriends  = friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{
    return {_id,firstName,lastName,occupation,location,picturePath};
   });

   res.status(200).json(formattedfriends);
   
 }catch(err){
    res.status(500).json({error:err.message});
 }
};

export const addRemoveFriend =async (req,res)=>{
    try{
        const {id,friendId}  =req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // if he is friend then remove him 

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=>id !== friendId);
            friend.friends = friend.friends.filter((id)=>id !== id);
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();




        const friends = await Promise.all(
            //returning list of all freinds of user  we might have friends = [1,2,3];
            user.friends.map((id)=>User.findById(id))
           );
        
           const formattedfriends  = friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{
            return {_id,firstName,lastName,occupation,location,picturePath};
           });
        
           res.status(200).json(formattedfriends);



    }catch(err){
        res.status(500).json({error:err.message});
    }
}