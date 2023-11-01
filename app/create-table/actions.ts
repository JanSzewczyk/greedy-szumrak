"use server";

import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { redirect } from "next/navigation";

import { getUserSession } from "~/api";
import { db } from "~/lib/firebase";

export async function createTableAction() {
  const { user } = await getUserSession();

  console.log("user", user);

  const cx = await addDoc(collection(db, "spaces", user.id, "tables"), {
    name: "Table name",
    createAt: serverTimestamp()
  });

  // const newTable = await addDoc(collection(db, "tables", user.id), {

  // });

  console.log("server action");
  redirect("/");
}
