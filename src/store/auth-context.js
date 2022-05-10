import React, { useEffect, useState } from "react";

let logOutTime ;

export const AuthContext = React.createContext({
    token :'',
    isLoggedIn: false,
    login:(token) =>{},
    logOut: () =>{}
});

const calCulatingTime = (expirationTime) =>{
    const current = new Date().getTime();
    const adjExpiration = new Date(expirationTime).getTime();

    const remainTime = adjExpiration - current;
    return remainTime;
}
const retriveStoredToken = () =>{
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainTime = calCulatingTime(storedExpirationDate);

    if(remainTime <= 3600){
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null;
    }

    return {
        token: storedToken,
        duraation: remainTime
    }
}

const AuthContextProvidrt = (props) =>{
    const tokenDate = retriveStoredToken();
    let initialToken;
    if(tokenDate){
       initialToken = tokenDate.token;
    }
     
    const [token,setToken] = useState(initialToken);


 const userIsLoggedIn = !!token;

 const logOut = () =>{
     setToken(null);
     localStorage.removeItem('token');
     localStorage.removeItem('expirationTime');
     if(logOutTime){
         clearTimeout(logOutTime)
     }
 };

 const logeIn = (token,expirationTime) =>{
     setToken(token);
     localStorage.setItem('token', token);
     localStorage.setItem('expirationTime', expirationTime);
    const remainTime = calCulatingTime(expirationTime);
   logOutTime = setTimeout(logOut, remainTime);
 };

 useEffect(() =>{
     if(tokenDate){
        logOutTime = setTimeout(logOut, tokenDate.duraation);
     }
 },[tokenDate]);

 const contextValue = {
     token: token,
     isLoggedIn: userIsLoggedIn,
     login: logeIn,
     logOut: logOut
 }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvidrt;