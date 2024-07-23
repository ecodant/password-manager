import api from './api';
import { Item, ItemInput } from '@/lib/types';

export async function fetchItems(): Promise<Item[]> {
  const response = await api.get('/items');
  return response.data;
}

export async function createItem(data: ItemInput): Promise<Item> {
  const response = await api.post('/items', data);

  return await response.data;
}

export async function updateItem(
  itemId: string,
  data: ItemInput,
): Promise<Item> {
  const response = await api.patch('/items/' + itemId, data);

  return await response.data;
}

export async function daleteItem(itemId: string) {
  await api.delete('/items/' + itemId);
}
