import React, { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function Categories(){
  const [list,setList]=useState([]);
  const [vendors,setVendors]=useState([]);
  const [name,setName]=useState('');
  const [vendorId,setVendorId]=useState('');
  const [editing,setEditing]=useState(null);

  useEffect(()=>{ API.get('/vendors').then(r=>setVendors(r.data)); load() },[]);
  const load = async ()=>{ const r = await API.get('/categories'); setList(r.data) };

  const save = async ()=>{
    if(!name||!vendorId) return alert('Fill fields');
    if(editing) await API.put(`/categories/${editing._id}`, { name, vendorId });
    else await API.post('/categories', { name, vendorId });
    setName(''); setVendorId(''); setEditing(null); load();
  };

  const edit = (c)=>{ setEditing(c); setName(c.name||''); setVendorId(c.vendorId?._id||c.vendorId||'') };
  const remove = async (id)=>{ if(!confirm('Delete?')) return; await API.delete(`/categories/${id}`); load() };

  return (
    <div>
      <h2>Categories</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Category name" value={name} onChange={e=>setName(e.target.value)} />
        <select value={vendorId} onChange={e=>setVendorId(e.target.value)}>
          <option value=''>Select vendor</option>
          {vendors.map(v=> <option key={v._id} value={v._id}>{v.name}</option>)}
        </select>
        <button onClick={save} className="btn">{editing? 'Update':'Add'}</button>
      </div>

      <ul>
        {list.map(c=> <li key={c._id}><strong>{c.name}</strong> (vendor: {c.vendorId?.name||'—'}) <div><button onClick={()=>edit(c)}>Edit</button> <button onClick={()=>remove(c._id)}>Delete</button></div></li>)}
      </ul>
    </div>
  );
}
