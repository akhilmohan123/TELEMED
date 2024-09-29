import React, { useState } from 'react';
import './about.css'
function About() {
    const [activeTab, setActiveTab] = useState('platform');
    const tabContent = {
        platform: {
          title: "State-of-the-Art Telemedicine Platform",
          content: "Our platform offers seamless video consultations, integrated health records, and AI-assisted diagnoses. We've designed every feature with both patients and healthcare providers in mind, ensuring a smooth and efficient experience for all users."
        },
        technology: {
          title: "Cutting-Edge Technology",
          content: "MediConnect leverages the latest advancements in telemedicine, including high-definition video streaming, secure data encryption, and machine learning algorithms for predictive healthcare. Our technology is constantly evolving to provide the best possible care."
        },
        team: {
          title: "Expert Team",
          title: "Expert Team",
          content: "Our team consists of world-class physicians, technologists, and healthcare innovators. Led by Dr. Emily Chen, a pioneer in digital health, our diverse team brings together expertise from medicine, software engineering, and user experience design."
        }
      };
    
  return (
    <div>
      <section id="section2" className="about section">
      <div className="about-page">
      <header className="header">
        <h1>About MediConnect</h1>
        <p className="subtitle">Revolutionizing Healthcare Through Technology</p>
      </header>

      <div className="content-grid">
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At MediConnect, we're on a mission to make quality healthcare accessible to everyone, 
            everywhere. By leveraging cutting-edge technology, we're breaking down barriers and 
            connecting patients with healthcare providers in ways never before possible.
          </p>
        </div>
        
        <div className="features-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li><span className="icon">⏰</span> 24/7 Access to Care</li>
            <li><span className="icon">🔒</span> Secure & Confidential</li>
            <li><span className="icon">👤</span> Personalized Treatment</li>
            <li><span className="icon">📊</span> Comprehensive Health Tracking</li>
          </ul>
        </div>
      </div>

      <div className="tabs-section">
        <div className="tab-buttons">
          {Object.keys(tabContent).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <h3>{tabContent[activeTab].title}</h3>
          <p>{tabContent[activeTab].content}</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Transform Your Healthcare Experience?</h2>
        <button className="cta-button">Get Started Now</button>
      </div>
      </div>
      </section>
    </div>
  );
}

export default About;
