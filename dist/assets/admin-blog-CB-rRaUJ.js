import{u as a,a as y}from"./query-vendor-CeCaNT8N.js";import{s as t}from"./admin-BtPdLKIr.js";import"./react-vendor-CEpth63u.js";import"./ui-vendor-DtprUGyl.js";const m=async()=>{const{data:o,error:e}=await t.from("blog_posts").select(`
      *,
      category:blog_categories (
        name,
        slug,
        color,
        icon
      )
    `).eq("status","published").order("published_at",{ascending:!1});if(e)throw e;return(o||[]).map(s=>({...s,category_name:s.category?.name,category_slug:s.category?.slug,category_color:s.category?.color,category_icon:s.category?.icon}))},b=async o=>{const{data:e,error:s}=await t.from("blog_posts").select(`
      *,
      category:blog_categories (
        name,
        slug,
        color,
        icon
      )
    `).eq("slug",o).eq("status","published").single();if(s)throw s;return e?{...e,category_name:e.category?.name,category_slug:e.category?.slug,category_color:e.category?.color,category_icon:e.category?.icon}:null},d=async o=>{const{data:e}=await t.from("blog_posts").select("views").eq("id",o).single();e&&await t.from("blog_posts").update({views:(e.views||0)+1}).eq("id",o)},w=()=>a({queryKey:["blog-posts","published"],queryFn:m,staleTime:1e3*60*10}),B=o=>a({queryKey:["blog-posts","slug",o],queryFn:()=>o?b(o):null,enabled:!!o,staleTime:1e3*60*10}),F=()=>y({mutationFn:d}),P=(o,e,s=[])=>a({queryKey:["similarPosts",o,e,s],queryFn:async()=>{if(!o)return[];let c=t.from("published_blog_posts").select("*").neq("id",o).eq("status","published").limit(6);e&&(c=c.eq("category_id",e));const{data:n,error:l}=await c;if(l)throw l;if(s.length>0&&n){const g=n.map(r=>{const i=r.tags?.filter(u=>s.includes(u))||[];return{...r,score:i.length}});return g.sort((r,i)=>i.score-r.score),g.slice(0,3)}return(n||[]).slice(0,3)},enabled:!!o}),f=async()=>{const{data:o,error:e}=await t.from("blog_categories").select("*").order("name");if(e)throw e;return o||[]},K=()=>a({queryKey:["blog-categories"],queryFn:f,staleTime:1e3*60*10});export{K as a,B as b,F as c,P as d,w as u};
