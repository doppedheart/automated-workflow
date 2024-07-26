"use client";"use client"
import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import { BACKEND_URL } from "@/config";
import { Divide } from "lucide-react";

interface Zap{
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": [
        {
            "id": string,
            "zapId": string,
            "actionId": string,
            "sortingOrder": number,
            "type": {
                "id": string,
                "name": string
            }
        },
        {
            "id": string,
            "zapId": string
            "actionId": string,
            "sortingOrder":number,
            "type": {
                "id": string,
                "name": string
            }
        }
    ],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string
        }
    }
}
const columns : ColumnDef<Zap>[]=[
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
    <div className="space-y-4">
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
