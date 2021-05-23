import React from 'react';
import './Sidebar.css'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import { Avatar } from '@material-ui/core';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import ControlPointRoundedIcon from '@material-ui/icons/ControlPointRounded';
import Profile from '@material-ui/icons/ControlPointRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ForumIcon from '@material-ui/icons/Forum';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { useParams } from 'react-router-dom';
import VideocamIcon from '@material-ui/icons/Videocam';
import uuid from 'react-uuid';
import { Link } from 'react-router-dom';

function Sidebar({ newPostClick, accountClick, globeChatClick, searchClick }) {

    // const { user }

    return (
        <div className='sidebar'>
            <h1 className='title'>Fb</h1>
            <div className="sidebar-option">
                <span className='tooltip'>Home</span>
                <HomeRoundedIcon />
            </div>
            <div className="sidebar-option" onClick={searchClick}>
                <span className='tooltip'>Search</span>
                <SearchRoundedIcon /> 
            </div>
            <div className="sidebar-option" onClick={globeChatClick}>
                <span className='tooltip'>Messages</span>
                <ForumIcon />   
            </div>
            <div className="sidebar-option" onClick={accountClick}>
                <span className='tooltip'>Account</span>
                <AccountCircleRoundedIcon />   
            </div>
            <div className="sidebar-option" onClick={newPostClick}>
                <span className='tooltip'>New Post</span>
                <Profile />   
            </div>
            <Link to={`/videocall/${uuid()}`} className="sidebar-option video-call-icon" onClick={newPostClick}>
                <span className='tooltip'>Video Call</span>
                <VideocamIcon />   
            </Link>
        </div>
    )
}

export default Sidebar;
