import React, { useEffect } from 'react';
import 'wow.js/css/libs/animate.css';
import jQuery from 'jquery';
import 'jquery.counterup';
import WOW from 'react-wow';
import Navbar from '../components/navbar/navbar';
import ServiceAbout from '../components/servicepage/service';
import About from '../components/about/about';
import Info from '../components/infocard/info';
import durgesh from '../asset/durgesh.jpeg'
import Footer from '../components/footer/footer';
import VishalCard from '../components/VishalCard/VishalCard';
import Contact from '../components/contactForm/contact';
import data from "./data";

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <h1 className='text-center'>About Us</h1>

            {data.map((person, index) => (
                <VishalCard 
                    key={index}
                    imageUrl={person.imageUrl}
                    title={person.name}
                    description={person.bio}
                    githubUrl={person.githubUrl}
                    linkedinUrl={person.linkedinUrl}
                />
            ))}

            <ServiceAbout/>
            <Contact/>
            <Footer />
        </>
    );
};

export default AboutUs;
