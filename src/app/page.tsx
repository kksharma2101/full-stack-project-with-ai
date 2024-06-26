import Image from "next/image";
import { SignUp } from "./sign-up/page";
import { SignIn } from "./sign-in/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="">Hello chai aur code</h1>
      {/* <SignUp /> */}
      {/* <SignIn /> */}
    </main>
  );
}
