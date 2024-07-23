import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardInput,
  CardInputSchema,
  Brands,
  Years,
  Months,
} from '@/lib/types';
import { Heart, Terminal } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HttpError } from '@/errors/http_errors';
import * as CardService from '../../services/CardService';

interface CardFormProps {
  onCardSave: (card: Card) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  cardToEdit?: Card;
}

export function CardForm({
  onCardSave,
  cardToEdit,
  onOpenChange,
  isOpen,
}: CardFormProps) {
  const [errorText, setErrorText] = useState<string | null>(null);
  const { toast } = useToast();

  async function onSubmit(newCard: CardInput) {
    try {
      let cardResponse: Card;
      if (cardToEdit)
        cardResponse = await CardService.updateCard(cardToEdit._id, newCard);
      else cardResponse = await CardService.createCard(newCard);
      onCardSave(cardResponse);
      onOpenChange(false);

      toast({
        title: 'Card Added',
        description: "You've have added new Card",
      });
    } catch (error) {
      if (error instanceof HttpError) setErrorText(error.message);
      console.error(error);
    }
  }

  const form = useForm<CardInput>({
    resolver: zodResolver(CardInputSchema),
    defaultValues: {
      name: cardToEdit?.name || '',
      cardHolderName: cardToEdit?.cardHolderName || '',
      cardNumber: cardToEdit?.cardNumber || '',
      expiredMonth: cardToEdit?.expiredMonth || Months.January,
      expiredYear: cardToEdit?.expiredYear || Years.Y2024,
      cardCode: cardToEdit?.cardCode || '',
      brand: cardToEdit?.brand || Brands.Other,
      favorite: cardToEdit?.favorite || false,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {cardToEdit ? 'Update the Card' : 'Create new card'}
          </DialogTitle>
          <DialogDescription>Take a look to your cards!</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-1"
          >
            {errorText && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Ey!, Something bad happened due to: </AlertTitle>
                <AlertDescription className="text-red-500 font-semibold">
                  {errorText}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      type={'text'}
                      id={'name'}
                      placeholder={''}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="cardHolderName">Holder Name</FormLabel>
                  <FormControl>
                    <Input
                      type={'text'}
                      id={'cardHolderName'}
                      placeholder={''}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="cardNumber">Number</FormLabel>
                  <FormControl>
                    <Input
                      type={'text'}
                      id="cardNumber"
                      placeholder={'Card Number'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-16 flex flex-row justify-between items-center ">
              <FormField
                control={form.control}
                name="expiredMonth"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={cardToEdit?.expiredMonth}
                    >
                      <FormControl id="month">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Month</SelectLabel>
                          {Object.values(Months).map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              /
              <FormField
                control={form.control}
                name="expiredYear"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={cardToEdit?.expiredYear}
                    >
                      <FormControl id="year">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Years</SelectLabel>
                          {Object.values(Years).map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardCode"
                render={({ field }) => (
                  <FormItem className="w-[80px]">
                    <FormControl>
                      <Input
                        type={'text'}
                        id="cardCode"
                        placeholder={'Code'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.expiredYear?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="h-16 flex flex-row justify-around space-x-6 ">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="w-2/4 flex flex-row items-center justify-center space-x-4">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={cardToEdit?.brand}
                    >
                      <FormControl id="brand">
                        <SelectTrigger className="w-[170px]">
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Brands</SelectLabel>
                          {Object.values(Brands).map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favorite"
                render={({ field }) => (
                  <FormItem className="w-2/4 flex flex-row items-center justify-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      Mark as favorite
                    </span>
                    <FormControl id="favorite">
                      <Heart
                        className={`cursor-pointer ${field.value ? 'text-red-400' : 'text-gray-400'} hover:text-red-500`}
                        fill={field.value ? '#F87171' : 'none'}
                        strokeWidth={1}
                        onClick={() => field.onChange(!field.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {cardToEdit ? 'Save Changes' : 'Add Card'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
