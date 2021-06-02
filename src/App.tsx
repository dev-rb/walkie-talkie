import React, { useEffect } from 'react';
import './App.css';
import TalkButton from './components/TalkButton';
import { io } from 'socket.io-client';

const socket = io('https://walkie-talkie-servers.herokuapp.com/', {
  extraHeaders: {
    "walkie-talkie": "abcd"
  }
});

function App() {

  const sendBuffer = (buffer: ArrayBuffer) => {
    console.log("Sending: ", buffer);
    socket.emit("message", buffer);
  }

  const playReceived = (newBuffer: ArrayBuffer) => {
    const context = new AudioContext();
    const sourceBuffer = context.createBufferSource();
    context.decodeAudioData(newBuffer).then((response) => {
      sourceBuffer.buffer = response;
      sourceBuffer.connect(context.destination);

      sourceBuffer?.start();
    })

  }

  useEffect(() => {
    socket.on("buffer", (newBuffer) => {
      console.log("Received new buffer", newBuffer);
      playReceived(newBuffer);
    });
  }, [])

  return (
    <div className="App">
      <TalkButton sendBuffer={sendBuffer} />
    </div>
  );
}

export default App;
