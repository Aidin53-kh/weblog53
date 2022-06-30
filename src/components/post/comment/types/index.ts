export interface IComment {
    template: string;
    rtl: boolean;
    user: any;
    createdAt: Date;
    replys: IComment[];
    replysCount: number;
    postId: string;
    roll: 'Comment' | 'Reply';
    commentId: string | null;
    likes: string[];
    _id: string;
}
