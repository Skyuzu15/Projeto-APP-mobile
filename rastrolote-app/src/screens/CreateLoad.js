import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { DataContext } from '../contexts/DataContext';

export default function CreateLoad({ navigation }) {
  const { createCarga } = useContext(DataContext);
  const [talhao, setTalhao] = useState('');
  const [colhedora, setColhedora] = useState('');

  const handleCreate = async () => {
    if (!talhao || !colhedora) return alert('Preencha todos os campos');
    await createCarga(talhao, colhedora);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Carga</Text>
      <TextInput style={styles.input} placeholder="Talhão (Ex: A12)" value={talhao} onChangeText={setTalhao} />
      <TextInput style={styles.input} placeholder="Colhedora (Ex: C-03)" value={colhedora} onChangeText={setColhedora} />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Salvar Offline</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
  button: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});