import { DataTable } from './Data-Table';
import { ItemForm } from '../forms/ItemForm';
import { getItemColums } from '@/components/tables/ItemColumns';
import { Item } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import * as ItemService from '../../services/ItemService';
import Loader from '../Loader';

export default function ItemTable() {
  const [itemsLoading, setItemsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const onEdit = useCallback((itemToEdit: Item) => {
    setSelectedItem(itemToEdit);
    setEditDialogOpen(true);
  }, []);

  async function onDelete(itemToDelete: Item) {
    try {
      await ItemService.daleteItem(itemToDelete._id);
      setItems(
        items.filter((existingItem) => existingItem._id !== itemToDelete._id),
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const columns = getItemColums({ onDelete, onEdit });

  useEffect(() => {
    async function loadItems() {
      try {
        const userItems = await ItemService.fetchItems();
        setItems(userItems);
        setItemsLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setItemsLoading(false);
      }
    }

    loadItems();
  }, []);

  return (
    <>
      <div className="w-full justify-center ">
        {itemsLoading && (
          <div className="w-full flex justify-center align-middle items-center">
            <Loader></Loader>
          </div>
        )}
        {!itemsLoading && (
          <DataTable
            setDialogOpen={setIsDialogOpen}
            columns={columns}
            data={items}
          />
        )}

        {isDialogOpen && (
          <ItemForm
            isOpen={isDialogOpen}
            onOpenChange={(value) => setIsDialogOpen(value)}
            onItemSave={(newItem) => {
              setItems([...items, newItem]);
            }}
          />
        )}

        {selectedItem && (
          <ItemForm
            itemToEdit={selectedItem}
            isOpen={editDialogOpen}
            onOpenChange={(value) => {
              if (!value) setSelectedItem(null);
            }}
            onItemSave={(updatedItem) => {
              setItems(
                items.map((existingItem) =>
                  existingItem._id === updatedItem._id
                    ? updatedItem
                    : existingItem,
                ),
              );
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </>
  );
}
