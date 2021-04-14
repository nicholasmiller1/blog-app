import { useEffect, useState } from "react";
import firebase from "./firebase.js";

const BlogPage = ({ auth }) => {
  const [data, setData] = useState();
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then((response) => {
        const arr = [];
        response.forEach((res) => arr.push(res.data()));
        setData(arr);
      });
  }, [update]);

  const handleClick = () => {
    const post = {
      userId: "test user 2",
      text: "test content 2",
      date: "04/06/2021",
    };
    if (auth) {
      firebase.firestore().collection("posts").add(post);
    }
    setUpdate(!update);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {data !== undefined &&
        data.map((post) => (
          <div
            style={{
              width: "200px",
              backgroundColor: "#e7e7e7",
              borderRadius: "5px",
              padding: "15px",
              margin: "20px auto",
              boxShadow: "5px 10px #888888",
            }}
          >
            <h1>{post.userId}</h1>
            <p>{post.text}</p>
            <p>{post.date}</p>
          </div>
        ))}

      <button onClick={handleClick}>Post</button>
    </div>
  );
};

export default BlogPage;
