import { useEffect, useState } from "react";
import firebase from "./firebase.js";
import { TextField, Paper, Typography, Button, Icon } from "@material-ui/core";
import profilePic from "./assets/profile-pic.jpg";

const BlogPage = ({ auth }) => {
  const [data, setData] = useState();
  const [update, setUpdate] = useState(true);
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

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

  const handlePost = () => {
    if (titleInput === undefined || titleInput === "") {
      setTitleError(true);
      return;
    }
    if (contentInput === undefined || contentInput === "") {
      setContentError(true);
      return;
    }

    const currentDate = new Date();
    const post = {
      userId: auth.uid,
      userName: auth.email,
      title: titleInput,
      text: contentInput,
      date: `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    };
    if (auth) {
      firebase.firestore().collection("posts").add(post);
    }
    setUpdate(!update);
  };

  const handleDelete = () => {
    // if (auth && auth.uid === post.userId) {
    //   firebase.firestore().collection("posts").doc({post.id}).delete().then(() => {
    //     console.log("Post successfully delete");
    //   }).catch((error) => {
    //     console.error("Error deleting post: ", error);
    //   })
    // }
    setUpdate(!update);
  }

  const handleTitle = (event) => {
    setTitleInput(event.target.value);
    setTitleError(false);
  } 

  const handleContent = (event) => {
    setContentInput(event.target.value);
    setContentError(false);
  } 

  return (
    <div style={{ textAlign: "center" }}>
      {auth && (
        <div
          style={{
            textAlign: "left",
            margin: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "500px",
          }}
        >
          <Typography variant="h5">Make a Post</Typography>
          <TextField
            variant="outlined"
            required
            label="Title"
            style={{ width: "30%" }}
            value={titleInput}
            onChange={handleTitle}
            error={titleError}
            helperText={titleError ? "Title must not be empty" : ""}
          />
          <TextField
            variant="outlined"
            required
            label="Content"
            multiline
            placeholder="Type your blog post here"
            rows={15}
            style={{ width: "50%" }}
            value={contentInput}
            onChange={handleContent}
            error={contentError}
            helperText={contentError ? "Title must not be empty" : ""}
          />
          <Button
            variant="contained"
            onClick={handlePost}
            style={{ width: "fit-content" }}
          >
            Post
          </Button>
        </div>
      )}
      {data !== undefined &&
        data.map((post) => (
          <Paper
            elevation={3}
            style={{
              width: "60%",
              backgroundColor: "#e7e7e7",
              float: "left",
              margin: "20px 20px",
            }}
          >
            <div style={{ borderBottom: "1px black solid" }}>
              <Typography
                variant="h5"
                style={{ margin: "10px", textAlign: "left" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "90%",
                    marginRight: "0px",
                  }}
                >
                  {post.title}
                </span>
                <img
                  src={profilePic}
                  alt="profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "100%",
                    float: "right",
                    margin: "10px",
                  }}
                />
              </Typography>
              <p
                style={{ opacity: ".8", textAlign: "left", margin: "5px 10px" }}
              >
                Posted on {post.date} by {post.userName}
              </p>
            </div>
            <p style={{ textAlign: "left", margin: "10px" }}>{post.text}</p>
            {auth && auth.uid === post.userId && <Button color="inherit" endIcon={<Icon>delete</Icon>} style={{float: "right", margin: "5px"}} onClick={handleDelete}>Delete</Button>}
          </Paper>
        ))}

      {/* <button onClick={handlePost}>Post</button> */}
    </div>
  );
};

export default BlogPage;
