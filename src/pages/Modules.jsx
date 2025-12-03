import React, { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function Modules() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ load() },[]);
  const load = async ()=>{ const r = await API.get('/modules'); setList(r.data) };

  const save = async ()=>{
    if(!name.trim()) return alert('Enter name');
    if(editing) await API.put(`/modules/${editing._id}`, { name });
    else await API.post('/modules', { name });
    setName(''); setEditing(null); load();
  };

  const edit = (m)=>{ setEditing(m); setName(m.name) };
  const remove = async (id)=>{ if(!confirm('Delete?')) return; await API.delete(`/modules/${id}`); load() };

  return (
    <div>
      <h2>Modules</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Module name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={save} className="btn">{editing? 'Update' : 'Add'}</button>
        {editing && <button onClick={()=>{setEditing(null); setName('')}}>Cancel</button>}
      </div>
      <ul>
        {list.map(m=> <li key={m._id}>{m.name} <button onClick={()=>edit(m)}>Edit</button> <button onClick={()=>remove(m._id)}>Delete</button></li>)}
      </ul>
    </div>
  );
}
