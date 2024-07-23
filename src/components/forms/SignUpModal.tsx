import { useForm } from 'react-hook-form';
import { SignUpSchema, TSignUpSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '../ui/button';
import { HttpError } from '@/errors/http_errors';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import * as UserService from '../../services/userService';

interface SignUpFormProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignUpModal({ isOpen, onOpenChange }: SignUpFormProps) {
  const [errorText, setErrorText] = useState<string | null>(null);
  const { toast } = useToast();

  const onSubmit = async (credentials: TSignUpSchema) => {
    try {
      const userReq = await UserService.signUp(credentials);
      onOpenChange(false);
      if (userReq) {
        toast({
          title: 'Sign Up Successfull',
          description: 'Please login with your correspond data',
        });
      }
    } catch (error) {
      if (error instanceof HttpError) {
        setErrorText(error.message);
        console.error(error);
      }
    }
  };

  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              The first step towards your safety
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              {errorText && (
                <Alert>
                  {' '}
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Ey!, and Error has occurred</AlertTitle>
                  <AlertDescription className="text-red-500">
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
                        placeholder={'Name'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

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
                        placeholder={'Email'}
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input type={'password'} id={'password'} {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                Sign Up
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
