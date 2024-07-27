import dotenv from "dotenv"
dotenv.config();


export const SOL_PRIVATE_KEY=process.env.SOL_PRIVATE_KEY ||""
export const SMTP_USERNAME=process.env.SMTP_USERNAME ||""
export const SMTP_PASSWORD=process.env.SMTP_PASSWORD ||""
export const SMTP_ENDPOINT=process.env.SMTP_ENDPOINT ||""


export const ETH_RPC_URL=process.env.ETH_RPC_URL || ""
export const WALLET_PRIVATE_KEY=process.env.WALLET_PRIVATE_KEY || ""