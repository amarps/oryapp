import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
const Layout = (props) => {
    const router=useRouter();
    let menu;
    if (!props.auth){
        menu=(
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item">
        <Link legacyBehavior href="/login">
          <a className="nav-link active" >Login</a>
        </Link>
        </li>
        <li className="nav-item">
        <Link legacyBehavior href="/register">
          <a className="nav-link active" >Register</a>
        </Link>
        </li>
        <li className="nav-item">
        <Link legacyBehavior href="/query">
          <a className="nav-link active" >Query</a>
        </Link>
        </li>
      </ul>
        )
    }else{
      menu=(
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item">
       
          <a href={props.logout_url} className="nav-link active" >Logout</a>
        </li>
      </ul>
      )
    }
    return (
        <>
      <Head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
      rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
      crossOrigin="anonymous"/>
      </Head>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
  <div className="container-fluid">
    <Link legacyBehavior href="/">
        <a className="navbar-brand" >Home</a>
    </Link>
    <div>
      {menu}
      
    </div>
  </div>
</nav>

      <main>
        {props.children}
      </main>
    </>
    );
};
export default Layout;