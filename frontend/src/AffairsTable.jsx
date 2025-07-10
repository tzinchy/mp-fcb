import React, { useMemo, useEffect, useState } from 'react'
import { forwardRef, useImperativeHandle } from "react";
import { parseISO, format } from 'date-fns'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const defaultColumns = [
//   { accessorKey: 'affair_id', header: 'ID' },
//   { accessorKey: 'kpu', header: 'КПУ' },
  {
    header: 'КПУ',
    accessorKey: 'kpu',
    cell: ({ row }) => {
      const d = row.original
      return (
        <div className="leading-tight">
          <div>{d.kpu}</div>
          <div className="text-gray-500 text-xs">{d.fio}</div>
        </div>
      )
    },
  },
{
  header: 'Дата выявления',
  accessorKey: 'created_at',
  cell: ({ row }) => {
    const d = row.original
    const dateStr = d.created_at
    let content = '-'
    let formattedDate = '-'

    if (dateStr) {
      const statusDate = new Date(dateStr)
      const now = new Date()
      const diffTime = now - statusDate
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      content = `прошло ${diffDays} дн.`

      try {
        formattedDate = format(parseISO(dateStr), 'dd.MM.yyyy HH:mm')
      } catch {
        formattedDate = '-'
      }
    }

    return (
      <div className="leading-tight">
        <div>{formattedDate}</div>
        <div className="text-gray-500 text-xs">{content}</div>
      </div>
    )
  },},
//   { accessorKey: 'fio', header: 'ФИО' },
  {
    header: 'Адрес',
    accessorKey: 'house_address',
    cell: ({ row }) => {
      const d = row.original
      return (
        <div className="leading-tight">
          <div>{d.house_address}</div>
          <div className="text-gray-500 text-xs">{d.district}, {d.municipal_district}</div>
        </div>
      )
    },
  },
  { accessorKey: 'apart_number', header: 'Кв.' },
    
  {
    header: 'Проблемы',
    accessorKey: 'problems',
    cell: ({ row }) => {
      const d = row.original
      return (
        <div className="leading-tight">
          {Array.isArray(d.problems) && d.problems.length > 0 ? (
            <div>
              {d.problems.map((p, i) => (
                <div>{p}</div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 italic">нет</div>
          )}
        </div>
      )
    },
  },

  {
    header: 'Статус',
    accessorKey: 'status',
    cell: ({ row }) => {
      const d = row.original
      return (
        <div className="leading-tight">
          <div>{d.status}</div>
          {d.status_date && (
            <div className="text-gray-500 text-xs">{format(parseISO(d.status_date), 'dd.MM.yyyy HH:mm')}</div>
          )}
        </div>
      )
    },
  },

  {
    header: 'Активный этап',
    accessorKey: 'active_stage',
    cell: ({ row }) => {
      const d = row.original
      return (
        <div className="leading-tight">
          <div>{d.last_stage_name}</div>
          {d.last_stage_date && (
            <div className="text-gray-500 text-xs">{format(parseISO(d.last_stage_date), 'dd.MM.yyyy HH:mm')}</div>
          )}
        </div>
      )
    },
  },
]

const AffairTableTanstack = forwardRef(function AffairTableTanstack(props, ref) {
  const [rawData, setRawData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sorting, setSorting] = useState([]);
  const [filterProblems, setFilterProblems] = useState('');
const [filterDistrict, setFilterDistrict] = useState('');
const [filterStage, setFilterStage] = useState('');

const filteredData = useMemo(() => {
  const lower = searchTerm.toLowerCase();

  return rawData.filter(row => {
    const matchSearch =
      (row.kpu ?? '').toLowerCase().includes(lower) ||
      (row.house_address ?? '').toLowerCase().includes(lower);

    const matchProblem =
      !filterProblems || (row.problems || []).includes(filterProblems);

    const matchDistrict =
      !filterDistrict || row.district === filterDistrict;

    const matchStage =
      !filterStage || row.status === filterStage;

    return matchSearch && matchProblem && matchDistrict && matchStage;
  });
}, [searchTerm, filterProblems, filterDistrict, filterStage, rawData]);

  const columns = useMemo(() => defaultColumns, [])

  const loadData = () => {
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
  };


  useEffect(() => {
    loadData();
  }, []);

  useImperativeHandle(ref, () => ({
    reload: () => loadData(),
  }));

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
<div className="mb-2 flex gap-2 flex-wrap">
  <input
    type="text"
    placeholder="Поиск по КПУ или адресу..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded"
  />

  <select
    value={filterProblems}
    onChange={e => setFilterProblems(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded"
  >
    <option value="">Проблема</option>
    {Array.from(new Set(rawData.flatMap(row => row.problems || []))).map((prob, i) => (
      <option key={i} value={prob}>{prob}</option>
    ))}
  </select>

  <select
    value={filterDistrict}
    onChange={e => setFilterDistrict(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded"
  >
    <option value="">Округ</option>
    {Array.from(new Set(rawData.map(row => row.district))).map((d, i) => (
      <option key={i} value={d}>{d}</option>
    ))}
  </select>

  <select
    value={filterStage}
    onChange={e => setFilterStage(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded"
  >
    <option value="">Статус</option>
    {Array.from(new Set(rawData.map(row => row.status))).map((s, i) => (
      <option key={i} value={s}>{s}</option>
    ))}
  </select>
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
                <tr key={row.id} className="hover:bg-gray-50" onClick={() => props.onRowClick?.(row.original)}>
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
})

export default AffairTableTanstack;