export type UserListItem = {
    id: string;
    profilePictureUrl: string;
    username: string;
};

export type UserProfile = UserListItem & {
    firstName: string;
    lastName: string;
    createdAt: string;
};

export type MyUser = UserProfile & {
    email: string;
    phone: string;
};
