import { useQuery } from '@tanstack/react-query';
import { useTable, useSortBy, usePagination, useGlobalFilter } from '@tanstack/react-table';
import axios from 'axios';
import { Input } from '@shadcn/ui';  // Shadcn components

// Fetch data using React Query
const fetchUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

export default function UserTable() {
  const { data, error, isLoading } = useQuery(['users'], fetchUsers);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Name',
        accessor: 'name',
        Filter: ({ column }) => (
          <Input
            placeholder="Filter by Name"
            value={column.filterValue || ''}
            onChange={e => column.setFilterValue(e.target.value)}
          />
        )
      },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone', accessor: 'phone' },
      { Header: 'Website', accessor: 'website' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter, // Global Search functionality
    useSortBy, // Sorting functionality
    usePagination // Pagination functionality
  );

  return (
    <div>
      {/* Global Search Input */}
      <Input
        type="text"
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search Users"
      />
      
      {/* Table */}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page {pageIndex + 1} of {pageCount}
        </span>
      </div>
    </div>
  );
}
