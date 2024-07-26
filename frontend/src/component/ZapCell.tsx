

export function ZapCell({
    onClick,
    name,
    index=1
}:{
    onClick:()=>void;
    name:string;
    index:number;
}){
    return (
        <div onClick={onClick} className="border border-slate-600 hover:border-black py-8 px-8 w-[300px] justify-center cursor-pointer">
            <div className="flex text-xl">
                <div className="font-bold">
                    {index}. 
                </div>
                <div>
                    {name}
                </div>
            </div>
        </div>
    )
}