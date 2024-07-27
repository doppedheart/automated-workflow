import Web3 from 'web3';
import { ETH_RPC_URL, WALLET_PRIVATE_KEY } from '../config';

const web3 = new Web3(ETH_RPC_URL)

export async function sendEth(address:string,amount:string){
    try{
        const privateKey = WALLET_PRIVATE_KEY.startsWith('0x') ? WALLET_PRIVATE_KEY : `0x${WALLET_PRIVATE_KEY}`;
        
        // Ensure the private key length is correct
        if (privateKey.length !== 66) {
            throw new Error('Invalid private key length. Private key must be 64 characters long, excluding the 0x prefix.');
        }
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const nonce = await web3.eth.getTransactionCount(account.address, 'latest');
        const tx = {
            from: account.address,
            to: address,
            nonce: nonce,
            value: web3.utils.toWei(amount, 'ether'),
            gas: 2000000,
            maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei'),
            maxFeePerGas: web3.utils.toWei('100', 'gwei')
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, WALLET_PRIVATE_KEY);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Transaction successful");
    }catch(e){
        console.log(e);
    }
}