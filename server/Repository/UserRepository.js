import mongoose from "mongoose";

import User from "../Models/User.js";
/**
 * @param {*} variables | Set variables to remove from result
 * @example remove password, createdAt and updateAt from result
 * findAll("-password -createdAt -updatedAt")
 * @returns Users
 */
const findAll = (variables) => User.find().select(variables);

/**
 * @param {request  response  variables}
 * @example remove password, createdAt and updateAt from result
 * find(req,res,"-password -createdAt -updatedAt")
 * @returns Users
 */
const find = (req, res, variables) => {
  const ObjectId = mongoose.Types.ObjectId;

  const id = req.params.id;

  return !ObjectId.isValid(id)
    ? res.status(400).send("ID unknow :" + req.params.id)
    : User.findById(id, (err, docs) => {
        !err ? res.status(200).json(docs) : res.status(400).json(docs);
      }).select(variables);
};

export { findAll, find };
