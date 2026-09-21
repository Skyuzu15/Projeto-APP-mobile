import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email) => {
    // Simulação de login (Regra de negócio Tech Forge)
    if (email === 'admin@rastrolote.com') setUser({ name: 'Coordenador Marcos', role: 'admin' });
    else setUser({ name: 'Operador João', role: 'user' });
  };

  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>;
};