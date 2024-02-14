import React, { useEffect } from 'react';
import 'wow.js/css/libs/animate.css';
import jQuery from 'jquery';
import 'jquery.counterup';
import WOW from 'react-wow';

const ServiceAbout = () => {
    return (
        <>
        <br />
     <div className="container-xxl bg-light py-5 my-5">
        <div className="container py-5">
            <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{maxWidth: '500px'}}>
                <h1 className="display-6">Projects Delivered</h1>
                <p className="text-primary fs-5 mb-5">Buy, Sell And Exchange Cryptocurrency</p>
            </div>
            <div className="row g-4">
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="service-item bg-white p-5">
                        <img className="img-fluid mb-4" src="img/icon-9.jpeg" alt=""/>
                        <h5 className="mb-3">Currency Wallet</h5>
                        <p>Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo</p>
                        <a href="https://github.com/blackhat955/animated-portfolio"  target='_blank'>Take a Look<i className="fa fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div className="service-item bg-white p-5">
                        <img className="img-fluid mb-4" src="img/icon-3.png" alt="" />
                        <h5 className="mb-3">Currency Transaction</h5>
                        <p>Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo</p>
                        <a href="">Read More <i className="fa fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div className="service-item bg-white p-5">
                        <img className="img-fluid mb-4" src="img/icon-9.jpeg" alt=""/>
                        <h5 className="mb-3">Bitcoin Investment</h5>
                        <p>Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo</p>
                        <a href="">Read More <i className="fa fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="service-item bg-white p-5">
                        <img className="img-fluid mb-4" src="img/icon-5.jpeg" alt=""/>
                        <h5 className="mb-3">Currency Exchange</h5>
                        <p>Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo</p>
                        <a href="">Read More <i className="fa fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div className="service-item bg-white p-5">
                        <img className="img-fluid mb-4" src="img/icon-2.png" alt=""/>
                        <h5 className="mb-3">Bitcoin Escrow</h5>
                        <p>Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo</p>
                        <a href="">Read More <i className="fa fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div className="service-item bg-white p-5">
                        <img className="img-fluid mb-4" src="img/icon-8.jpeg" alt=""/>
                        <h5 className="mb-3">Token Sale</h5>
                        <p>Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo</p>
                        <a href="">Read More <i className="fa fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    );
};

export default ServiceAbout;