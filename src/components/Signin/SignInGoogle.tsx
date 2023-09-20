import { auth, db } from "../../libs/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigation } from "../../hooks/SignIn/Navigation";
const provider = new GoogleAuthProvider();

const signInGoogle = async () => {
  const { moveStartRegister, moveMain } = useNavigation();
  try {
    const { user } = await signInWithPopup(auth, provider);
    console.log(user);
    const userUid = user.uid;
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnapShot = await getDoc(userDocRef);

    if (userDocSnapShot.exists()) {
      const userInfo = userDocSnapShot.data();
      const userData = {
        newUser: userInfo,
        userUid: userUid,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      moveMain();
    } else {
      moveStartRegister();
    }
  } catch (error) {
    console.error("로그인 실패:", error);
  }
  return null;
};
export default signInGoogle;
