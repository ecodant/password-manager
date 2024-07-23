import api from './api';
import { Card, CardInput } from '@/lib/types';

export async function fetchCards(): Promise<Card[]> {
  const response = await api.get('/cards');
  return response.data;
}

export async function createCard(data: CardInput): Promise<Card> {
  const response = await api.post('/cards', data);
  return await response.data;
}

export async function updateCard(
  cardId: string,
  data: CardInput,
): Promise<Card> {
  const response = await api.patch('/cards/' + cardId, data);

  return await response.data;
}

export async function deleteCard(cardId: string) {
  await api.delete('/cards/' + cardId);
}
