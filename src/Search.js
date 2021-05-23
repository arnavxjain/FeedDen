import React, { useState, useEffect } from 'react';
import SendIcon from '@material-ui/icons/Send';
import './Search.css'
import { db, auth } from './firebase';
import { Avatar } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Link } from 'react-router-dom';

let foundUsername;
let foundId;
let foundAvatarSrc;
let foundEmail;

function Search() {

    const [searchValue, setSearchValue] = useState('');
    const [possibleUsers, setPossibleUsers] = useState([]);
    const [userFound, setUserFound] = useState([]);

    const checkForEnter = (e) => {
        console.log(foundUsername, foundId);
        if (e.which == 13 || e.keyCode == 13) {
            if (searchValue != '') {
                searchForUser();
            }
        } 
    }

    const searchForUser = () => {
        db.collection('users').onSnapshot((snapshot) => {
            setPossibleUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
        });
        console.log(possibleUsers);
        checkForMatch();
    }

    const checkForMatch = () => {
        possibleUsers.map(({ id, data }) => {
            if (data.username.includes(searchValue) || data.email.includes(searchValue) ) {
                console.log('Match Found');
                foundUsername = data.username;
                foundId = id;
                foundAvatarSrc = data.photoURL;
                foundEmail = data.email;
                setSearchValue('');
            } else if (searchValue == '') {
                foundUsername = undefined;
            }
        })
    }

    return (
        <div>
            <div className="search-controls">
                <input type="text" placeholder='Search for someone' onKeyPress={checkForEnter} value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                <SendIcon className='send-btn' onClick={searchForUser}/>
            </div>
            {
                    foundUsername !== undefined ? (
                        <div className='found-account-info'>
                            <div className='account-info one'>
                                <Avatar src={foundAvatarSrc} className='search-avat'/>
                            </div>
                            <div className='account-info two' id={foundId}>
                                <span>{foundUsername}</span>
                                <span>{foundEmail}</span>
                            </div>
                            <Link onClick={() => setSearchValue('')} to={`/users/${foundId}`} className='option-icon search-info-btn'>
                                <span><InfoOutlinedIcon className='main-opt main-com-opt'/></span>
                            </Link>
                        </div>    
                    ) : (
                        null
                    )
                }
        </div>
    )
}

export default Search;
