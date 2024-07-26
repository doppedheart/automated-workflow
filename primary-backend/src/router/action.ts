

import {Request, Response, Router} from "express";
import { prismaClient } from "../db";

const router = Router();

router.get('/available',async (req:Request,res:Response)=>{
    const availableActions = await prismaClient.availableAction.findMany({
        select:{
            name:true,
            id:true,
            image:true
        }
    })
    res.status(200).json({
        availableActions
    })
})

export const actionRouter = router