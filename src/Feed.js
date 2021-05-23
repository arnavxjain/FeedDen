import React, { useState, useEffect } from 'react';
import './Feed.css';
import { Avatar } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import { db, auth, storage } from './firebase';
import Post from './Post';
import { selectUser } from './features/userSlice';
import { useSelector } from 'react-redux';

function Feed() {

    const [posts, setPosts] = useState([]);
    const user = useSelector(selectUser);

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data()
          })));
          console.log(posts);
        })
    }, []);

    return (
        <div className='feed'>
            <div className="feed-header">
                <h3 className='subtitle'>Latest Feed</h3>
            </div>
            <div className="posts">
                {
                    posts?.map(({ id, post }) => (
                        <Post 
                            myUid={post.myUid}
                            postId={id}
                            key={id}
                            userPhotoUrl={post.userPhotoUrl}
                            username={post.username}
                            timestamp={post.timestamp}
                            message={post.message}
                            postPhotoUrl={post.postPhotoUrl}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Feed;
