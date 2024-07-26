"use client"
import { useEffect, useState } from "react";
import { AppBar } from "@/component/AppBar";
import { PrimaryButton } from "@/component/buttons/PrimaryButton";
import { Input } from "@/component/Input";
import { ZapCell } from "@/component/ZapCell";
import { BACKEND_URL } from "@/config";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

function useAvailableTriggersAndActions(){
    const [loading,setLoading] =useState(false);
    const [availableTriggers,setAvailableTriggers] = useState<{
        name:string;
        id:string;
        image:string;
    }[]>([])
    const [availableActions,setAvailableActions] = useState<{
        name:string;
        id:string;
        image:string;
    }[]>([])

    useEffect(()=>{
        setLoading(true);
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(res=> setAvailableTriggers(res.data.availableTriggers))
        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(res=> setAvailableActions(res.data.availableActions))
        setLoading(false);
    },[])


    return {
        loading,
        availableActions,
        availableTriggers
    }
}


export default function(){
    const { loading,availableActions, availableTriggers } = useAvailableTriggersAndActions();
    const [selectedModalIndex,setSelectedModalIndex]=useState<null|number>(null);
    const [selectedTrigger,setSelectedTrigger] = useState<{
        id:string;
        name:string;
    }>();
    const [selectedActions,setSelectedActions] =useState<{
        index:number;
        availableActionId:string;
        availableActionName:string;
        metadata:any;
    }[]>([])

    const router = useRouter();
    if(loading){
        return <div>
            loading...
        </div>
    }
    return (
    <div>
        <AppBar/>
        <div className="flex justify-end bg-slate-200 p-4">
            <PrimaryButton onClick={async ()=>{
                if(!selectedTrigger?.id){
                    return;
                }
                const response=await axios.post(`${BACKEND_URL}/api/v1/zap`,{
                        "availableTriggerId":selectedTrigger.id,
                        "triggerMetadata":{},
                        "actions":selectedActions.map(x=> ({
                            "availableActionId":x.availableActionId,
                            "actionMetadata":x.metadata
                        }))
                },{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                })
                router.push("/dashboard");
            }}>Publish</PrimaryButton>
        </div>
        <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
            <div className="flex justify-center w-full mb-4">
                <ZapCell onClick={()=>{
                    setSelectedModalIndex(1);
                }} name={selectedTrigger?.name ? selectedTrigger.name:"trigger"} index={1}/>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col justify-center gap-3">
                    {selectedActions.map((action,index)=> <div>
                        <ZapCell onClick={()=>{
                            setSelectedModalIndex(index+2)
                        }} name={action.availableActionName?action.availableActionName:"Action"} index={action.index} />
                    </div>)}
                </div>
            </div>
            <div className="flex justify-center">
                <div>
                    <PrimaryButton onClick={() => {
                        setSelectedActions(a => [...a, {
                            index: a.length + 2,
                            availableActionId: "",
                            availableActionName: "",
                            metadata: {}
                        }])
                    }}><div className="text-2xl">
                        +
                    </div></PrimaryButton>
                </div>
            </div>
        </div>
        {selectedModalIndex && 
            <Modal 
                index={selectedModalIndex} 
                availableItems={selectedModalIndex == 1 ? availableTriggers:availableActions}
                setSelect={(props:null|{name:string,id:string,metadata:any})=>{
                    if(props == null){
                        setSelectedModalIndex(null);
                        return;
                    }
                    if(selectedModalIndex === 1 ){
                        setSelectedTrigger({
                            id:props.id,
                            name:props.name
                        })
                    }else{
                        setSelectedActions(x => {
                            let newActions = [...x];
                            newActions[selectedModalIndex-2]={
                                index:selectedModalIndex,
                                availableActionId:props.id,
                                availableActionName:props.name,
                                metadata:props.metadata
                            }
                            return newActions
                        })

                    }   
                    setSelectedModalIndex(null);
                }}
            />}
    </div>
    )
}

function Modal({
    setSelect,
    availableItems,
    index,
}:{ 
    availableItems:{name:string,id:string,image:string}[];
    setSelect:(params:null| {name:string,id:string,metadata:any})=>void;
    index:number;
}) {
    const [step, setStep] = useState(0);
    const [selectedAction, setSelectedAction] = useState<{
        id: string;
        name: string;
    }>();
    const isTrigger = index === 1;
    return <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                    <div className="text-xl">
                        Select {index === 1 ? "Trigger" : "Action"}
                    </div>
                    <button onClick={() => {
                        setSelect(null);
                    }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                    {step ===1 && selectedAction?.id == "email" && <EmailSelector setMetadata={(metadata)=>{
                            setSelect({
                                ...selectedAction,
                                metadata
                            })
                        }}
                    />}
                    {step ===1 && selectedAction?.id == "solana" && <SolanaSelector setMetadata={(metadata)=>{
                            setSelect({
                                ...selectedAction,
                                metadata
                            })
                        }}
                    />}
                    {step === 0 && <div>
                        {availableItems.map(({id,name,image})=>{
                            return (
                                <div onClick={()=>{
                                    if(isTrigger){
                                        setSelect({
                                            id,
                                            name,
                                            metadata:{}
                                        })
                                    } else {
                                        setStep(s=>s+1);
                                        setSelectedAction({
                                            id,
                                            name
                                        })
                                    }
                                }} className="flex boarder p-4 cursor-pointer hover:bg-slate-100">
                                    <Image src={image} width={30} className="rounded-full" alt="icon" height={30}/>
                                    <div className="flex flex-col justify-center">
                                        {name}
                                    </div>
                                </div>  
                            )
                        })}
                        
                    </div>}

                </div>
            </div>
        </div>
    </div>

}

function EmailSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setEmail(e.target.value)}></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(e) => setBody(e.target.value)}></Input>
        <div className="pt-2">
            <PrimaryButton onClick={() => {
                setMetadata({
                    email,
                    body
                })
            }}>Submit</PrimaryButton>
        </div>
    </div>
}

function SolanaSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");    

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setAddress(e.target.value)}></Input>
        <Input label={"Amount"} type={"text"} placeholder="To" onChange={(e) => setAmount(e.target.value)}></Input>
        <div className="pt-4">
        <PrimaryButton onClick={() => {
            setMetadata({
                amount,
                address
            })
        }}>Submit</PrimaryButton>
        </div>
    </div>
}