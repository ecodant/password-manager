import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Terminal, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HttpError } from '../errors/http_errors';
import * as UserService from '../services/userService';
import {
  PasswordFormData,
  passwordSchema,
  UserModel,
  UserUpdateInput,
} from '@/lib/types';
import { fallBack } from '../lib/utils';
interface ProfileSettingProps {
  loggedUser: UserModel;
  onCancelClicked: () => void;
  onLoginSucessful: (user: UserModel) => void;
  onPasswordChange: () => void;
}
export function ProfileSettings({
  onLoginSucessful,
  loggedUser,
  onCancelClicked,
  onPasswordChange,
}: ProfileSettingProps) {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [deletePicture, setDeletePicture] = useState(false);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>('');

  async function onSubmitPassword(newPassword: PasswordFormData) {
    try {
      await UserService.updatePassword(newPassword);
      toast({
        title: 'Password Changed Sucessfully',
        description: 'Your Sessions has be closed, so Login again please',
      });
      onPasswordChange();
    } catch (error) {
      if (error instanceof HttpError) {
        setErrorText(error.message);
        console.error(error);
      }
    }
  }

  async function onSubmitUser(credentials: UserModel) {
    try {
      const user = await UserService.updateUser(credentials);
      onLoginSucessful(user);
      toast({
        title: 'Profile Updated',
        description: 'Your profile was updated Sucessfully',
      });
    } catch (error) {
      if (error instanceof HttpError) {
        setErrorText(error.message);
        console.error(error);
      }
    }
  }

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await UserService.getProfileImage();
        setImageUrl(response);
      } catch (error) {
        alert(error);
        console.error('Failed to fetch profile image:', error);
      }
    };

    fetchImage();
  }, []);

  const formPassword = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const form = useForm<UserModel>({
    resolver: zodResolver(UserUpdateInput),
    defaultValues: {
      email: '',
      name: '',
      profileImg: undefined,
    },
  });
  return (
    <Tabs defaultValue="account" className="w-[400px] ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>
              Update information about your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col items-center space-y-4 py-8">
              <Avatar className="w-[150px] h-[150px]">
                <AvatarImage
                  src={deletePicture ? '' : imageUrl}
                  alt="profile"
                />
                <AvatarFallback>{fallBack(loggedUser.name)}</AvatarFallback>
              </Avatar>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure of delete your profile picture?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete your profile picture
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setDeletePicture(true)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitUser)}
                className="w-full space-y-6"
              >
                {/* Error display */}
                {errorText && (
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops! Something went wrong</AlertTitle>
                    <AlertDescription className="text-red-500">
                      {errorText}
                    </AlertDescription>
                  </Alert>
                )}

                {/* File input for profile image */}
                <FormField
                  control={form.control}
                  name="profileImg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="profileImg">Profile Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          id="profileImg"
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              field.onChange(files[0]);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.profileImg?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Name input */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="name"
                          placeholder={loggedUser.name}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Email input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          id="email"
                          placeholder={loggedUser.email}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.email?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Form actions */}
                <CardFooter className="flex justify-between p-0">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={onCancelClicked}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Here you can change password. After saving, your session will
              ended.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...formPassword}>
              <form
                onSubmit={formPassword.handleSubmit(onSubmitPassword)}
                className="w-full space-y-6"
              >
                {' '}
                {errorText && (
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Oops! Something went wrong</AlertTitle>
                    <AlertDescription className="text-red-500">
                      {errorText}
                    </AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={formPassword.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="currentPassword">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPassword.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <Input id="newPassword" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPassword.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmNewPassword">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CardFooter className="flex justify-between p-0">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={onCancelClicked}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formPassword.formState.isSubmitting}
                  >
                    Save password
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
