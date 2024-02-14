import React from 'react';
import './VishalCard.css'; // Stylesheet for Card component

const VishalCard = ({ imageUrl, title, description, githubUrl, linkedinUrl }) => {
  return (
    <div className="card">
      <div className="image-container">
        <img src={imageUrl} alt="Profile" className="profile-image" />
        <div className="social-icons">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
        </div>
      </div>
      <div className="info-container">
        <h2 className="title">{title}</h2>
        <p className="description">{description}</p>
        <a href={linkedinUrl} target='_blank' className="btn btn-primary">
          View Profile
        </a>
      </div>
    </div>
  );
};

export default VishalCard;
