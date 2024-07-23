import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Trash,
  Heart,
  Copy,
} from 'lucide-react';
import { Item } from '@/lib/types';

interface itemColumsProps {
  onDelete: (itemToDelete: Item) => void;
  onEdit: (itemToEdit: Item) => void;
}

export const getItemColums = ({
  onDelete,
  onEdit,
}: itemColumsProps): ColumnDef<Item>[] => [
  {
    accessorKey: 'name',
    header: () => <div className="text-left">Item</div>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row font-medium space-x-2">
          {/* <img src="https://www.google.com/s2/favicons?domain=https://co.pinterest.com/&sz=128"></img> */}
          <div className=" flex justify-center w-12 h-9 border border-gray-300 rounded p-1">
            <img
              src={
                'https://www.google.com/s2/favicons?domain=' +
                row.original.url +
                '/&sz=32'
              }
            ></img>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900">{row.original.name}</span>
            <span className="text-gray-500">{row.original.username}</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          className="w-36 flex text-left justify-start items-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Added At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-36 text-left text-sm font-medium pl-3">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          })}
        </div>
      );
    },
  },

  {
    accessorKey: 'favorite',
    header: ({ column }) => {
      return (
        <Button
          className="w-28"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Favorite
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-28 flex items-center justify-center text-center font-medium">
          <Heart
            className={`${row.original.favorite ? 'text-red-400' : 'text-gray-400'} `}
            fill={row.original.favorite ? '#F87171' : 'none'}
            strokeWidth={1}
            onClick={() =>
              console.log(`Favorite clicked for ${row.original.name}`)
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => <div className="text-left">Category</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.password)
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onEdit(row.original);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  onDelete(row.original);
                  e.stopPropagation();
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 50,
  },
];