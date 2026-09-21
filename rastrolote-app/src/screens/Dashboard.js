import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard({ navigation }) {
  const { cargas } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Talhão: {item.talhao}</Text>
      <Text>Status: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text></Text>
      {item.status === 'Aguardando' && (
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransferLoad', { id: item.id })}>
          <Text style={styles.actionText}>Transferir</Text>
        </TouchableOpacity>
      )}
      {item.status === 'Em Trânsito' && (
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ReceiveLoad', { id: item.id })}>
          <Text style={styles.actionText}>Receber</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá, {user?.name} ({user?.role})</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateLoad')}>
        <Text style={styles.buttonText}>+ Nova Carga</Text>
      </TouchableOpacity>
      <FlatList data={cargas} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  createButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  actionButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  actionText: { color: '#FFF', fontWeight: 'bold' },
});