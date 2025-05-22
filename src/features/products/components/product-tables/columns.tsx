'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { WinePairing } from '../../types';

export const columns: ColumnDef<WinePairing>[] = [
  {
    accessorKey: 'photo_url',
    header: '',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square'>
          <Image
            src={row.getValue('photo_url')}
            alt={row.getValue('name')}
            fill
            className='rounded-lg'
            style={{ objectFit: 'contain', objectPosition: 'center' }}
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
        <div className="text-sm font text-gray-500">{row.original.dish}</div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
