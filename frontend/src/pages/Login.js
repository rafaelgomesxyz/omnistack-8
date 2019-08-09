import React, { useState } from 'react';

import api from '../services/api';

import logo from '../assets/logo.svg';

import './Login.css';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.post('/devs', { username });

    const { _id } = response.data;

    history.push(`/main/${_id}`);
  }

  return (
    <div className="login-container">
      <img src={logo} alt="Tindev" />

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Digite seu usuário no GitHub"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};