import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // <--- FALTava isso!
import { DataContext } from '../contexts/DataContext';
import Button from '../components/Button';

export default function ReceiveLoad({ route, navigation }) {
  const { id } = route.params;
  const { cargas, updateCarga } = useContext(DataContext);

  const carga = cargas.find((c) => c.id === id);

  const [peso, setPeso] = useState('18420');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // <--- FALTava isso!

  if (!carga) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Carga não encontrada!</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // Função para escolher a imagem da galeria (com Base64)
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso às fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4, // Qualidade baixa para o Base64 não ficar gigante
      base64: true, 
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64); // Agora funciona!
    }
  };

  // Tech Forge: Upload via Base64 com Axios (À prova de falhas)
  const uploadImageToBackend = async (base64String) => {
    const API_URL = 'http://192.168.1.5:3000/upload'; // Seu IP correto
    console.log('Enviando imagem Base64...');

    try {
      // Enviamos como JSON. O backend vai ler req.body.image_base64
      const response = await axios.post(API_URL, {
        image_base64: base64String
      });
      
      console.log('Upload success:', response.data);
      Alert.alert('Sucesso', 'Imagem enviada para o servidor!');

    } catch (error) {
      console.error('Erro no upload:', error.message);
      Alert.alert('Erro de Conexão', `Detalhe: ${error.message}`);
    }
  };

  const handleReceive = async () => {
    // Passa o Base64, não a URI!
    if (imageBase64) { 
      await uploadImageToBackend(imageBase64);
    }

    await updateCarga(id, {
      status: 'Recebida',
      peso: peso,
      eventos: [...carga.eventos, { tipo: 'Recebimento', data: new Date().toISOString(), peso }]
    });

    Alert.alert(
      'Sucesso',
      'Recebimento confirmado! Histórico da carga completo.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirmar Chegada</Text>
        <Text style={styles.headerSubtitle}>Status: Online (Sincronizando)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carga {carga.id.substring(0, 5)}</Text>
        <Text style={styles.infoText}>Origem: Talhão {carga.talhao} | Veículo: {carga.veiculo || 'T-07'}</Text>

        <Text style={styles.label}>Destino Sugerido:</Text>
        <Text style={styles.value}>Armazém Norte</Text>

        <Text style={styles.label}>Horário de Chegada:</Text>
        <Text style={styles.value}>{new Date().toLocaleTimeString()}</Text>

        <Text style={styles.label}>Peso (opcional no MVP):</Text>
        <TextInput
          style={styles.input}
          value={peso}
          onChangeText={setPeso}
          keyboardType="numeric"
          placeholder="Ex: 18420 kg"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tech Forge: Anexar Imagem</Text>
        <Text style={styles.label}>Foto da carga ou nota fiscal:</Text>

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
        </TouchableOpacity>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
      </View>

      <Button title="Confirmar Recebimento" color="#28a745" onPress={handleReceive} />
      <Button title="Cancelar" color="#6c757d" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0056b3' },
  headerSubtitle: { fontSize: 14, color: '#28a745', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  infoText: { fontSize: 14, color: '#666', marginBottom: 10 },
  label: { fontSize: 14, color: '#666', marginTop: 5 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  input: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', fontSize: 16 },
  imagePickerButton: { backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  imagePickerText: { color: '#333', fontWeight: 'bold' },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginTop: 10, resizeMode: 'cover' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50, marginBottom: 20 },
});