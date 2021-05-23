import React from 'react';
import './Message.css'
import { selectUser } from './features/userSlice';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';

function Message({ message, username, time, userPhotoUrl, messagePhotoUrl, myUid }) {

    const user = useSelector(selectUser);

    return (
        <div className={`message ${username === user.username && " myself"}`}>
            <Avatar src={userPhotoUrl} className='message-icon'/>
            <div className="main-message-box">
            <span className='message-info'><Link to={`/users/${myUid}`} className='highlight-text'>@{username}</Link> at {time}</span>
                {
                    message == '' ? (
                        null
                    ) : (
                    <p className='main-message'>
                        {message}
                    </p>
                    )
                }
                {
                    messagePhotoUrl !== null ? (
                        <img src={messagePhotoUrl} className='message-img'/>
                    ) : (
                        null
                    )
                }
            </div>
        </div>
    )
}

export default Message;
