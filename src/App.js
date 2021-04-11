import React from 'react';
import {useState, useEffect} from 'react';
import firebase, {displayAuthUi} from './firebase.js';

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    displayAuthUi("#firebase-authui")
    firebase.firestore().collection("posts").get().then((response) => {
      const arr = [];
      response.forEach(res => arr.push(res.data()));
      setData(arr);
    });
  }, [])

  const handleClick = () => {
    firebase.firestore().collection("posts").add({
      userId: "test user 2",
      text: "test content 2",
      date: "04/06/2021"
    })
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {data !== undefined && data.map(post => 
      <div style={{ width: "200px", backgroundColor: "#e7e7e7", borderRadius: "5px", padding: "15px", margin: "20px auto", boxShadow: "5px 10px #888888" }}>
        <h1>{post.userId}</h1>
        <p>{post.text}</p>
        <p>{post.date}</p>
      </div>)}
      <div id="firebase-authui"></div>
      <button onClick={handleClick}>Post</button>
    </div>
  );
}

export default App;
