import { useState } from "react";
import PostList from "../components/Post/PostList";
import { useAuth } from "../context/AuthContext";
import AuthorizedGuard from "../guards/AuthorizedGuard";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Profile() {
    const { user } = useAuth();
    const [showingImages, setShowingImages] = useState(false);

    if (!user) return null;

    return (
        <div className="mt-[1rem]">
            <div className="flex flex-col items-center gap-[1px]">
                <img
                    onClick={() => {
                        if (user.imgUrl) {
                            setShowingImages(true);
                        }
                    }}
                    src={user.imgUrl}
                    height={100}
                    className="rounded-full object-contain w-[100px] h-[100px]"
                    alt="Profile"
                />
                <div className="font-bold p-2">
                    {user.first_name ? (
                        <div>{user.first_name + " " + user.last_name}</div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span>ערוך שם משתמש בעמוד </span>
                            <Link to="/edit-profile" className="text-blue-500">
                                עריכת פרופיל
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-20 " /> {/* Add margin bottom for space */}
            {/* Reverse the order of posts */}
            <PostList posts={user.posts.slice().reverse()} />
            {showingImages && (
                <div className="fixed bg-[rgba(0,0,0,0.5)] grid items-center top-0 bottom-0 left-0 right-0">
                    <div className="min-w-[300px] rounded-lg grid place-items-center grid-cols-1 grid-rows-1 p-4 w-[60%] max-w-[600px] mx-auto min-h-[300px] bg-white">
                        <img src={user.imgUrl} className="object-contain w-[200px] h-[200px] rounded-full" alt="Profile"/>
                    </div>
                    <FontAwesomeIcon
                        color="white"
                        size="3x"
                        className="fixed cursor-pointer top-[2rem] right-[2rem]"
                        icon={faClose}
                        onClick={() => {
                            setShowingImages(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}


const ProfileWithGuard = AuthorizedGuard(Profile);
export default ProfileWithGuard;
