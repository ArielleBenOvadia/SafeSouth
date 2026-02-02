import { Link } from "react-router-dom"
import PostList from "../components/Post/PostList"
import { usePosts } from "../context/PostContext"
import { faAdd} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from "../context/AuthContext";


export default function Feed() {
    const {sortedPosts}= usePosts()
    const {user} = useAuth()
    return <div className="flex flex-col">
        {user && <Link to="/create-post/new" className="p-2  w-fit self-end mx-[1.5rem]">
            <FontAwesomeIcon icon={faAdd} className="fa-xl" />
        </Link>}
        <PostList posts={sortedPosts}/>
    </div>
}