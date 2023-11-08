import Post from "../model/Post.js";
import User from "../model/User.js";
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId :userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    console.log(post);
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ errors: err.message });
  }
};
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ errors: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId: userId });
    res.status(200).json(post);
  } catch (err) {
    res.status({ errors: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    // if a  given user has already liked a post then
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatePost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
};

export const commentPost = async(req,res)=>{
  try{
    const {id}  = req.params;
    const {content} = req.body;
    const post  = await Post.findById(id);

    post.comments.push(content);

    const updatedPost   =await Post.findByIdAndUpdate(
      id,
      {comments:post.comments},
      {new:true}
    );
    res.status(200).json(updatedPost);



  }catch(err){
    res.status(500).json({errors:err.message});
  }
}
