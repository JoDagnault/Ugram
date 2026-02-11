import { Post } from './post';

export interface PostRepository {
    save(post: Post): Promise<void>;
    findAll(): Promise<Post[]>;
    findById(id: string): Promise<Post>;
    update(post: Post): Promise<Post>;
    deleteById(id: string): Promise<void>;
}
