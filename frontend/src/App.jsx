import { useEffect, useState } from 'react';
import { api } from './api/client';

export default function App() {
  const [msg, setMsg] = useState('...');

  useEffect(() => {
    api('/api/health')
      .then(d => setMsg(`ok=${d.ok}, time=${d.time}`))
      .catch(e => setMsg(e.message));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>React + Node</h1>
      <p>Respuesta backend: {msg}</p>
    </div>
  );
}
