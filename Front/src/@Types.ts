export interface IToken {
    accessToken: string;
    refreshToken: string;
}
export interface IUser {
    email: string,
    _id?: string,
    first_name: string,
    last_name:string,
    password: string,
    imgUrl?: string,
    accessToken?: string,
    posts: (IPost | string)[]
    refreshToken?: string
}

export interface IPost {
    _id: string
    title: string;
    created_at: Date,
    message: string;
    owner: string | IUser;
    imgUrl?: string;
    comments: IComment[];
    post_owner_email: string
    post_owner_phone: string
    date_start: Date,
    date_end: Date,
    location: string,
    capacity: number
    kosher_home: boolean,
    shabat_save: boolean,
    animals_home: boolean,
    handicap_home: boolean
}

export interface IPostWithOwner extends IPost {
    owner: IUser
}

export interface IComment {
    _id: string;
    message: string;
    comment_owner: (IUser | string)
    post: (string | IPost)
}

export interface ICommentWithUser extends IComment {
    comment_owner: IUser
}

export interface IUserWithPosts extends IUser {
    posts: IPost[]
}