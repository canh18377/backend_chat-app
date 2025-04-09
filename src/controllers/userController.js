const { statusCode, responseCode, message, sendResponse } = require('../utils/responseCode');
const UserSchema = require("../models/user");

class UserController {
    // Fetch a user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserSchema.findOne({ idUser: id !== "null" ? id : req.user.idUser });  // Assuming `idUser` is the unique identifier for a user.

            if (!user) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "User not found.");
            }
            return sendResponse(res, responseCode.success, statusCode.success, { user }, "User fetched successfully.");

        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Create a new user
    async createUser(req, res) {
        try {
            const { idUser, name, email, avatar } = req.body;

            // Check if the user already exists
            const existingUser = await UserSchema.findOne({ idUser });

            if (existingUser) {
                return sendResponse(res, responseCode.conflict, statusCode.fail, {}, "User with this ID already exists.");
            }

            const newUser = new UserSchema({
                idUser,
                name,
                email,
                avatar
            });

            await newUser.save();

            return sendResponse(res, responseCode.success, statusCode.success, { newUser }, "User created successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Update a user by ID
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, avatar } = req.body;

            const updatedUser = await UserSchema.findOneAndUpdate(
                { idUser: id },
                { name, email, avatar },
                { new: true }
            );

            if (!updatedUser) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "User not found.");
            }

            return sendResponse(res, responseCode.success, statusCode.success, { updatedUser }, "User updated successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Delete a user by ID
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const deletedUser = await UserSchema.findOneAndDelete({ idUser: id });

            if (!deletedUser) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "User not found.");
            }

            return sendResponse(res, responseCode.success, statusCode.success, {}, "User deleted successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }

    // Get all users (if needed)
    async getUsers(req, res) {
        try {
            const users = await UserSchema.find();  // Optionally add filtering or pagination here

            return sendResponse(res, responseCode.success, statusCode.success, { users }, "Users fetched successfully.");
        } catch (error) {
            console.log(error);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred.");
        }
    }
}

module.exports = new UserController();
