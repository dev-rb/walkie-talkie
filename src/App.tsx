import React, { useEffect, useState } from 'react';
import './App.css';
import TalkButton from './components/TalkButton';
import { io } from 'socket.io-client';

const socket = io('https://walkie-talkie-servers.herokuapp.com/', {
  extraHeaders: {
    "walkie-talkie": "abcd"
  }
});

function App() {

  const [channel, setChannel] = useState("00000");

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
      <div className="wrapper">
        <h1 className="connectedChannel"> Channel: {channel}</h1>
        <TalkButton sendBuffer={sendBuffer} />
        <div className="inputContainer">
          <input type="text" placeholder={channel} className="inputChannel" maxLength={10} />
          <button className="submitButton"> Join </button>
        </div>
      </div>
    </div>
  );
}

export default App;
