import React, { useEffect } from 'react';
import 'wow.js/css/libs/animate.css';
import jQuery from 'jquery';
import 'jquery.counterup';
import WOW from 'react-wow';
import Navbar from '../components/navbar/navbar';
import Headers from '../components/header/header';
import About from './about/about';
import Fact from './fact/fact';
import Feature from './feature/feature';
import ServiceAbout from './servicepage/service';
import Roadmap from './roadmap/roadmap';
import TokeaSale from './sale/sale';
import Faq from './faq/faq';
import Footer from './footer/footer';


export default function Home() {

    useEffect(() => {
        // Spinner
        const spinner = () => {
            setTimeout(() => {
                const spinnerElement = document.getElementById('spinner');
                if (spinnerElement) {
                    spinnerElement.classList.remove('show');
                }
            }, 1);
        };
        spinner();

        // Sticky Navbar
        const handleScroll = () => {
            const stickyTop = document.querySelector('.sticky-top');
            if (window.scrollY > 300) {
                stickyTop.classList.add('shadow-sm');
                stickyTop.style.top = '0px';
            } else {
                stickyTop.classList.remove('shadow-sm');
                stickyTop.style.top = '-100px';
            }

            // Back to top button
            const backToTop = document.querySelector('.back-to-top');
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            // Cleanup the event listener on component unmount
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (
        <>
            <Navbar/>
    {/* <!-- Navbar End --> */}


    {/* <!-- Header Start --> */}
         <Headers/>
    {/* <!-- Header End --> */}


    {/* <!-- About Start --> */}
          <About/>
    {/* <!-- About End --> */}


    {/* <!-- Facts Start --> */}
        <Fact/>
    {/* <!-- Facts End --> */}


    {/* <!-- Features Start --> */}
        <Feature/>
    {/* <!-- Features End --> */}


    {/* <!-- Service Start --> */}
        <ServiceAbout/>
    {/* <!-- Service End --> */}


    {/* <!-- Roadmap Start --> */}
        <Roadmap/>
    {/* <!-- Roadmap End -->


    <!-- Token Sale Start --> */}
        <TokeaSale/>
    {/* <!-- Token Sale Start -->


    <!-- FAQs Start --> */}
         <Faq/>
    {/* <!-- FAQs Start -->


    <!-- Footer Start --> */}
        <Footer/>
    {/* <!-- Footer End -->


    <!-- Back to Top --> */}
    <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"><i className="bi bi-arrow-up"></i></a>
    

        </>
    );
}