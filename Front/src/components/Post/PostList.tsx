import { useLocation } from "react-router";
import { IPost, IPostWithOwner } from "../../@Types";
import Post from "./Post";


export interface IPostListProps<T extends IPost> {
    posts: T[]
}

export default function PostList<T extends IPost>({posts}: IPostListProps<T>) {
    return <div className="grid items-center text-[22px] gap-4  w-[80%] min-w-[400px] mx-auto">
        {posts.map(post => <div key={post._id}>
            <Post post={post}/>
        </div>)}
    </div>
}