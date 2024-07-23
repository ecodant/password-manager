import api from '../services/api';
import {
  UserModel,
  TLoginSchema,
  TSignUpSchema,
  PasswordFormData,
} from '@/lib/types';

export async function getLoggedInUser(): Promise<UserModel> {
  const response = await api.get('/users');
  return response.data;
}

export async function login(credentials: TLoginSchema): Promise<UserModel> {
  const response = await api.post('/users/login', credentials);
  return response.data;
}

export async function updateUser(credentials: UserModel): Promise<UserModel> {
  const formData = new FormData();

  // Append text fields
  formData.append('name', credentials.name);
  formData.append('email', credentials.email);

  if (credentials.profileImg instanceof File) {
    formData.append('profileImg', credentials.profileImg);
  }
  const response = await api.patch('/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
export async function updatePassword(newData: PasswordFormData) {
  await api.patch('users/update-password', newData);
}

export async function getProfileImage() {
  const response = await api.get('/users/profile-image', {
    responseType: 'arraybuffer',
  });

  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  return URL.createObjectURL(blob);
}

export async function logout() {
  await api.post('/users/logout');
}

export async function signUp(credentials: TSignUpSchema): Promise<UserModel> {
  const response = await api.post('/users/signup', credentials);
  return response.data;
}
