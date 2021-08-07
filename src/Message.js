import './Message.css';
import React, { forwardRef } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const Message = forwardRef(({message, user}, ref) => {
    // console.log(user.displayName);
    // console.log(message.author)
    const isUser = user?.displayName?.toLowerCase() === message.author.toLowerCase();

    return (
        <div ref={ref} className={`message ${isUser && 'message__user'}`}>
            <p className="message__author">
                {!isUser && `${message.author ? (message.author[0].toUpperCase() + message.author.slice(1)) : 'Anonymous'}`}
            </p>
            <Card className={isUser ? 'message__userCard' : 'message__guestCard'}>
                <CardContent className="message__cardContent">
                    <Typography color="white" variant="h5" component="h2" className="messsage__text">
                        {message.text}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
})

export default Message
