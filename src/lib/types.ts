import { z } from 'zod';
//User Types Definition

export interface UserModel {
  name: string;
  email: string;
  profileImg?: File;
}

export const UserUpdateInput = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  profileImg: z.instanceof(File).optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(1, 'You must have a name'),
  email: z
    .string()
    .min(1, 'This field has to be filled.')
    .email('This is not a valid email.'),
  password: z.string(),
});

export type TSignUpSchema = z.infer<typeof SignUpSchema>;

export const ItemSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  category: z
    .enum(['Work', 'Personal', 'Social', 'Banking', 'Other', 'No category'])
    .default('No category'),
  url: z.string().optional(),
  favorite: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Item = z.infer<typeof ItemSchema>;

export const ItemInputSchema = z.object({
  name: z.string().min(2, 'Name is must have at least 2 characters'),
  username: z
    .string()
    .min(4, 'Username is required and must have at least 4 character'),
  password: z.string().min(6, 'Password is required'),
  category: z
    .enum(['Work', 'Personal', 'Social', 'Banking', 'Other', 'No category'])
    .default('No category'),
  url: z.string().optional(),
  favorite: z.boolean().optional().default(false),
});

export type ItemInput = z.infer<typeof ItemInputSchema>;

//Card Definition

export enum Brands {
  Visa = 'Visa',
  Mastercard = 'Mastercard',
  AmericanExpress = 'American Express',
  Discocer = 'Discover',
  DinersClub = 'Diners CLub',
  JCB = 'JCB',
  UnionPlay = 'UnionPLay',
  Ruplay = 'RuPlay',
  Other = 'Other',
}

export enum Years {
  Y2024 = '2024',
  Y2025 = '2025',
  Y2026 = '2026',
  Y2027 = '2027',
  Y2028 = '2028',
  Y2029 = '2029',
  Y2030 = '2030',
  Y2031 = '2031',
  Y2032 = '2032',
  Y2033 = '2033',
  Y2034 = '2034',
}

export enum Months {
  January = 'January (01)',
  February = 'February (02)',
  March = 'March (03)',
  April = 'April (04)',
  May = 'May (05)',
  June = 'June (06)',
  July = 'July (07)',
  August = 'August (08)',
  September = 'September (09)',
  October = 'October (10)',
  November = 'November (11)',
  December = 'December (12)',
}
export const CardSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  name: z.string(),
  cardHolderName: z.string(),
  cardNumber: z.string(),
  expiredMonth: z.nativeEnum(Months).default(Months.January),
  expiredYear: z.nativeEnum(Years).default(Years.Y2024),
  cardCode: z.string(),
  brand: z.nativeEnum(Brands).default(Brands.Other),
  favorite: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Card = z.infer<typeof CardSchema>;

export const CardInputSchema = z.object({
  name: z.string(),
  cardHolderName: z.string(),
  cardNumber: z
    .string()
    .regex(/^\d{13,19}$/, 'Card Number must be between 13 and 19 digits'),
  expiredMonth: z.nativeEnum(Months).default(Months.January),
  expiredYear: z.nativeEnum(Years).default(Years.Y2024),
  cardCode: z
    .string()
    .regex(/^\d{3,4}$/, 'Card Code (CVV) must be 3 or 4 digits'),
  brand: z.nativeEnum(Brands).optional(),
  favorite: z.boolean().optional(),
});
export type CardInput = z.infer<typeof CardInputSchema>;
