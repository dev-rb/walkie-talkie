
const convertToArrayBuffer = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const response = await fetch(url);
    return response.arrayBuffer();

}

export const getArrayBuffer = async (data: Blob): Promise<ArrayBuffer> => {
    const context = new AudioContext();


    const response = await convertToArrayBuffer(data);
    return response;

}