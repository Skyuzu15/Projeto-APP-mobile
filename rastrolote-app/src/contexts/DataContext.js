import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [cargas, setCargas] = useState([]);

  useEffect(() => {
    loadCargas();
  }, []);

  const loadCargas = async () => {
    const stored = await AsyncStorage.getItem('@RastroLote:cargas');
    if (stored) setCargas(JSON.parse(stored));
  };

  const saveCargas = async (newCargas) => {
    setCargas(newCargas);
    await AsyncStorage.setItem('@RastroLote:cargas', JSON.stringify(newCargas));
  };

  const createCarga = async (talhao, colhedora) => {
    const newCarga = {
      id: uuid.v4(),
      talhao,
      colhedora,
      status: 'Aguardando',
      eventos: [{ tipo: 'Criacao', data: new Date().toISOString() }],
    };
    await saveCargas([...cargas, newCarga]);
  };

  const updateCarga = async (id, updates) => {
    const updated = cargas.map((c) => (c.id === id ? { ...c, ...updates } : c));
    await saveCargas(updated);
  };

  const deleteCarga = async (id) => {
    const filtered = cargas.filter((c) => c.id !== id);
    await saveCargas(filtered);
  };

  return (
    <DataContext.Provider value={{ cargas, createCarga, updateCarga, deleteCarga }}>
      {children}
    </DataContext.Provider>
  );
};