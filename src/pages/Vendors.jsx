import React, { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function Vendors(){
  const [list,setList] = useState([]);
  const [modules,setModules] = useState([]);
  const [name,setName] = useState('');
  const [moduleId,setModuleId] = useState('');
  const [imageUrl,setImageUrl] = useState('');
  const [editing,setEditing] = useState(null);

  useEffect(()=>{ load(); API.get('/modules').then(r=>setModules(r.data)) },[]);
  const load = async ()=>{ const r = await API.get('/vendors'); setList(r.data) };

  const uploadToCloudinary = async (file)=>{
    if(!file) return null;
    const url = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL || '';
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
    if(!url || !preset) return null;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);
    const res = await fetch(url, { method:'POST', body:fd });
    const json = await res.json();
    return json.secure_url || json.url;
  };

  const onFile = async (e)=>{ const f = e.target.files[0]; if(!f) return; const up = await uploadToCloudinary(f); if(up) setImageUrl(up) };

  const save = async ()=>{
    if(!name||!moduleId) return alert('Fill fields');
    const body = { name, moduleId, image: imageUrl || undefined };
    if(editing) await API.put(`/vendors/${editing._id}`, body);
    else await API.post('/vendors', body);
    setName(''); setModuleId(''); setImageUrl(''); setEditing(null); load();
  };

  const edit = (v)=>{ setEditing(v); setName(v.name||''); setModuleId(v.moduleId?._id||v.moduleId||''); setImageUrl(v.image||'') };
  const remove = async (id)=>{ if(!confirm('Delete?')) return; await API.delete(`/vendors/${id}`); load() };

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:12}}>
      <div>
        <h2>Vendors</h2>
        <input placeholder="Vendor name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',marginBottom:8}} />
        <select value={moduleId} onChange={e=>setModuleId(e.target.value)} style={{width:'100%',marginBottom:8}}>
          <option value=''>Select module</option>
          {modules.map(m=> <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="file" accept="image/*" onChange={onFile} />
          <button onClick={save} className="btn">{editing? 'Update':'Add'}</button>
        </div>
        {imageUrl && <div style={{marginTop:8}}><img src={imageUrl} alt="vendor" style={{width:160}} /></div>}
      </div>

      <div>
        <h3>Existing Vendors</h3>
        <ul>
          {list.map(v=> <li key={v._id}><strong>{v.name}</strong> (module: {v.moduleId?.name||'—'}) <div><button onClick={()=>edit(v)}>Edit</button> <button onClick={()=>remove(v._id)}>Delete</button></div></li>)}
        </ul>
      </div>
    </div>
  );
}
