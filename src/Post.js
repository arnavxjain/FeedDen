import React, { useState, useEffect } from 'react'
import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login, selectUser } from './features/userSlice';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Post.css'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import { db } from './firebase';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import Comment from './Comment';
import SendIcon from '@material-ui/icons/Send';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
}

const useStyles = makeStyles((theme) => (console.log(theme), {
paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: 'rgb(21,32,43)',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    animation: 'modal-animation 0.4s'
},
mandatorySpan: {
    color: 'var(--main-app-color)',
    // fontSize: '15px'
},
subDiv: {
    color: 'white',
    padding: '10px'
},
messagePaper: {
    position: 'absolute',
    width: '86vw',
    height: '80vh',
    backgroundColor: 'rgb(21,32,43)',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    animation: 'modalAnimation 0.4s'
},
messagePaperTwo: {
    position: 'absolute',
    width: '86vw',
    height: 'fit-content',
    backgroundColor: 'rgb(21,32,43)',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    animation: 'modalAnimation 0.4s'
}
}));

let selectedPostId;

function Post({ username, timestamp, message, postPhotoUrl, userPhotoUrl, postId, myUid }) {

    const user = useSelector(selectUser);
    const [optionsModalState, setOptionSmodalState] = useState(false);
    const [editModalState, setEditmodalState] = useState(false);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [selectedEditData, setSelectedEditData] = useState([]);
    const [newTextAreaValue, setNewTextAreaValue] = useState('');
    const [commentsModalState, setCommentsModalState] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentVal, setCommentVal] = useState('');
    const [imageModal, setImageModal] = useState(false);

    useEffect(() => {
        console.log(postId);
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                // .orderBy('timestamp', 'desc')
                .onSnapshot((data) => {
                    setComments(data.docs.map((doc) => ({
                        id: doc.id,
                        comment: doc.data()
                    })));
                });
                console.log(comments);
        } 

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const optionsClick = (e) => {
        selectedPostId = postId;
        console.log(selectedPostId);
        setOptionSmodalState(true);
    }

    const deleteSelectedPost = (e) => {
        console.log(e);
        db.collection('posts').doc(selectedPostId).delete();
    }

    const editSelectedPost = () => {
        console.log(selectedPostId);
        setEditmodalState(true);
        db.collection('posts').doc(postId).onSnapshot(snapshot => {
            console.log(snapshot.data());
            setNewTextAreaValue(snapshot.data().message)
        })
    }

    const editSelectedPostFinal = () => {
        console.log(selectedPostId);
        let date = new Date();
        let AmOrPm = date.getHours() < 12 ? 'AM' : 'PM';
        db.collection('posts').doc(selectedPostId).update({
            message: newTextAreaValue,
            timestamp: `${date.getHours()}:${date.getMinutes()} ${AmOrPm}`,
        });
        setEditmodalState(false);
        setOptionSmodalState(false);
    }

    const queryCheck = (e) => {
        if (e.keyCode == 13 && commentVal != '' || e.which == 13 && commentVal != '') {
            postComment();
        }
    }
    
    const postComment = () => {

        let date = new Date();

        let AmOrPm = date.getHours() >= 12 ? 'PM' : 'AM';

        let currentTime = date.getMinutes();

        if (currentTime < 10) {
            currentTime = `0${date.getMinutes()}`
        }

        let currentHour = date.getHours();

        if (currentHour < 10) {
            currentHour = `0${date.getHours()}`
        }

        db
            .collection('posts')
            .doc(postId)
            .collection('comments').add({
                userPhotoURL: user.photoURL,
                comment: commentVal,
                time: `${currentHour}:${currentTime} ${AmOrPm}`,
                username: user.username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setCommentVal('');
    }

    return (
        <div key={postId} id={postId} className='post'>
            <Modal className='modal' open={optionsModalState} onClose={() => setOptionSmodalState(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <CancelIcon className='cancelModalIcon' onClick={() => setOptionSmodalState(false)}/>
                    <div className='btn-handlers'>
                        <button onClick={deleteSelectedPost}>Delete Post</button>
                        <button onClick={editSelectedPost}>Edit Post</button>
                    </div>
                </div>
            </Modal> 

            <Modal className='modal' open={editModalState} onClose={() => setEditmodalState(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <CancelIcon className='cancelModalIcon' onClick={() => setEditmodalState(false)}/>
                    <h2 className='modal-title'>Edit Post</h2>
                    <div className="modal-main">
                    <span>Edit Message</span>
                    <textarea 
                        value={newTextAreaValue}
                        onChange={(e) => setNewTextAreaValue(e.target.value)}
                        className='modalTextArea' 
                        placeholder="What's your message?"
                    ></textarea>
                    <button onClick={editSelectedPostFinal}>Save</button>
                    </div>
                </div>
            </Modal>  

            <Modal className='modal' open={commentsModalState} onClose={() => setCommentsModalState(false)}>
                <div style={modalStyle} className={classes.messagePaper}>
                    <CancelIcon className='cancelModalIcon' onClick={() => setCommentsModalState(false)}/>
                    <h2 className='comment-header'>Comments</h2>
                    {
                        comments.length > 0 ? (
                            <div className="comments-main-div">
                                {
                                    comments.map(({ id, comment }) => (
                                        <Comment 
                                            parentPostId={postId}
                                            key={id}
                                            commentId={id}
                                            userPhotoURL={comment.userPhotoURL}
                                            message={comment.comment}
                                            username={comment.username}
                                            time={comment.time}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <h2 className='comment-header'>No Comments Yet</h2>
                        )
                    }
                    <div className="comment-controls">
                        <input type="text" placeholder='Type a message...' onKeyPress={queryCheck} value={commentVal} onChange={(e) => setCommentVal(e.target.value)}/>
                        <SendIcon className='send-btn' onClick={postComment}/>
                    </div>
                </div>
            </Modal>

            <Modal className='modal modalforimage' open={imageModal} onClose={() => setImageModal(false)}>
                <div style={modalStyle} className={classes.messagePaperTwo}>
                    <CancelIcon className='cancelModalIcon' onClick={() => setImageModal(false)}/>
                    <img onLoadStart={(e) => console.log(e)} src={postPhotoUrl} className='modalImage'/>
                </div>
            </Modal>   

            <div className="feed-post">
                <div className="post-header">
                    <Avatar className='post-icon' src={userPhotoUrl}/>
                    <span><Link to={`/users/${myUid}`} className='post-header-linkType'>@{username}</Link> · <span className='post-header-timstamp'>{timestamp} </span></span>
                    {
                        username == user.username ? (
                            <div className='option-icon' onClick={optionsClick}>
                                <MoreHorizIcon className='main-opt'/>
                            </div>
                            ) : (
                            null
                        )
                    }
                </div>
                <div className="post-message">
                    <p className='main-msg'>
                        {message}
                    </p>
                {postPhotoUrl ? (
                    <img className='post-image' src={postPhotoUrl} onClick={() => setImageModal(true)} />
                ) : (
                    null
                )}    
                </div>
                <div className="message-client-controls">
                    <div className="option-icon" onClick={() => setCommentsModalState(true)}>
                        <ChatRoundedIcon /><span className='comments-number'>{comments.length}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
