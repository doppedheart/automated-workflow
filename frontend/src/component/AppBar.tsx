"use client";
import { useRouter } from "next/navigation"
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton";

export const AppBar = ({
    isMain=false
}:{
    isMain?:boolean;
}) => {
    const router = useRouter();
    return <div className="flex border-b justify-between p-4">
        <div className="flex flex-col justify-center text-2xl font-extrabold cursor-pointer" onClick={()=>router.push("/")}>
            Zapier
        </div>
        <div className="flex">
            <div className="pr-4">
                <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
            </div>
            {isMain?<>
                <div className="pr-4">
                    <LinkButton onClick={() => {
                        router.push("/login")
                    }}>Login</LinkButton>
                </div>
                <PrimaryButton onClick={() => {
                    router.push("/signup")
                }}>
                    Sign up
                </PrimaryButton> 
            </>: <PrimaryButton onClick={() => {
                    localStorage.removeItem("token")
                    router.push("/")
                }}>
                    Log Out
                </PrimaryButton>
            }          
        </div>
    </div>
}