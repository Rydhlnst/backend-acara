import { Request, Response } from "express";
import * as Yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;
    password: string;
}

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    userName: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required()
})

export default {
    async register(req: Request, res: Response) {
        /**
         #swagger.tags = ['Authentication']
         */
        const {
            confirmPassword, email, password, fullName, userName
        } = req.body as unknown as TRegister;

        try {
            await registerValidateSchema.validate({
                fullName, 
                userName,
                email,
                password,
                confirmPassword,
            });

            
            const result = await userModel.create({
                fullName, email, userName, password
            })

            res.status(200).json({
                message: "Success Registration!",
                data: {
                    result
                }
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    },

    async login(req: Request, res: Response) {
        /**
         #swagger.tags = ['Authentication']
         #swagger.requestBody = {
         required: true,
         schema: {$ref: "#components/schemas/LoginRequest"}}
         */
        const {identifier, password} = req.body as unknown as TLogin
        try {
            // Mengambil data user berdasarkan identifier -> Email / Username
            const userByIdentifier = await userModel.findOne({
                // Filter 2 data jika salah 1 ada, maka YES
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        userName: identifier,
                    }
                ]
            });

            // Jika tidak ada user yang tersimpan di DB
            if (!userByIdentifier) {
                return res.status(403).json({
                    message: "User not Found",
                    data: null
                });
            }
            // Validasi Password -> Memastikan password sudah sama / tidak (Dengan proses password yang dimasuki akan diencrypt lagi dan disesuaikan apakah sama)
            
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            // Jika password tidak sesuai 
            if (!validatePassword) {
                return res.status(403).json({
                    message: "User not Found",
                    data: null
                });
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            })

            // Jika kedua kondisi tersebut berhasil dilewati
            res.status(200).json({
                message: "Login Success",
                data: token
,            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    },

    // API AUTH ME
    async me(req: IReqUser, res: Response) {
        /**
         #swagger.tags = ['Authentication']
         #swagger.security = [{
            "bearerAuth": []
         }]
        */
        try {
            const user = req.user;
            const result = await userModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user profile",
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    }
}