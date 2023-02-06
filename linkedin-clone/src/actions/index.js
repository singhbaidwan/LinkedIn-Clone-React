import { auth, provider, signInWithPopup, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { SET_USER, SET_LOADING_STATUS, GET_ARTCILES } from "./actionType";

const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTCILES,
  payload: payload,
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
      dispatch(setLoading(true));
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
          getDownloadURL(upload.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            // db.collection("articles").add({
            //   actor: {
            //     description: payload.user.email,
            //     title: payload.user.displayName,
            //     date: payload.timestamp,
            //     image: payload.user.photoURL,
            //   },
            //   video: payload.video,
            //   sharedImg: downloadURL,
            //   comments: 0,
            //   description: payload.description,
            // });
            const docRef = await addDoc(collection(db, "articles"), {
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
            console.log("Document written with ID: ", docRef.id);
            dispatch(setLoading(false));
          });
          // const downloadURL = await upload.snapshot.ref.getDownloadURL();
        }
      );
    } else if (payload.video) {
      const addVideo = async () => {
        const docRef = await addDoc(collection(db, "articles"), {
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timestamp,
            image: payload.user.photoURL,
          },
          video: payload.video,
          sharedImg: "",
          comments: 0,
          description: payload.description,
        });
        console.log("Document written with ID: ", docRef.id);
        dispatch(setLoading(false));
      };
      addVideo();
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    let payload = [];
    console.log("enterred get articles api");
    // db.collection("articles")
    //   .orderBy("actor.date", "desc")
    //   .onSnapshot((snapshot) => {
    //     console.log("read the /....:");
    //     payload = snapshot.docs.map((doc) => doc.data());
    //     console.log(payload);
    //   });
    const fetchData = async () => {
      const q = query(
        collection(db, "articles"),
        orderBy("actor.date", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((data) => {
        payload = [...payload, data.data()];
      });
      console.log("i got data passing to payload", payload);
      dispatch(getArticles(payload));
    };
    fetchData();
  };
}
