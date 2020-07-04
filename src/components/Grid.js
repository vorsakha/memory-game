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
  const [time, setTime] = useState(60);
  const [name, setName] = useState(null);
  const [topScore, setTop] = useState([]);

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    if (count === 0) {
      setStart(false);

      if (localStorage.name) {
        Number(localStorage.name) > match &&
          localStorage.setItem(name.toUpperCase(), match);
      } else {
        localStorage.setItem(name.toUpperCase(), match);
      }

      window.alert(`Time is up! You've got ${match} points!`);

      return window.location.reload();
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

  useEffect(() => {
    const arr = [];
    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        arr.push({ name: key, score: localStorage[key] });
      }
    }
    setTop(arr);
  }, []);

  const getCards = async () => {
    setLoading(true);
    try {
      const n = Math.floor(Math.random() * 400 + 1);

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
    } catch (err) {
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
        }, 500);
        setCurrent(null);
      } else {
        setStart(false);

        setCurrent(null);
        time === 60 && setMatch(match + 1);
        time === 45 && setMatch(match + 2);
        time === 30 && setMatch(match + 4);
        setTimeout(() => {
          setStart(true);
        }, 500);
      }
    }
  };

  const handleStart = () => {
    const name = prompt("Who's playing?");
    if (name !== null) {
      setName(name);

      setStart(true);
      setCount(time);
      setMatch(0);
      getCards();
    }
  };

  const handleChange = (e) => {
    const diff = e.target.value;

    diff === "easy" && setTime(60);
    diff === "medium" && setTime(45);
    diff === "hard" && setTime(30);
  };

  return (
    <div className="grid">
      {count === 0 || count === null ? (
        <button
          className="btn"
          type="button"
          onClick={() => window.location.reload()}
        >
          <h1 className="logo">記憶</h1>
        </button>
      ) : (
        <button
          className="btn"
          type="button"
          onClick={() => window.location.reload()}
        >
          <h1 className="primary-logo">記憶</h1>
        </button>
      )}
      <div className="btns">
        <form>
          <input
            id="easy"
            type="radio"
            name="difficulty"
            value="easy"
            defaultChecked
            disabled={count > 0}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="easy"> Easy </label>
          <input
            id="medium"
            type="radio"
            name="difficulty"
            value="medium"
            disabled={count > 0}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="medium"> Medium </label>
          <input
            id="hard"
            type="radio"
            name="difficulty"
            value="hard"
            disabled={count > 0}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="hard"> Hard </label>
        </form>

        <span>
          {count !== null && (
            <button className="btn " type="button" onClick={() => getCards()}>
              <span>
                Next Cards <i className="fas fa-step-forward"></i>
              </span>
            </button>
          )}

          {count === 0 || count === null ? (
            <button
              className="btn "
              type="button"
              onClick={() => handleStart()}
            >
              <i className="larger danger fas fa-power-off"></i>
            </button>
          ) : (
            <button
              className="btn "
              type="button"
              onClick={() => window.location.reload()}
            >
              <i className="larger primary fas fa-power-off"></i>
            </button>
          )}
        </span>
        {count !== null && (
          <p className="scoreboard">
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
      {localStorage.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {topScore.length > 0 &&
              topScore.map((data, key) => (
                <tr key={key}>
                  <td>{data.name}</td>
                  <td>{data.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Grid;
