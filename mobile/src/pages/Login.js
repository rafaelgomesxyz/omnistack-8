import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userId').then(userId => {
      if (userId) {
        navigation.navigate('Main', { userId });
      }
    });
  }, []);

  async function handleSubmit() {
    const response = await api.post('/devs', { username });

    const { _id: userId } = response.data;

    await AsyncStorage.setItem('userId', userId);

    navigation.navigate('Main', { userId });
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior="padding"
      enabled={Platform.OS === 'ios'}
    >
      <Image source={logo} />

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário no GitHub"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 4,
    borderWidth: 1,
    height: 46,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#df4723',
    borderRadius: 4,
    height: 46,
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});