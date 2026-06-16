"use client";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function Signup() {
  const [error, setError] = useState();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const signupResponse = await axios.post("/api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        fullname: formData.get("fullname"),
      });
      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.ok) return router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border px-8 py-10 w-3/12 shadow-sm"
      >
        {error && (
          <div className="bg-primary text-background p-2 mb-2">{error}</div>
        )}
        <h1 className="text-4xl font-bold mb-7 text-primary">Signup</h1>

        <label className="text-text-soft">Fullname:</label>
        <input
          type="text"
          placeholder="Fullname"
          className="bg-background border border-border px-4 py-2 block mb-2 w-full text-text focus:outline-none focus:ring-2 focus:ring-accent"
          name="fullname"
        />

        <label className="text-text-soft">Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="bg-background border border-border px-4 py-2 block mb-2 w-full text-text focus:outline-none focus:ring-2 focus:ring-accent"
          name="email"
        />

        <label className="text-text-soft">Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="bg-background border border-border px-4 py-2 block mb-2 w-full text-text focus:outline-none focus:ring-2 focus:ring-accent"
          name="password"
        />

        <button className="bg-primary text-background px-4 py-2 block w-full mt-4 hover:bg-primary-dark transition-colors">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
