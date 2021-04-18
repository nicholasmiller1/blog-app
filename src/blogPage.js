import { useEffect, useState } from "react";
import firebase from "./firebase.js";
import { TextField, Paper, Typography, Button, Icon, Select, MenuItem } from "@material-ui/core";
import profilePic from "./assets/profile-pic.jpg";

const BlogPage = ({ auth }) => {
  const [data, setData] = useState();
  const [update, setUpdate] = useState(0);
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [sort, setSort] = useState("likes");

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then((response) => {
        const arr = [];
        response.forEach((res) => arr.push({...res.data(), id: res.id}));

        switch(sort) {
          case "likes": 
            arr.sort((p1, p2) => p2.likes.length - p1.likes.length);
            break;
          case "unlikes":
            arr.sort((p1, p2) => p1.likes.length - p2.likes.length);
            break;
          case "recent":
            arr.sort((p1, p2) => {
              p1 = p1.date.split("/");
              p2 = p2.date.split("/");

              if (p2[2] === p1[2]) {
                if (p2[0] === p1[0]) {
                  if (p2[1] === p1[1]) {
                    return 0;
                  } else if (p2[1] < p1[1]) {
                    return -1;
                  } else {
                    return 1;
                  }
                } else if (p2[0] < p1[0]) {
                  return -1;
                } else {
                  return 1;
                }
              } else if (p2[2] < p1[2]) {
                return -1;
              } else {
                return 1;
              }
            });
            break;
          case "oldest":
            arr.sort((p1, p2) => {
              p1 = p1.date.split("/");
              p2 = p2.date.split("/");

              if (p2[2] === p1[2]) {
                if (p2[0] === p1[0]) {
                  if (p2[1] === p1[1]) {
                    return 0;
                  } else if (p2[1] < p1[1]) {
                    return 1;
                  } else {
                    return -1;
                  }
                } else if (p2[0] < p1[0]) {
                  return 1;
                } else {
                  return -1;
                }
              } else if (p2[2] < p1[2]) {
                return 1;
              } else {
                return -1;
              }
            });
            break;
          default:
            arr.sort((p1, p2) => p2.likes.length - p1.likes.length);
        }
        setData(arr);
      });
  }, [update, sort]);

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
      likes: []
    };
    if (auth) {
      firebase.firestore().collection("posts").add(post);
    }
    setUpdate(update + 1);
  };

  const handleDelete = (post, event) => {
    if (auth && auth.uid === post.userId) {
      firebase.firestore().collection("posts").doc(post.id).delete().then(() => {
        console.log("Post successfully delete");
      }).catch((error) => {
        console.error("Error deleting post: ", error);
      })
    }
    setUpdate(update + 1);
  }

  const handleLike = (post, event) => {
    if (auth) {
      if (post.likes.includes(auth.uid)) {
        firebase.firestore().collection("posts").doc(post.id).update({ likes: post.likes.filter(item => item !== auth.uid) }).then(() => {
          console.log("Unlike update successful");
        }).catch(error => {
          console.error("Error unliking post: ", error);
        });
      } else {
        firebase.firestore().collection("posts").doc(post.id).update({ likes: [...post.likes, auth.uid] }).then(() => {
          console.log("Like update successful");
        }).catch((error) => {
          console.error("Error liking post: ", error);
        });
      }
    }
    setUpdate(update + 1);
    console.log(update);
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
            key={post.id}
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
            <Button color="inherit" endIcon={auth && post.likes.includes(auth.uid) ? <Icon style={{color: "blue"}}>thumb_up</Icon> : <Icon>thumb_up</Icon>} style={{float: "left", margin: "5px"}} onClick={(event) => handleLike(post, event)}>{post.likes.length}</Button>
            {auth && auth.uid === post.userId && <Button color="inherit" endIcon={<Icon>delete</Icon>} style={{float: "right", margin: "5px"}} onClick={(event) => handleDelete(post, event)}>Delete</Button>}
          </Paper>
        ))}

        
        <Typography variant="h5">Sort Posts</Typography> 
        <Select label="Sort Criteria" variant="outlined" value={sort} onChange={(event) => setSort(event.target.value)}>
          <MenuItem value="likes">Most Likes</MenuItem>
          <MenuItem value="unlikes">Least Likes</MenuItem>
          <MenuItem value="recent">Most Recent</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
    </div>
  );
};

export default BlogPage;
