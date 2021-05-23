import React, { useState, useEffect } from 'react';
import './Comment.css';
import { selectUser } from './features/userSlice';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import { db } from './firebase';

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

function Comment({ username, message, time, userPhotoURL, commentId, parentPostId }) {

    const user = useSelector(selectUser);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [commentOptionsModalState, setCommentOptionsModalState] = useState(false);
    const [editOptionsModalState, setEditCommentOptionsModalState] = useState(false);
    const [newComment, setNewComment] = useState('');

    const delComment = () => {
        db.collection('posts').doc(parentPostId).collection('comments').doc(commentId).delete();
    }

    const editComment = () => {
        setEditCommentOptionsModalState(true);
        db.collection('posts').doc(parentPostId).collection('comments').doc(commentId).onSnapshot(snapshot => {
            setNewComment(snapshot.data().comment);
        })
    }

    const saveCommentChanges = () => {
        db.collection('posts').doc(parentPostId).collection('comments').doc(commentId).update({
            comment: newComment
        });
        setNewComment('');
    }

    return (
        <div className='comment'>
            <Modal className='modal' open={commentOptionsModalState} onClose={() => setCommentOptionsModalState(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <CancelIcon className='cancelModalIcon' onClick={() => setCommentOptionsModalState(false)}/>
                    <div className='btn-handlers'>
                        <button onClick={delComment}>Delete Comment</button>
                        <button onClick={editComment}>Edit Comment</button>
                    </div>
                </div>
            </Modal> 

            <Modal className='modal' open={editOptionsModalState} onClose={() => setEditCommentOptionsModalState(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <CancelIcon className='cancelModalIcon' onClick={() => setEditCommentOptionsModalState(false)}/>
                    <div className='comment-edit-controls'>
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                        <button onClick={saveCommentChanges}>SAVE</button>
                    </div>
                </div>
            </Modal> 

            <div className="comment-div comment-div-one">
                <Avatar src={userPhotoURL} className='message-icon'/>
                <div className="main-message-box">
                    <span className='message-info'><span className='highlight-text'>@{username}</span></span>
                    <p className='main-message'>
                        {message}
                    </p>
                </div>
            </div>
            <div className="comment-div comment-div-two">
                <span className='comment-timestamp'>{time} </span>
                {
                    username == user.username ? (
                        <div className='option-icon' onClick={() => setCommentOptionsModalState(true)}>
                                <MoreHorizIcon className='main-opt main-com-opt'/>
                        </div>
                    ) : (
                        null
                    )
                }
            </div>            
        </div>
    )
}

export default Comment;
