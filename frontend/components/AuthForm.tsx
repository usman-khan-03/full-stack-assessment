"use client";

import { useState } from "react";
import { loginWithEmail, registerWithEmail, loginWithGoogle } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (type === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // TODO: Redirect to /dashboard
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{type === "login" ? "Login" : "Register"}</h1>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full">
        {type === "login" ? "Login" : "Register"}
      </Button>
      <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
        Continue with Google
      </Button>
    </div>
  );
}
