import { auth, provider, signInWithPopup, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { SET_USER } from "./actionType";

const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});
export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        console.log(payload);
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    console.log(4);
    if (payload.image !== "") {
      console.log(5);

      const storageRef = ref(storage, `images/${payload.image.name}`);
      // .put(
      //   payload.image
      // );

      const upload = uploadBytesResumable(storageRef, payload.image);

      console.log(6);
      upload.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progress : ${progress}`);
          if (snapshot.state === "RUNNING") {
            console.log(`Progress :----  ${progress} `);
          }
        },
        (error) => console.log(error.code),
        async () => {
          getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            db.collection("articles").add({
              actor: {
                description: payload.user.email,
                title: payload.user.displayName,
                date: payload.timestamp,
                image: payload.user.photoURL,
              },
              video: payload.video,
              sharedImg: downloadURL,
              comments: 0,
              description: payload.description,
            });
          });
          // const downloadURL = await upload.snapshot.ref.getDownloadURL();
        }
      );
    }
  };
}
