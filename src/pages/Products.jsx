import React, { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function Products(){
  const [list,setList]=useState([]);
  const [vendors,setVendors]=useState([]);
  const [categories,setCategories]=useState([]);

  const [name,setName]=useState('');
  const [price,setPrice]=useState('');
  const [vendorId,setVendorId]=useState('');
  const [categoryId,setCategoryId]=useState('');
  const [imageUrl,setImageUrl]=useState('');
  const [description,setDescription]=useState('');
  const [editing,setEditing]=useState(null);

  useEffect(()=>{ load(); API.get('/vendors').then(r=>setVendors(r.data)); API.get('/categories').then(r=>setCategories(r.data)) },[]);
  const load = async ()=>{ const r = await API.get('/products'); setList(r.data) };

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
    if(!name||!price||!vendorId||!categoryId) return alert('Fill required fields');
    const body = { name, price: Number(price), vendorId, categoryId, image: imageUrl||'', description };
    if(editing) await API.put(`/products/${editing._id}`, body);
    else await API.post('/products', body);
    setName(''); setPrice(''); setVendorId(''); setCategoryId(''); setImageUrl(''); setDescription(''); setEditing(null); load();
  };

  const edit = (p)=>{ setEditing(p); setName(p.name||''); setPrice(p.price||''); setVendorId(p.vendorId?._id||p.vendorId||''); setCategoryId(p.categoryId?._id||p.categoryId||''); setImageUrl(p.image||''); setDescription(p.description||'') };
  const remove = async (id)=>{ if(!confirm('Delete?')) return; await API.delete(`/products/${id}`); load() };

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:12}}>
      <div>
        <h2>Products</h2>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',marginBottom:8}} />
        <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} style={{width:'100%',marginBottom:8}} />
        <select value={vendorId} onChange={e=>setVendorId(e.target.value)} style={{width:'100%',marginBottom:8}}>
          <option value=''>Select vendor</option>
          {vendors.map(v=> <option key={v._id} value={v._id}>{v.name}</option>)}
        </select>
        <select value={categoryId} onChange={e=>setCategoryId(e.target.value)} style={{width:'100%',marginBottom:8}}>
          <option value=''>Select category</option>
          {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{width:'100%',marginBottom:8,minHeight:80}} />
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="file" accept="image/*" onChange={onFile} />
          <button onClick={save} className="btn">{editing? 'Update':'Add'}</button>
        </div>
        {imageUrl && <div style={{marginTop:8}}><img src={imageUrl} alt="product" style={{width:160}} /></div>}
      </div>

      <div>
        <h3>Products List</h3>
        <ul>
          {list.map(p=> <li key={p._id}><strong>{p.name}</strong> — ₹{p.price}<br/><small>Vendor: {p.vendorId?.name||'—'} · Category: {p.categoryId?.name||'—'}</small><div><button onClick={()=>edit(p)}>Edit</button> <button onClick={()=>remove(p._id)}>Delete</button></div></li>)}
        </ul>
      </div>
    </div>
  );
}
