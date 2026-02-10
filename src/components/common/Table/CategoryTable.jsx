import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";


import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from 'react';
import { IMG_BASE_URL } from '../../../config/Config';


// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'firstName', headerName: 'First name', width: 130 },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const paginationModel = { page: 0, pageSize: 5 };


// export const DataTable = () => {
//   return (
//     <Paper sx={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{ pagination: { paginationModel } }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         sx={{ border: 0 }}
//       />
//     </Paper>
//   );
// }

export const CategoryTable = ({ columns, adminListData, isLoading }) => {

  const data = adminListData;

  // 🔹 Step 2: Define Columns


  const [globalFilter, setGlobalFilter] = useState("");

  // 🔹 Step 3: Create Table Instance
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // 🔹 Step 4: Render
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className='border border-gray-200 rounded-2xl'>
        <div className='mb-3 flex justify-between items-center gap-4 p-2'>


          {/* Search Box */}
          <input
            type='text'
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 w-[300px] rounded-md text-[14px] outline-none bg-blue-50 appearance-none"
          />
          {/* Rows per page */}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-[#3d9bc7] rounded-md text-[14px] outline-none px-3 py-2"
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500 py-10 font-medium">
            Loading...
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-medium">
            {/* {statusFilter === "active" && "No active admins found."}
            {statusFilter === "inactive" && "No inactive admins found."}
            {statusFilter === "Suspend" && "No suspended admins found."}
            {statusFilter === "all" && "No admins available."} */}
            No category available.
          </div>
        ) : (
          <table className="w-full text-sm table-auto p-3 overflow-x-scroll ">
            <thead className="bg-gray-100 border-y border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`p-3 cursor-pointer ${header.column.columnDef.header === "Status"
                        ? "text-center"
                        : header.column.columnDef.header === "Action" || header.column.columnDef.header === "S.N"
                          ? "text-center" : "text-left"
                        }`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}
                  className="border-b border-b-[#E0E0E0] hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (

                    <td key={cell.id} className={`p-3 ${cell.column.columnDef.header === "Status"
                      ? "text-center"
                      : cell.column.columnDef.header === "Action" || cell.column.columnDef.header === "S.N"
                        ? "text-center flex justify-center" : "text-left"
                      }`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-end items-center mt-4 p-2">
          <div className='flex gap-2'>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 "
            >
              <FaCaretLeft />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1"
            >
              <FaCaretRight />
            </button>
          </div>

          <span className='text-[14px]'>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>


        </div>
      </div>
    </div>
  );
}