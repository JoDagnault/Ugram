import type { MyUser, UserListItem, UserProfile } from '../../types/user.ts';
import {
  getMePlaceholder,
  getUserPlaceholder,
  getUsersPlaceholder,
  updateMePlaceholder,
} from './usersServicePlaceholders.ts';

export const getMe = async (): Promise<MyUser> => getMePlaceholder();

export const updateMe = async (newMe: MyUser): Promise<MyUser> =>
  updateMePlaceholder(newMe);

export const getUsers = async (): Promise<UserListItem[]> =>
  getUsersPlaceholder();

export const getUser = async (id: string): Promise<UserProfile | undefined> =>
  getUserPlaceholder(id);
