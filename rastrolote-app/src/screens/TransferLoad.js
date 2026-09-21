import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import Button from '../components/Button'; // Usando o componente de botão que criamos (Clean Code)

export default function TransferLoad({ route, navigation }) {
  const { id } = route.params; // Recebe o ID da carga vindo do Dashboard
  const { cargas, updateCarga } = useContext(DataContext);
  
  // Encontra a carga específica no banco de dados local
  const carga = cargas.find((c) => c.id === id);
  
  // Estado para o veículo de destino (simulando a leitura do QR Code)
  const [veiculo, setVeiculo] = useState('Caminhão T-07');

  // Se a carga não for encontrada, exibe um erro
  if (!carga) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Carga não encontrada!</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // Função que salva a transferência offline
  const handleTransfer = async () => {
    if (!veiculo) {
      Alert.alert('Atenção', 'Por favor, informe o veículo de destino.');
      return;
    }

    // Regra de Negócio: Atualiza o status da carga e adiciona um novo evento
    await updateCarga(id, { 
      status: 'Em Trânsito', 
      veiculo: veiculo,
      // Simulando a adição de um evento no histórico
      eventos: [...carga.eventos, { tipo: 'Transferencia', data: new Date().toISOString(), veiculo }]
    });

    // Feedback para o usuário (Usabilidade)
    Alert.alert(
      'Salvo Offline', 
      'O evento de transferência foi salvo no aparelho e será sincronizado quando houver internet.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transferir Carga</Text>
        <Text style={styles.headerSubtitle}>Status: Offline (Salvando no aparelho)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Identificador</Text>
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrText}>QR Code</Text>
          <Text style={styles.qrCodeText}>L-019</Text>
        </View>
        <Text style={styles.infoText}>QR Code reconhecido com sucesso!</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo da Transferência</Text>
        
        <Text style={styles.label}>Talhão Origem:</Text>
        <Text style={styles.value}>{carga.talhao}</Text>
        
        <Text style={styles.label}>Colhedora:</Text>
        <Text style={styles.value}>{carga.colhedora}</Text>

        <Text style={styles.label}>Veículo de Destino (Caminhão):</Text>
        <TextInput
          style={styles.input}
          value={veiculo}
          onChangeText={setVeiculo}
          placeholder="Ex: Caminhão T-07"
        />
      </View>

      <Button title="Confirmar Transferência" color="#007bff" onPress={handleTransfer} />
      <Button title="Cancelar" color="#6c757d" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0056b3' },
  headerSubtitle: { fontSize: 14, color: '#d97706', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  qrPlaceholder: { alignItems: 'center', justifyContent: 'center', height: 120, backgroundColor: '#E0E0E0', borderRadius: 8, marginBottom: 10 },
  qrText: { fontSize: 14, color: '#666' },
  qrCodeText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  infoText: { textAlign: 'center', color: '#28a745', fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginTop: 5 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  input: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', fontSize: 16 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50, marginBottom: 20 },
});