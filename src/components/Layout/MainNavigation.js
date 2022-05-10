import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const ctxContext = useContext(AuthContext);
  const isLoggedIn = ctxContext.isLoggedIn;
  

  const logOutHandeler = () =>{
    ctxContext.logOut();
  }
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && <li>
            <Link to='/auth'>Login</Link>
          </li>}
          {isLoggedIn && <li>
            <Link to='/profile'>Profile</Link>
          </li>}
          {isLoggedIn && <li>
            <button onClick={logOutHandeler}>Logout</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
