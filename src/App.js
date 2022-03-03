import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

import "./App.css";

import Meme from "./components/Meme/Meme";

const objToQueryParams = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return "?" + params.join("&");
};

const App = () => {
  const [memesArray, setMemesArray] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [topLabel, setTopLabel] = useState("");
  const [bottomLabel, setBottomLabel] = useState("");
  const [finalMeme, setFinalMeme] = useState(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((x) => x.json())
      .then((resp) => setMemesArray(resp.data.memes));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const params = {
      template_id: selectedMeme.id,
      username: "rgndunes",
      password: "divyansh",
      text0: topLabel,
      text1: bottomLabel,
    };
    const resp = await fetch(
      `https://api.imgflip.com/caption_image${objToQueryParams(params)}`
    );
    const json = await resp.json();
    setFinalMeme(json.data);
    console.log(json.data);
  };

  const saveFile = () => {
    saveAs(finalMeme.url);
  };

  return (
    <div className="App">
      {selectedMeme && (
        <div className="meme_selected">
          <div className="create_meme">
            <Meme selectedMemeUrl={selectedMeme.url} />
            <form onSubmit={submit}>
              <input
                type="text"
                name="topLabel"
                value={topLabel}
                onChange={(e) => {
                  setTopLabel(e.target.value);
                }}
                placeholder="Top Text"
              />
              <input
                type="text"
                name="bottomLabel"
                value={bottomLabel}
                onChange={(e) => {
                  setBottomLabel(e.target.value);
                }}
                placeholder="Bottom Text"
              />
              <button type="submit">Create Meme</button>
            </form>
          </div>
          <div className="created_meme">
            {finalMeme && (
              <Meme selectedMemeUrl={finalMeme?.url} download={true} />
            )}
            <form>
              <button type="button" onClick={saveFile}>
                Download Meme
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="meme_list">
        {!selectedMeme &&
          memesArray?.map((meme) => (
            <Meme
              selectedMemeUrl={meme.url}
              onClick={() => {
                setSelectedMeme(meme);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
