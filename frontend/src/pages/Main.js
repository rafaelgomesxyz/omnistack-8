import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import io from 'socket.io-client';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

import './Main.css';

let socket = null;

export default function Main({ match }) {
  const [devs, setDevs] = useState([]);
  const [matchDevs, setMatchDevs] = useState([]);

  const { loggedId } =  match.params;

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

  async function handleLike(targetId) {
    await api.post(`/devs/${targetId}/likes`, null, {
      headers: {
        logged_id: loggedId,
      },
    });

    setDevs(devs.filter(dev => dev._id !== targetId));
  }

  async function handleDislike(targetId) {
    await api.post(`/devs/${targetId}/dislikes`, null, {
      headers: {
        logged_id: loggedId,
      },
    });

    setDevs(devs.filter(dev => dev._id !== targetId));
  }

  function handleLogout() {
    if (socket) {
      socket.disconnect();

      socket = null;
    }
  }

  return (
    <div className="main-container">
      <Link
        to="/"
        onClick={handleLogout}
      >
        <img src={logo} alt="Tindev" />
      </Link>

      {devs.length > 0
        ? (
          <ul>
            {devs.map(dev => (
              <li key={dev._id}>
                <img src={dev.avatar} alt={dev.name} />

                <footer>
                  <strong>{dev.name}</strong>
                  <p>{dev.bio}</p>
                </footer>

                <div className="buttons">
                  <button
                    type="button"
                    onClick={() => handleDislike(dev._id)}
                  >
                    <img src={dislike} alt="Dislike" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLike(dev._id)}
                  >
                    <img src={like} alt="Like" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
        : (
          <div className="empty">Acabou :(</div>
        )
      }

      {matchDevs.length > 0
        && (() => {
          const [dev, ...rest] = matchDevs;

          return (
            <div className="match-container">
              <img src={itsamatch} alt="It's a match" />

              <img className="avatar" src={dev.avatar} alt={dev.name} />

              <strong>{dev.name}</strong>
              <p>{dev.bio}</p>

              <button
                type="button"
                onClick={() => setMatchDevs(rest)}
              >
                FECHAR
              </button>
            </div>
          );
        })()
      }
    </div>
  );
};