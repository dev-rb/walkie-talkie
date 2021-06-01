import React, { useEffect } from 'react';
import './App.css';
import TalkButton from './components/TalkButton';
import { io } from 'socket.io-client';
import { getArrayBuffer } from './Utils/audioConversion';

const socket = io('http://192.168.0.25:3001', {
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
