import { Post } from './post';
import { HashtagStats } from './hashtag-stats';

export interface PostRepository {
    save(post: Post): Promise<void>;
    findAll(pagination: { page: number; limit: number }): Promise<Post[]>;
    findByUserId(
        userId: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]>;
    findByDescription(
        query: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]>;
    findByExactHashtag(
        hashtag: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]>;
    findByMatchingHashtag(
        hashtag: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]>;
    findById(id: string): Promise<Post>;
    update(post: Post): Promise<Post>;
    deleteById(id: string): Promise<void>;
    getPopularHashtags(limit: number): Promise<HashtagStats[]>;
    searchHashtagsByQuery(
        query: string,
        limit: number,
    ): Promise<HashtagStats[]>;
}
