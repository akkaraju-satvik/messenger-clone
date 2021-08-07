import { useEffect, useState } from 'react';
import { FormControl, Input } from '@material-ui/core'
import Message from './Message';
import { db, auth } from './firebase';
import firebase from 'firebase';
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';
import { IconButton, Modal, Button } from '@material-ui/core';
import './App.css';
// import { makeStyles } from '@material-ui/core/styles';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function App() {

    // const classes = useStyles();

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    // const [author, setAuthor] = useState('');

    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [user, setUser] = useState(null);

    useEffect(
        () => {
            const unsubscribe = auth.onAuthStateChanged((authUser) => {
                if(authUser) {
                    //User ==> Logged in
                    // console.log(authUser)
                    setUser(authUser);
                } else {
                    //User ==> Logged Out
                    setUser(null);
                }
            })

            return () => {
                unsubscribe();
            }
        }, [user, username]
    )

    useEffect(() => {
        db.collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => ({id: doc.id, messageData: doc.data()})))
        });
    }, [])

    const sendMessage = function(e) {
        // console.log(username)
        e.preventDefault();
        db.collection('messages').add(
            {
                text: input,
                author: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }
        )
        setInput('')
    }

    const signUp = (e) => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.sendEmailVerification();
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error) => alert(error.message))

        setEmail('');
        setPassword('');
        setOpen(false);

    }

    const signIn = (e) => {
        e.preventDefault();
        auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))

        setOpenSignIn(false);
        setEmail('');
        setPassword('');
    }

    return (
        <div className="App">

            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className="App__signUpModal">
                    <form className="App__signUp">
                        <center>
                            <img src="https://firebasestorage.googleapis.com/v0/b/hola-by-satvik.appspot.com/o/Hola.png?alt=media&token=8eeaeffc-0455-426c-a6bc-44a1c4e7fceb" className="App__signUpImage" alt="Hola Messenger Logo"></img>
                        </center>
                        <Input className="App__signUpInput" placeholder="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        <Input className="App__signUpInput" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input className="App__signUpInput" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>

            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className="App__signUpModal">
                    <form className="App__signUp">
                        <center>
                            <img src="https://firebasestorage.googleapis.com/v0/b/hola-by-satvik.appspot.com/o/Hola.png?alt=media&token=8eeaeffc-0455-426c-a6bc-44a1c4e7fceb" className="App__signInImage" alt="Hola Messenger Logo"></img>
                        </center>
                        <Input className="App__signInInput" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input className="App__signInInput" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit" onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <div className="App__header">
                <img src="https://firebasestorage.googleapis.com/v0/b/hola-by-satvik.appspot.com/o/Hola.png?alt=media&token=8eeaeffc-0455-426c-a6bc-44a1c4e7fceb" className="App__headerImage" alt="Hola Messenger Logo"></img>
                {
                    user?.emailVerified ? 
                    (
                        <div className="App__logout">
                            <p>Welcome { user.displayName ? (user.displayName[0].toUpperCase() + user?.displayName.slice(1)) : ''}</p>
                            <Button onClick={() => auth.signOut()}>Logout</Button>
                        </div>
                    ) :
                    (
                        <div className="App__login">
                            <Button onClick={() => setOpen(true)}>Sign Up</Button>
                            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        </div>
                    )
                }
                

            </div>


            {
                user?.emailVerified ?
                (
                    <>
                        <form className="app__form">
                            <FormControl className="app__formControl">
                                <Input placeholder="Type a message" className="app__input" value={input} onChange={e => setInput(e.target.value)}></Input>
                                <IconButton className="app__iconButton" variant="contained" color="primary" type="submit" disabled={!input} onClick={sendMessage}>
                                    <SendIcon/>
                                </IconButton>
                            </FormControl>
                        </form>
                        <div className="messages__container">
                            <FlipMove>
                                {
                                    messages.map(
                                        ({id, messageData}) => {
                                            return (
                                                <Message key={id} message={messageData} user={user}/>
                                            )
                                        }
                                    )
                                }
                            </FlipMove>
                        </div>
                    </>
                ) :
                (
                    <div className="App__pleaseLogin">{!user ? `Please login/sign up to start chatting` : `Verify your email address`}</div>
                )
            }
        </div>
    );
}

export default App;
