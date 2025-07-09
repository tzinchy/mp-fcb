import React, { useMemo, useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const defaultColumns = [
  { accessorKey: 'affair_id', header: 'ID' },
  { accessorKey: 'kpu', header: 'КПУ' },
  { accessorKey: 'fio', header: 'ФИО' },
  { accessorKey: 'house_address', header: 'Адрес дома' },
  { accessorKey: 'apart_number', header: 'Кв.' },
  { accessorKey: 'status', header: 'Статус' },
]

export default function AffairTableTanstack({ onRowClick }) {
  const [rawData, setRawData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sorting, setSorting] = useState([])

  // Фильтрация
  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase()
    return rawData.filter(
      row =>
        row.fio.toLowerCase().includes(lower) ||
        row.house_address.toLowerCase().includes(lower)
    )
  }, [searchTerm, rawData])

  const columns = useMemo(() => defaultColumns, [])

  useEffect(() => {
    fetch(`${backendUrl}/old_apart`)
      .then(res => res.json())
      .then(json => {
        const converted = Object.entries(json).map(([id, entry]) => ({
          affair_id: Number(id),
          ...entry,
        }))
        setRawData(converted)
      })
      .catch(err => {
        console.error('Ошибка при загрузке данных:', err)
      })
  }, [])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  })

  return (
    <div className="px-4">
      <div className="mb-2 grid-3">
        <input
          type="text"
          placeholder="Поиск по ФИО или адресу..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-[30vh] px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="overflow-hidden border border-gray-300 rounded">
        <div className="max-h-[calc(100vh-210px)] overflow-y-auto">
          <table className="min-w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 bg-white z-10 shadow">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const isSortable = header.column.getCanSort()
                    const sortDir = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        onClick={
                          isSortable
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className="px-3 py-2 border-b text-left font-medium cursor-pointer bg-white"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sortDir === 'asc'
                          ? ' ▲'
                          : sortDir === 'desc'
                          ? ' ▼'
                          : ''}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50" onClick={() => onRowClick?.(row.original)}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-3 py-2 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}