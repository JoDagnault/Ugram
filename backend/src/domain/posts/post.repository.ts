import { Post } from './post';
import { HashtagStats } from './hashtag-stats';

export interface PostRepository {
    save(post: Post): Promise<void>;
    findAll(): Promise<Post[]>;
    findByUserId(userId: string): Promise<Post[]>;
    findByDescription(query: string): Promise<Post[]>;
    findByExactHashtag(hashtag: string): Promise<Post[]>;
    findByMatchingHashtag(matchingHashtag: string): Promise<Post[]>;
    findById(id: string): Promise<Post>;
    update(post: Post): Promise<Post>;
    deleteById(id: string): Promise<void>;
    getPopularHashtags(limit: number): Promise<HashtagStats[]>;
}
