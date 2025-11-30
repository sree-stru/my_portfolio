import React from "react";
import "./styles/know.css";
import "./styles/works.css";
import "./styles/contact.css";
import KnowMe from "./components/KnowMe";
import Works from "./components/Works";
import Contact from "./components/Contact";

export default function App() {
  console.log('App.jsx: render start');
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <h1 className="hero-name">
            <span className="hero-name-line1">ANUSREE K</span>
            <span className="hero-name-line2">JINAN</span>
          </h1>
          <div className="hero-role">
            <span className="allerson">Graphic Designer</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="body-sections">
          <KnowMe />
          <Works />
          <Contact />
        </section>
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <small>© {new Date().getFullYear()} Anusree K Jinan — All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

