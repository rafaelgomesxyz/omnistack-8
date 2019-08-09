import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import io from 'socket.io-client';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

let socket = null;

export default function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [matchDevs, setMatchDevs] = useState([]);

  const loggedId = navigation.getParam('userId');

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs', {
        headers: {
          logged_id: loggedId,
        },
      });

      setDevs(response.data);
    }

    loadDevs();
  }, [loggedId]);

  useEffect(() => {
    socket = io('http://localhost:3333', {
      query: { loggedId }
    });

    socket.on('matches', data => setMatchDevs(data));
  }, [loggedId]);

  async function handleLike() {
    const [dev, ...rest] = devs;

    await api.post(`/devs/${dev._id}/likes`, null, {
      headers: {
        logged_id: loggedId,
      },
    });

    setDevs(rest);
  }

  async function handleDislike() {
    const [dev, ...rest] = devs;

    await api.post(`/devs/${dev._id}/dislikes`, null, {
      headers: {
        logged_id: loggedId,
      },
    });

    setDevs(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    if (socket) {
      socket.disconnect();

      socket = null;
    }

    navigation.navigate('Login');
  }

  const numDevs = devs.length;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image
          style={styles.logo}
          source={logo}
        />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {numDevs > 0
          ? (
            devs.map((dev, index) => (
              <View
                style={[styles.card, { zIndex:  numDevs - index }]}
                key={dev._id}
              >
                <Image
                  style={styles.avatar}
                  source={{ uri: dev.avatar }}
                />

                <View style={styles.footer}>
                  <Text style={styles.name}>{dev.name}</Text>

                  <Text
                    style={styles.bio}
                    numberOfLines={3}
                  >{
                    dev.bio}
                  </Text>
                </View>
              </View>
            ))
          )
          : (
            <Text style={styles.empty}>Acabou :(</Text>
          )
        }
      </View>

      {numDevs > 0
        && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDislike}
            >
              <Image source={dislike} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLike}
            >
              <Image source={like} />
            </TouchableOpacity>
          </View>
        )
      }

      {matchDevs.length > 0
        && (() => {
          const [dev, ...rest] = matchDevs;

          return (
            <View style={styles.matchContainer}>
              <Image
                style={styles.matchImage}
                source={itsamatch}
              />

              <Image
                style={styles.matchAvatar}
                source={{ uri: dev.avatar }}
              />

              <Text style={styles.matchName}>{dev.name}</Text>

              <Text style={styles.matchBio}>{dev.bio}</Text>

              <TouchableOpacity onPress={() => setMatchDevs(rest)}>
                <Text style={styles.closeMatch}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          );
        })()
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 30,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'space-between',
  },
  cardsContainer: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    maxHeight: 500,
  },
  card: {
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    bottom: 0,
    left: 0,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  avatar: {
    height: 300,
    flex: 1,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bio: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    zIndex: 998,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 2,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 50,
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    zIndex: 999,
  },  
  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },
  matchAvatar: {
    borderColor: '#fff',
    borderRadius: 80,
    borderWidth: 5,
    height: 160,
    marginVertical: 30,
    width: 160,
  },
  matchName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  matchBio: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  closeMatch: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
});