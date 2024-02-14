import React, { useEffect } from 'react';
import 'wow.js/css/libs/animate.css';
import jQuery from 'jquery';
import 'jquery.counterup';
import WOW from 'react-wow';

const Header = () => {
    return (
        <>
<div className="container-fluid hero-header bg-light py-5 mb-5">
        <div className="container py-5" style={{marginTop: '-40px'}}>
            <div className="row g-5 align-items-center">
                <div className="col-lg-6">
                    <h1 className="display-4 mb-3 animated slideInDown text-start">Transforming Businesses with Innovative Software Solutions</h1>
                    <p className="animated slideInDown text-start">Empowering businesses with tailored software solutions. From websites, mobile apps to any software product, we prioritize your success. Trust in our expertise to transform your digital journey.</p>
                    <a href="#learn-more" className="btn btn-primary py-3 px-4 animated slideInDown">Explore More</a>
                </div>
                <div className="col-lg-6 animated fadeIn">
                    <img className="img-fluid animated pulse infinite" style={{animationDuration: '3s'}} src="img/hero-logo1.png" alt=""/>
                </div>
            </div>
        </div>
    </div>
    </>
    );
};

export default Header;