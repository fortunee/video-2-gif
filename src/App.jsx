import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

import './App.css';

const mpeg = createFFmpeg({ log: true });

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const loadFfmpeg = async () => {
    await mpeg.load();
    setIsLoaded(true);
  };

  useEffect(() => {
    loadFfmpeg();
  }, []);

  const convertToGif = async () => {
    mpeg.FS('writeFile', 'sample.mp4', await fetchFile(video));
    await mpeg.run(
      '-i',
      'sample.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'result.gif',
    );

    const data = mpeg.FS('readFile', 'result.gif');
    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );

    setGif(gifUrl);
  };

  return isLoaded ? (
    <div className="App">
      <h1>Please choose a video to convert</h1>
      {video ? (
        <div>
          <video controls width="320" src={URL.createObjectURL(video)} />
          <br />
          <button class="btn" onClick={convertToGif}>
            Convert
          </button>
        </div>
      ) : (
        <input
          type="file"
          onChange={(e) => setVideo(e.target.files?.item(0))}
        />
      )}

      <div style={{ marginTop: '20px' }}>
        <h1>Result</h1>

        <img src={gif} />
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default App;
