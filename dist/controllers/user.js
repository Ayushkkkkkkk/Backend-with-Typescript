import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, role, _id, dob } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            gender,
            role,
            _id,
            dob,
        });
        return res.status(300).json({
            sucess: true,
            message: `welcome , ${user.name}`,
        });
    }
    catch (error) {
        res.status(300).json({
            sucess: true,
            message: `welcome , ${error}`,
        });
    }
};
