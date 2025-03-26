"use client";

import { useEffect, useState } from "react";
import useUserState from "../(authenticated)/store/userUpdateStore";
import { Dumbbell } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignPage() {
  const router =useRouter();
  const { login, user, logout } = useUserState();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    //console.log("Updated user:", user);
  }, [user]);
  useEffect(() => {
    //console.log("Updated user:", user);
    //console.log(user);
    const localUser = localStorage.getItem("user");
    if(localUser){
      router.push('/');
    }
  }, []);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    Signup();
  }

  async function Signup() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`/user/signup`, {
        email,
        password,
      });

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("user", JSON.stringify(response.data));
        await login(response.data);
        console.log(user);
        router.push('/');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error object:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        setError(error.response?.data?.error);
      } else {
        console.error("Non-Axios error:", error);
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#020817] w-full text-white">
      <div className="flex flex-col items-center justify-center w-1/4 border-white border-2 rounded-lg p-10 bg-[#020817] h-fit text-white">
        <div className="rounded-full bg-slate-800 m-2 size-16 flex items-center justify-center p-2">
          <Dumbbell className="text-blue-500 size-8" />
        </div>
        <div className="text-5xl font-bold mb-3">Rep-Sync</div>
        <div className="w-4/5 flex text-center">
          Track your workouts, monitor your progress, achieve your fitness goals
        </div>
        <h1 className="text-3xl font-semibold mb-6">Signup</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 rounded bg-gray-800 text-white"
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 rounded bg-gray-800 text-white"
          autoComplete="off"
        />
        <button
          disabled={isLoading}
          onClick={(e) => handleSubmit(e)}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </main>
  );
}
