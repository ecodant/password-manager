import { zodResolver } from '@hookform/resolvers/zod';
import { HttpError } from '@/errors/http_errors';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as UserService from '../../services/userService';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { useState } from 'react';

import { UserModel, LoginSchema, TLoginSchema } from '@/lib/types';

interface LoginModalFormProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLoginSucessful: (user: UserModel) => void;
}

export function LoginModal({
  isOpen,
  onOpenChange,
  onLoginSucessful,
}: LoginModalFormProps) {
  const [errorText, setErrorText] = useState<string | null>(null);

  async function onSubmit(credentials: TLoginSchema) {
    try {
      const user = await UserService.login(credentials);
      onOpenChange(false);
      onLoginSucessful(user);
    } catch (error) {
      if (error instanceof HttpError) {
        setErrorText(error.message);
        console.error(error);
      }
    }
  }

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login In</DialogTitle>
          <DialogDescription>
            Welcome to your favorite password manager!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            {errorText && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Ey!, Something bad happened</AlertTitle>
                <AlertDescription className="text-red-500">
                  {errorText}
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      type={'text'}
                      id={'email'}
                      placeholder={'email'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Master Password</FormLabel>
                  <FormControl>
                    <Input type="password" id={'password'} {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Login
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
