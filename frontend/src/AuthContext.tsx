import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  userId: 0,
  checkAuthentication: () => {}
});

export const AuthProvider = ({ children }:{children:any}) => {

  const checkAuthentication2 = () =>{
    const token = localStorage.getItem("token");
    return !!token
  }
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuthentication2());

  const checkAuthentication = () => {
    setIsAuthenticated(checkAuthentication2());
  };

  const getUsereData = () => {
    const storedData: any = localStorage.getItem("UserInfo");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const InfoUser = parsedData?.ID;
      return parseInt(InfoUser);
    }
    else return 0;
  };

  const [userId, setUserId] = useState<number>(getUsereData());

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};
