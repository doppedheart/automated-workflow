"use client";
import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table"
import { useEffect, useState } from "react";
import { AppBar } from "@/component/AppBar";
import { DarkButton } from "@/component/buttons/DarkButton";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL, HOOK_URL } from "@/config";
import Image from "next/image";
import { LinkButton } from "@/component/buttons/LinkButton";


interface Zap{
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": [
        {
            "id": string,
            "zapId": string
            "actionId": string,
            "sortingOrder":number,
            "type": {
                "id": string,
                "name": string,
                "image":string,
            }
        }
    ],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image":string,
        }
    }
}
const columns : ColumnDef<Zap>[]=[
    {
        id: "name",
        header:"webFlow",
        cell:({row})=>{
            const value=row.original;
            return (
                <div className="flex ">
                    <Image src={value.trigger.type.image} alt={"trigger"} width={30} height={30}/> 
                    {value.actions.map(z=><Image src={z.type.image} alt="action" width={30} height={30}/>)}
                </div>
            )
        },
    },{
        id: "id",
        header:"ID",
        cell:({row})=>{
            const value =row.original
            return (
                <div>{value.id}</div>
            )
        },
    },{
        id: "createdAt",
        header:"Created At",
        cell:()=>{
            return (
                <div>Nov 13, 2024</div>
            )
        },
    },{
        id: "webhook",
        header:"webhook url",
        cell:({row})=>{
            const value =row.original
            return (
                <div>{`${HOOK_URL}/hooks/catch/1/${value.id}`}</div>
            )
        },
    },{
        id: "Go",
        header:"Go",
        cell:({row})=>{
            const router = useRouter();
            const value =row.original;
            return (
                <div><LinkButton onClick={()=>{
                    router.push("/zap/"+value.id)
                }}>Go</LinkButton></div>
            )
        },
    },
]

function useZaps(){
    const [loading,setLoading] = useState(false);
    const [zaps,setZaps] =useState<Zap[]>([]);

    useEffect(()=>{
        setLoading(true);
        axios.get(`${BACKEND_URL}/api/v1/zap`,{
            headers:{
                "Authorization":localStorage.getItem("token")
            }
        }).then((res)=>{
            setZaps(res.data.zaps)
            setLoading(false);
        })
    },[])

    return {
        loading,zaps
    }
}

export default function(){
    const {loading,zaps} = useZaps();
    const router =useRouter()
    return <div>
        <AppBar/>
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg w-full">
                <div className="flex justify-between pr-8"> 
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={()=>{
                        router.push("/zap/create")
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading?"loading...":<div className="flex justify-center">
            <DataTable data={zaps} columns={columns}/>
        </div>}
    </div>
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="mt-12 max-w-screen-lg">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
