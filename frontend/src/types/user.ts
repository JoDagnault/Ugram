export type UserListItem = {
    id: string;
    profilePictureUrl: string;
    username: string;
};

export type UserProfile = UserListItem & {
    createdAt: string;
};

export type MyUser = UserProfile & {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
};
