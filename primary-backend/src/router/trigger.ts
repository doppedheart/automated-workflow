

import {Request, Response, Router} from "express";
import { prismaClient } from "../db";

const router = Router();

router.get('/available',async (req:Request,res:Response)=>{
    const availableTriggers = await prismaClient.availableTrigger.findMany({
        select:{
            name:true,
            id:true,
            image:true
        }
    })
    res.status(200).json({
        availableTriggers
    })
})

export const triggerRouter = router
