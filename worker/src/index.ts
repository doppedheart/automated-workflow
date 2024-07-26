import {PrismaClient} from "@prisma/client";
import {Kafka} from "kafkajs";
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
            if(currentAction.type.id === "email"){
                console.log("sending out an email")
            }

            if(currentAction.type.id === "solana"){
                console.log("sending out sol")
            }  
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


            await consumer.commitOffsets([{
                topic:TOPIC_NAME,
                partition:partition,
                offset:(parseInt(message.offset) +1).toString() 
            }])
        }

    })
}

main();