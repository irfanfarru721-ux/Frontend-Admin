import React, { useEffect, useState } from "react";
import API from "../api/adminApi";

export default function Dashboard() {
  const [stats, setStats] = useState({users:0, vendors:0, categories:0, products:0});

  useEffect(()=>{
    const token = localStorage.getItem('admin_token');
    if(!token) return;
    const fetchData = async ()=>{
      try{
        // try count endpoints first, fallback to list length
        const urls = [
          '/users/count','/vendors/count','/categories/count','/products/count'
        ];
        const promises = urls.map(u=>API.get(u).catch(()=>null));
        const res = await Promise.all(promises);
        const [u,v,c,p] = res;
        setStats({
          users: u?.data?.total ?? 0,
          vendors: v?.data?.total ?? 0,
          categories: c?.data?.total ?? 0,
          products: p?.data?.total ?? 0,
        });
        // fallback: if any count returned 0, fetch lists for accurate counts
        if([u,v,c,p].some(r=>r==null || r.status!==200)){
          const lists = await Promise.all([API.get('/users'),API.get('/vendors'),API.get('/categories'),API.get('/products')]);
          setStats({
            users: lists[0].data.length,
            vendors: lists[1].data.length,
            categories: lists[2].data.length,
            products: lists[3].data.length,
          });
        }
      }catch(err){
        console.log('Dashboard error', err.message);
      }
    };
    fetchData();
  },[]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginTop:12}}>
        <div className='card'><h3>Total Users</h3><p style={{fontSize:28}}>{stats.users}</p></div>
        <div className='card'><h3>Total Vendors</h3><p style={{fontSize:28}}>{stats.vendors}</p></div>
        <div className='card'><h3>Total Categories</h3><p style={{fontSize:28}}>{stats.categories}</p></div>
        <div className='card'><h3>Total Products</h3><p style={{fontSize:28}}>{stats.products}</p></div>
      </div>
    </div>
  );
}
