import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../libs/firebase";

export async function updateOrder(id: string, order: number) {
  try {
    const docRef = doc(db, "Project", id);
    await updateDoc(docRef, {
      order,
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
}
