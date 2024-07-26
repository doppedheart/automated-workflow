import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();

const client = new PrismaClient();

app.use(express.json());

app.post('/hooks/catch/:userId/:zapId',async (req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    // store in dp a new trigger
    // push it on to a queue (kafka / redis )
    await client.$transaction(async tx =>{
        const run = await tx.zapRun.create({
            data:{
                zapId:zapId,
                metadata:body
            }
        })

        await tx.zapRunOutBox.create({
            data:{
                zapRunId:run.id
            }
        })
    })
    
    res.json({
        message:"webhook received"
    })
})
const PORT=3001
app.listen(PORT,()=>{
    console.log("server is listening on port ",PORT)
})