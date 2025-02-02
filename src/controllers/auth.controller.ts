import { Request, Response } from "express";
import * as Yup from "yup";
import userModel from "../models/user.model";

type TRegister = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    userName: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required()
})

export default {
    async register(req: Request, res: Response) {
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
}