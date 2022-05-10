import { useState,useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading,setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const ctrContext = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandeler = (e) =>{
    e.preventDefault();

    const enterdEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
   setIsLoading(true);
   let url ;
    if(isLogin){
        url=  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAPAOenZQDHAd6I2hP9g2t51s2UftMdQS4'
    }else{
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAPAOenZQDHAd6I2hP9g2t51s2UftMdQS4'
    }
    fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        email: enterdEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      setIsLoading(false)
      if(res.ok){
        return  res.json();
      }else{
       return res.json().then(data =>{
          console.log(data);
          let errormessage = 'Authentication failed!';
          if(data && data.error && data.error.message){
            errormessage = data.error.message;
          }
          
           throw new Error(errormessage)
        })
      }
      
    }).then(data =>{
      console.log(data);
      const expirationTime = new Date((new Date().getTime() + (data.expiresIn * 1000)))
      ctrContext.login(data.idToken, expirationTime.toISOString());
      history.replace('/')
    })
    .catch(error =>{
      alert(error.message)
    });
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandeler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p className='isloading'>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
