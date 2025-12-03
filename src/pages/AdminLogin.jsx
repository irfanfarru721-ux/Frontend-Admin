import React, { useState } from "react";
import API from "../api/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("admin_token", res.data.token);
      nav("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{padding:24}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{maxWidth:420}}>
        <input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} style={{width:'100%',marginBottom:8}} />
        <input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:'100%',marginBottom:8}} />
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
}
