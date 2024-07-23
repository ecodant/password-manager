import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../ui/use-toast';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

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
import { Item, ItemInput, ItemInputSchema } from '@/lib/types';
import {
  ArrowBigDown,
  ArrowBigUp,
  Copy,
  Heart,
  Eye,
  Terminal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
import * as ItemService from '../../services/ItemService';
import ItemDropMenu from './ItemDropMenu';

interface ItemFormProps {
  onItemSave: (item: Item) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  itemToEdit?: Item;
}
//For updates categories in the future
enum Categories {
  Work = 'Work',
  Personal = 'Personal',
  Social = 'Social',
  Banking = 'Banking',
  Other = 'Other',
}

export function ItemForm({
  onItemSave,
  itemToEdit,
  onOpenChange,
  isOpen,
}: ItemFormProps) {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [generatePass, setGeneratePass] = useState(false);
  const [revealPassword, setRevealPassword] = useState<string>('password');
  const { toast } = useToast();

  async function onSubmit(newItem: ItemInput) {
    try {
      let itemResponse: Item;
      if (itemToEdit)
        itemResponse = await ItemService.updateItem(itemToEdit._id, newItem);
      else itemResponse = await ItemService.createItem(newItem);
      onItemSave(itemResponse);
      onOpenChange(false);

      toast({
        title: 'Item Added',
        description: "You've have added a item",
      });
    } catch (error) {
      if (error instanceof HttpError) setErrorText(error.message);
      console.error(error);
    }
  }

  const form = useForm<ItemInput>({
    resolver: zodResolver(ItemInputSchema),
    defaultValues: {
      name: itemToEdit?.name || '',
      username: itemToEdit?.username || '',
      password: itemToEdit?.password || '',
      category: itemToEdit?.category || 'No category',
      favorite: itemToEdit?.favorite || false,
      url: itemToEdit?.url || '',
    },
  });

  useEffect(() => {
    if (generatedPassword) {
      // Set the generated password in the corresponding state
      form.setValue('password', generatedPassword);
    }
  }, [form, generatedPassword]);

  function handleCopiedPassword() {
    navigator.clipboard.writeText(
      form.control._defaultValues.password
        ? form.control._defaultValues.password
        : '',
    );
  }
  function handleRevealPassword() {
    revealPassword === 'password'
      ? setRevealPassword('text')
      : setRevealPassword('password');
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('password', event.target.value);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {itemToEdit ? 'Update the item' : 'Create new item'}
          </DialogTitle>
          <DialogDescription>
            Save your news passwords in the following:
          </DialogDescription>
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
                      placeholder={'name'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      type={'text'}
                      id={'username'}
                      placeholder={'username'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center space-x-2">
                      <Input
                        {...field}
                        type={revealPassword}
                        id="password"
                        value={field.value || generatedPassword}
                        onChange={handlePasswordChange}
                        onRevealCLicked={() => handleRevealPassword()}
                        onCopyClicked={() => handleCopiedPassword()}
                        startIcon={Eye}
                        endIcon={Copy}
                      />
                      {!generatePass && (
                        <ArrowBigDown
                          className="cursor-pointer"
                          onClick={() => setGeneratePass(true)}
                        />
                      )}
                      {generatePass && (
                        <ArrowBigUp
                          className="cursor-pointer"
                          onClick={() => setGeneratePass(false)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {generatePass && (
                    <ItemDropMenu setPassword={setGeneratedPassword} />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="url">URL</FormLabel>
                  <FormControl>
                    <Input type={'text'} id="url" placeholder={''} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-16 flex flex-row justify-around space-x-6 ">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-2/4 flex flex-row items-center justify-center space-x-4">
                    <Select onValueChange={field.onChange}>
                      <FormControl id="category">
                        <SelectTrigger className="w-[170px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {Object.values(Categories).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
              {itemToEdit ? 'Save Changes' : 'Add Item'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
