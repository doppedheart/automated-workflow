require('dotenv').config();
import {PrismaClient} from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import {Kafka} from "kafkajs";
import { parse } from "./parser";
import {sendEmail} from "./email";

const TOPIC_NAME="zap-events"
const prismaClient = new PrismaClient();

const kafka = new Kafka({
    clientId:"outbox-processor",
    brokers:['localhost:9092']
})
async function main(){
    const consumer = kafka.consumer({groupId:'main-worker'});
    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({topic:TOPIC_NAME,fromBeginning:true})
    
    await consumer.run({
        autoCommit:false,
        eachMessage:async ({topic,partition,message}) =>{
            console.log({
                partition,
                offset:message.offset,
                value:message.value?.toString(),
            })
            if(!message.value?.toString()){
                return;
            }
            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where:{
                    id:zapRunId
                },
                include:{
                    zap:{
                        include:{
                            actions:{
                                include:{
                                    type:true
                                }
                            }
                        }
                    }
                }
            })
            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);
            if(!currentAction){
                console.log("current action not found");
                return;
            }
            const zapRunMetadata = zapRunDetails?.metadata;

            if(currentAction.type.id === "email"){
                const body = parse((currentAction.metadata as JsonObject)?.body as string,zapRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string,zapRunMetadata);
                console.log(`sending out email to ${to} body is ${body}`)
                await sendEmail(to,body);
            }

            if(currentAction.type.id === "solana"){
                console.log("sending out sol")
            }  
            await new Promise(r => setTimeout(r,500));

            const lastStage = (zapRunDetails?.zap.actions?.length || 1) -1;
            if(lastStage !== stage){
                await producer.send({
                    topic:TOPIC_NAME,
                    messages:[{
                        value:JSON.stringify({ 
                            zapRunId, 
                            stage:parseInt(stage) + 1 
                        })
                    }]
                })
            }

            console.log("processing done");
            await consumer.commitOffsets([{
                topic:TOPIC_NAME,
                partition:partition,
                offset:(parseInt(message.offset) +1).toString() 
            }])
        }

    })
}

main();