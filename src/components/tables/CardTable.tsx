import { DataTable } from './Data-Table';
import { CardForm } from '../forms/CardForm';
import { getCardColumns } from '@/components/tables/columns/CardColumns';
import { Card } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import * as CardService from '../../services/CardService';
import Loader from '../Loader';

export default function ItemTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [cards, setCards] = useState<Card[]>([]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const onEdit = useCallback((cardToEdit: Card) => {
    setSelectedCard(cardToEdit);
    setEditDialogOpen(true);
  }, []);

  async function onDelete(cardToDelete: Card) {
    try {
      await CardService.deleteCard(cardToDelete._id);
      setCards(
        cards.filter((existingCard) => existingCard._id !== cardToDelete._id),
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const columns = getCardColumns({ onDelete, onEdit });

  useEffect(() => {
    async function loadCards() {
      try {
        const userCards = await CardService.fetchCards();
        setCards(userCards);
        cards.map((card) => console.log(card.expiredYear));
        setIsLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCards();
  }, []);

  return (
    <>
      <div className="w-full justify-center ">
        {isLoading && (
          <div className="w-full flex justify-center align-middle items-center">
            <Loader></Loader>
          </div>
        )}
        {!isLoading && (
          <DataTable
            setDialogOpen={setIsDialogOpen}
            columns={columns}
            data={cards}
          />
        )}

        {isDialogOpen && (
          <CardForm
            isOpen={isDialogOpen}
            onOpenChange={(value) => setIsDialogOpen(value)}
            onCardSave={(newCard) => {
              setCards([...cards, newCard]);
            }}
          />
        )}

        {selectedCard && (
          <CardForm
            cardToEdit={selectedCard}
            isOpen={editDialogOpen}
            onOpenChange={(value) => {
              if (!value) setSelectedCard(null);
            }}
            onCardSave={(updatedCard) => {
              setCards(
                cards.map((existingCard) =>
                  existingCard._id === updatedCard._id
                    ? updatedCard
                    : existingCard,
                ),
              );
              setSelectedCard(null);
            }}
          />
        )}
      </div>
    </>
  );
}
