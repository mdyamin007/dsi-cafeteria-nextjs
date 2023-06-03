'use client'
import {signInWithPopup} from "firebase/auth"
import {auth, provider} from "../firebase/config"

export default function Home() {

  const handleLogin = () => {
    signInWithPopup(auth, provider)
  }

  return (
    <main>
    <h1>Hello World!</h1>
    <button onClick={handleLogin} className="bg-red-300 px-2 py-2">Login with google</button>
    </main>
  )
}
