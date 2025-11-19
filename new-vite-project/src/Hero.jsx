import React from "react";
import { Link } from "react-router-dom";

const Hero = ()=>{
    return(
    <section id="home" className="hero">
    <h2>Присъедини се към Sport Talk</h2>
      <p>
        Споделяй спортни истории, следи тренировките на приятелите си и вдъхновявай другите.
        Единственото място, където спортът среща общността!
      </p>
      <Link to="/posts">
        <button>Виж постове</button>
      </Link>
    </section> 
    )
};
export default Hero;