import * as React from 'react';
import { getArrayBuffer } from '../../Utils/audioConversion';
import styles from './talkButton.module.css';

interface Props {
    sendBuffer: (buffer: ArrayBuffer) => void
}

const TalkButton = ({ sendBuffer }: Props) => {

    const [talking, setTalking] = React.useState(false);
    const audioBuffer = React.useRef<AudioBuffer>();
    const arrayBuffer = React.useRef<ArrayBuffer>();
    const blobToSend = React.useRef<Blob>();
    const mediaRecorderRef = React.useRef<MediaRecorder>();

    const startTalking = () => {
        setTalking(true);
        mediaRecorderRef.current?.start(0);
    }

    const stopTalking = () => {
        setTalking(false);
        mediaRecorderRef.current?.stop();
        setTimeout(() => {
            sendBuffer(arrayBuffer.current!);
        }, 200)

        // setTimeout(() => {
        //     playBufferAudio();
        // }, 200)
    }

    const playBufferAudio = () => {
        const context = new AudioContext();
        const sourceBuffer = context.createBufferSource();
        sourceBuffer.buffer = audioBuffer.current!;
        sourceBuffer.connect(context.destination);
        sourceBuffer?.start();
    }

    const process = async (data: BlobPart[] | undefined) => {
        const context = new AudioContext();
        const blob = new Blob(data);
        // blobToSend.current = blob;
        getArrayBuffer(blob).then((buffer) => arrayBuffer.current = buffer);
        // context.decodeAudioData(await blob.arrayBuffer()).then((buffer) => audioBuffer.current = buffer);
        // convertToArrayBuffer(blob).then((response) => context.decodeAudioData(response)).then((response) => { audioBuffer.current = (response); })
        // convertToArrayBuffer(blob).then((response) => arrayBuffer.current = response);
    }

    const convertToArrayBuffer = async (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const response = await fetch(url);
        return response.arrayBuffer();

    }

    const testMic = (stream: MediaStream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        let data: Blob[] = [];
        mediaRecorderRef.current.addEventListener("dataavailable", (e) => { data.push(e.data); })
        mediaRecorderRef.current.addEventListener("stop", () => { process(data); data = [] });

    }

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(testMic);

    }, [])

    return (
        <div>
            <div className={`${styles.button} ${talking ? styles.active : ''}`} onMouseDown={startTalking} onMouseUp={stopTalking} onTouchStart={startTalking} onTouchEnd={stopTalking}>
                <h1 className={styles.text}>Talk</h1>
            </div>
        </div>
    );
}

export default TalkButton;