import React, { useEffect } from 'react';
import "./homecss/header.css";

function Header() {
  const token = localStorage.getItem("token");
  let slideIndex = 1;  // Initialize slideIndex

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  const showSlides = (n) => {
    let i;
    let slides = document.getElementsByClassName("mySlides");

    if (slides.length === 0) {
      console.error("No slides found");
      return;
    }

    // Check if n is out of bounds
    if (n > slides.length) {
      slideIndex = 1;
    } else if (n < 1) {
      slideIndex = slides.length;
    } else {
      slideIndex = n;
    }

    // Hide all slides
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }

    // Show the correct slide
    slides[slideIndex - 1].style.display = "block";  
  };

  useEffect(() => {
    showSlides(slideIndex);  // Show the first slide on mount
  }, [token]);

  return (
    <div>
      <div className="slideshow-container">
        <div className="mySlides fade">
          <div className="numbertext">1 / 3</div>
          <img src="/img/hero-carousel/hero-carousel-1.jpg" alt="Slide 1" />
          <div className="text">Caption Text</div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">2 / 3</div>
          <img src="/img/hero-carousel/hero-carousel-2.jpg" alt="Slide 2" />
          <div className="text">Caption Two</div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">3 / 3</div>
          <img src="/img/hero-carousel/hero-carousel-3.jpg" alt="Slide 3" />
          <div className="text">Caption Three</div>
        </div>

        <a className="prev" onClick={() => plusSlides(-1)}>❮</a>
        <a className="next" onClick={() => plusSlides(1)}>❯</a>
      </div>
    </div>
  );
}

export default Header;
