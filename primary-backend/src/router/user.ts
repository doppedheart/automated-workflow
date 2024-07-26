import {Router} from "express";
import { authMiddleware } from "../middleware";
import { SigninData, SignupData } from "../types";
import { prismaClient } from "../db";
import { JWT_PASSWORD } from "../config";
import jwt from 'jsonwebtoken'
const router = Router();

router.post("/signup",async (req,res)=>{
    const body = req.body;
    const parsedData = SignupData.safeParse(body);
    if(!parsedData.success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }

    const userExists = await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.username
        }
    })

    if(userExists){
        return res.status(403).json({
            message:"user already exists"
        })
    }
    //todo hash the password
    await prismaClient.user.create({
        data:{
            email:parsedData.data.username,
            password:parsedData.data.password,
            name:parsedData.data.name
        }
    })

    // await sendEmail();

    return res.json({
        message:"please verify your account by checking your email"
    })
})

router.post("/signin",async (req,res)=>{
    const body = req.body;
    const parsedData = SigninData.safeParse(body);
    if(!parsedData.success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }

    const user = await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.username,
            password:parsedData.data.password
        }
    })

    if(!user){
        return res.status(403).json({
            message:"user not found or invalid credentials"
        })
    }

    // sign the jwt 

    const token = jwt.sign({
        id:user.id
    },JWT_PASSWORD)

    res.status(200).json({
        token:token,
    })
})

router.get("/",authMiddleware,async (req,res)=>{
    //Todo :fix the type
    // @ts-ignore

    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where:{
            id
        },
        select:{
            name:true,
            email:true
        }
    })

    return res.json({
        user
    })
})

export const userRouter = router;