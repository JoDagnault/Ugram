import { NotificationType } from './notification-type';

export class Notification {
    constructor(
        private readonly _id: string,
        private readonly _userId: string,
        private readonly _fromUserId: string,
        private readonly _postId: string,
        private readonly _type: NotificationType = NotificationType.Mention,
        private readonly _fromUsername: string = '',
        private readonly _createdAt: string = new Date().toISOString(),
    ) {}

    get id(): string {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get fromUserId(): string {
        return this._fromUserId;
    }

    get postId(): string {
        return this._postId;
    }

    get type(): NotificationType {
        return this._type;
    }

    get createdAt(): string {
        return this._createdAt;
    }

    get fromUsername(): string {
        return this._fromUsername;
    }
}
