import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useState } from 'react'

const defaultData = [
  { affair_id: 1, fio: 'Иванов И.И.', house_address: 'г. Москва, ВАО, Богородское, Миллионная ул., д.15 кор.2', apart_number: '12', status: 'В работе', problems: {} },
  { affair_id: 2, fio: 'Сидоров С.С.', house_address: 'г. Москва, ВАО, Богородское, Миллионная ул., д.15 кор.2', apart_number: '23', status: 'Завершено', problems: {} },
  { affair_id: 3, fio: 'Петров П.П.', house_address: 'г. Москва, ВАО, Богородское, Миллионная ул., д.16', apart_number: '56', status: 'Не начато', problems: {} },
]

const defaultColumns = [
  {
    accessorKey: 'affair_id',
    header: 'ID',
  },
  {
    accessorKey: 'fio',
    header: 'ФИО',
  },
  {
    accessorKey: 'house_address',
    header: 'Адрес дома',
  },
  {
    accessorKey: 'apart_number',
    header: 'Кв.',
  },
  {
    accessorKey: 'status',
    header: 'Статус',
  },
]

export default function AffairTableTanstack() {
  const [data] = useState(() => defaultData)
  const [sorting, setSorting] = useState([])
  const [selectedRowId, setSelectedRowId] = useState();
  const columns = useMemo(() => defaultColumns, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  })

  return (
    <div className="p-4">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isSortable = header.column.getCanSort()
                const sortDir = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-3 py-2 border-b text-left font-medium cursor-${isSortable ? 'pointer' : 'default'}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sortDir === 'asc' ? ' ▲' : sortDir === 'desc' ? ' ▼' : ''}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-3 py-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}