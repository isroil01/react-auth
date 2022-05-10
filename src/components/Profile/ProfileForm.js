import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPassword = useRef();
  const ctxContext = useContext(AuthContext);
  const token = ctxContext.token;
  const history = useHistory();

  const submitHandeler = (e) =>{
    e.preventDefault();

    const enteredPassword = newPassword.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAPAOenZQDHAd6I2hP9g2t51s2UftMdQS4',{
      method: 'POST',
      body: JSON.stringify({
        idToken : token,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers : {
        'Content-Type' : 'application/json'
      }
    }).then(res =>{
      
      history.replace('/');
    })
  }
  return (
    <form className={classes.form} onSubmit={submitHandeler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPassword} minLength='7' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
