import UserModel from "../models/user.js";

export const getUser = async (req, res) => {
    try {
        
        const {id} = req.params;
        const user = await UserModel.findById(id)
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({message:err.message}); 
    }
}


export const getUserFriends = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await UserModel.findById(id)

        const friends = await Promise.all(
            user.friends.map((id) => UserModel.findById(id)) //user.friends is an array of id(elements are id of friends)
        ) //mongo queries always return promise
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picture }) => {
                return { _id, firstName, lastName, occupation, location, picture:picture.url }
            }
        )
        // res.status(200).json(req.user)
        res.status(200).json(formattedFriends)
    } catch (err) { 
        res.status(400).json({message:err.message});
    }

}


export const updateUserFriends = async (req, res) => {
    try {
        const {id, friendId} = req.params;
        const user = await UserModel.findById(id);
        const friend = await UserModel.findById(friendId);
        
        // if(!friend){ //this will happen only if the id is true in length but one or two characters are mismatched otherwise there will be cast error if too many changes
        //     return res.status(400).json("could not find friend")
        // }

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id)=>id !== friendId) //will return elements whose id is not friendId
            friend.friends = friend.friends.filter((id)=> id !==id)
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id)
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => UserModel.findById(id))
        )
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picture }) => {
                return { _id, firstName, lastName, occupation, location, picture:picture.url }
            }
        )

        res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(400).json({message:err.message});
    }
    // res.json('update user friends')
}
