import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSpring } from "react-spring";

import "./Grid.css";

const Grid = () => {
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [match, setMatch] = useState(null);
  const [count, setCount] = useState(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    if (count === 0) {
      setStart(false);
      return window.alert(`Time is up! You've got ${match} points!`);
    }

    if (count > 0) {
      const intervalId = setInterval(() => {
        setCount(count - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [count]);

  useEffect(() => {
    count === 0 && setStart(false);
  }, [count]);

  const getCards = async () => {
    setLoading(true);
    try {
      const n = Math.floor(Math.random() * 400 + 1);

      console.log(n);

      const res = await axios.get(
        `http://api.jikan.moe/v3/anime/${n}/characters_staff`
      );

      console.log(res.data.characters.length);

      const arr = [];

      for (let i = 0; i < 4; i++) {
        arr.push(res.data.characters[i].image_url);
      }

      for (let i = 0; i < 4; i++) {
        arr.push(res.data.characters[i].image_url);
      }

      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }

      setCards(arr);
      setLoading(false);
    } catch (err) {
      console.log(err);

      const n = 1;

      const res = await axios.get(
        `http://api.jikan.moe/v3/anime/${n}/characters_staff`
      );

      const arr = [];

      for (let i = 0; i < 4; i++) {
        arr.push(res.data.characters[i].image_url);
      }

      for (let i = 0; i < 4; i++) {
        arr.push(res.data.characters[i].image_url);
      }

      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }

      setCards(arr);
      setLoading(false);
    }
  };

  const handleClick = (key, id) => {
    if (start) {
      document.getElementById(key).style.display = `block`;
      document.getElementById(key + 10).style.display = `none`;

      if (current === null) {
        setCurrent({
          id: id,
          key: key,
        });
      } else if (current.id !== id) {
        setStart(false);

        setTimeout(() => {
          document.getElementById(current.key).style.display = "none";
          document.getElementById(current.key + 10).style.display = "block";

          document.getElementById(key).style.display = "none";
          document.getElementById(key + 10).style.display = "block";
          setStart(true);
        }, 1000);
        setCurrent(null);
      } else {
        setStart(false);

        setCurrent(null);
        setMatch(match + 1);
        setTimeout(() => {
          setStart(true);
        }, 1000);
      }
    }
  };

  const handleStart = () => {
    setStart(true);
    setCount(60);
    setMatch(0);
    getCards();
  };

  return (
    <div className="grid">
      <h1>記憶</h1>
      <div className="btns">
        <span>
          <button className="btn " type="button" onClick={() => getCards()}>
            <span>
              Next Cards <i className="fas fa-step-forward"></i>
            </span>
          </button>

          <button className="btn " type="button" onClick={() => handleStart()}>
            {count === 0 || count === null ? (
              <i className="larger danger fas fa-power-off"></i>
            ) : (
              <i className="larger primary fas fa-power-off"></i>
            )}
          </button>
        </span>
        {count !== null && (
          <p>
            Points: {match} | Timer: {count}
          </p>
        )}
      </div>
      {cards === null || loading ? (
        <p>loading...</p>
      ) : (
        cards.map((data, k) => (
          <div key={k} id={data} onClick={() => handleClick(k, data)}>
            <div
              id={k}
              className={`card`}
              style={{
                backgroundImage: `url(${data})`,
                display: `none`,
              }}
            />

            <div id={k + 10} className="back" style={{ display: `block` }} />
          </div>
        ))
      )}
    </div>
  );
};

export default Grid;
