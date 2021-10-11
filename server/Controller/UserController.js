import mongoose from "mongoose";
import User from "../Models/User.js";
import * as UserRepository from "../Repository/UserRepository.js";

/**
 * *@Route('api/users/')
 * !GET
 */
const getUsers = async (req, res) => {
  const users = await UserRepository.findAll("-password -createdAt -updatedAt");
  res.status(200).json(users);
};

/**
 * *@Route('api/users/{id}')
 * !GET
 */
const getUser = async (req, res) => {
  updateUser;
  const user = await UserRepository.find(
    req,
    res,
    "-password -createdAt -updatedAt"
  );

  return user;
};

// expected output: 42

/**
 * *@Route('api/users/{id}')
 * !PATCH
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  // select from body only bio
  const { bio } = req.body;
  const updatedUser = {
    _id: id,
    bio,
  };
  console.log(updatedUser);

  try {
    const ObjectId = mongoose.Types.ObjectId;
    !ObjectId.isValid(id)
      ? res.status(400).send("ID unknow :" + id)
      : User.findOneAndUpdate(id, updatedUser, { new: true }, (err, docs) => {
          //* Send docs et remove variables with .selected || send updatedUser and selected is uesless
          err
            ? res.status(500).send({ message: err })
            : res.status(200).send(updatedUser);
        }).select("-password -createdAt -updatedAt -__v");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 * *@Route('api/users/{id}')
 * !DELETE
 */
const deleteUser = async (req, res) => {
  const ObjectID = mongoose.Types.ObjectId;
  const { id } = req.params;
  const userToDelete = {
    _id: id,
  };

  if (!ObjectID.isValid(id)) return res.status(400).send("ID unknown : " + id);

  try {
    await User.remove(userToDelete).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 * *@Route('api/users/{id}')
 * !PATCH
 */
const follow = async (req, res) => {
  const ObjectID = mongoose.Types.ObjectId;
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );
    // add to following list
    await User.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
/**
 * *@Route('api/users/{id}')
 * !PATCH
 */
const unfollow = async (req, res) => {
  const ObjectID = mongoose.Types.ObjectId;

  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await User.findByIdAndUpdate(
      req.params.id,
      // $pull => Add an id to followwing array
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );
    // remove to following list
    await User.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
export { getUser, getUsers, updateUser, deleteUser, follow, unfollow };
