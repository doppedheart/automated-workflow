import {PrismaClient} from "@prisma/client"

const prismaClient = new PrismaClient();

async function main(){
    await prismaClient.availableTrigger.create({
        data:{
            id:"webhook",
            name:"Webhook",
            image:"https://seeklogo.com/images/W/webhooks-logo-04229CC4AE-seeklogo.com.png"
        }
    })

    await prismaClient.availableAction.create({
        data:{
            id:"email",
            name:"Email",
            image:"https://media.istockphoto.com/id/1125279178/vector/mail-line-icon.jpg?s=612x612&w=0&k=20&c=NASq4hMg0b6UP9V0ru4kxL2-J114O3TaakI467Pzjzw="
        }
    })

    await prismaClient.availableAction.create({
        data:{
            id:"solana",
            name:"solana",
            image:"https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png"
        }
    })
    await prismaClient.availableAction.create({
        data:{
            id:"ethereum",
            name:"Ethereum",
            image:"https://upload.wikimedia.org/wikipedia/commons/0/01/Ethereum_logo_translucent.svg"
        }
    })
}

main();