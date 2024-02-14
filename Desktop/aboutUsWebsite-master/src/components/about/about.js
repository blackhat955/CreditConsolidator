import React, { useEffect } from 'react';
import 'wow.js/css/libs/animate.css';
import jQuery from 'jquery';
import 'jquery.counterup';
import WOW from 'react-wow';

const About = () => {
    return (
        <div id="learn-more">
 <div className="container-xxl py-5">
        <div className="container">
            <div className="row g-5 align-items-center">
            <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" style={{visibility: 'visible', animationDelay: '0.1s', animationName: 'fadeInUp'}}>
<img class="img-fluid" src="img/about-us-2.png" alt=""/>
</div>
            
                <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div className="h-100">
                        <h1 className="display-6 text-start">About Us</h1>
                        <p className="text-primary fs-5 mb-4 text-start">Where Technology Meets Innovation</p>
                        <p className='text-start'>Revolutionizing industries with cutting-edge technological advancements, ensuring seamless digital transformation for your business.</p>
                        <p className="mb-4 text-start">Innovating business landscapes through state-of-the-art software innovations, dedicated to propelling your company's digital evolution.</p>
                        <div className="d-flex align-items-center mb-2">
                            <i className="fa fa-check bg-light text-primary btn-sm-square rounded-circle me-3 fw-bold"></i>
                            <span>Proven Track Record of Success</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <i className="fa fa-check bg-light text-primary btn-sm-square rounded-circle me-3 fw-bold"></i>
                            <span>Client-Centric Approach</span>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <i className="fa fa-check bg-light text-primary btn-sm-square rounded-circle me-3 fw-bold"></i>
                            <span>Exceptional Quality Assurance</span>
                        </div>
                        <a className="btn btn-primary py-3 px-4" href="/about">Know More</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    );
};

export default About;

