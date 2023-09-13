import { auth } from "../../libs/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const signInGoogle = async () => {
  const { user } = await signInWithPopup(auth, provider);
  console.log(user);
};

export default signInGoogle;
