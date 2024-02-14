import React, { useEffect, useState, useRef } from 'react';
import 'wow.js/css/libs/animate.css';
import 'jquery.counterup';
import WOW from 'react-wow';

const Fact = () => {
    const [projectsCompleted, setProjectsCompleted] = useState(0);
    const [clientSatisfactionRate, setClientSatisfactionRate] = useState(0);
    const [yearsOfExperience, setYearsOfExperience] = useState(0);

    const constProjectsCompleted = 50;
    const constClientSatisfactionRate = 100;
    const constYearsOfExperience = 5;

    const [isVisible, setIsVisible] = useState(false);
    const factRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(factRef.current);
                }
            },
            { rootMargin: '-50px' } // Adjust the root margin as needed
        );

        if (factRef.current) {
            observer.observe(factRef.current);
        }

        return () => {
            if (factRef.current) {
                observer.unobserve(factRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if(isVisible) {
            const projectsCompletedInterval = setInterval(() => {
                setProjectsCompleted(prevCount => {
                    if (prevCount < constProjectsCompleted) {
                        return prevCount + 1;
                    }
                    clearInterval(projectsCompletedInterval);
                    return constProjectsCompleted;
                });
            }, 70); // Adjust the interval duration

            const clientSatisfactionRateInterval = setInterval(() => {
                setClientSatisfactionRate(prevCount => {
                    if (prevCount < constClientSatisfactionRate) {
                        return prevCount + 1;
                    }
                    clearInterval(clientSatisfactionRateInterval);
                    return constClientSatisfactionRate;
                });
            }, 28); // Adjust the interval duration

            const yearsOfExperienceInterval = setInterval(() => {
                setYearsOfExperience(prevCount => {
                    if (prevCount < constYearsOfExperience) {
                        return prevCount + 1;
                    }
                    clearInterval(yearsOfExperienceInterval);
                    return constYearsOfExperience;
                });
            }, 600); // Adjust the interval duration
        }
    }, [isVisible]);

    return (
        <div ref={factRef} className="container-xxl bg-light py-5 my-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-4 col-md-6 text-center wow fadeIn" data-wow-delay="0.1s">
                        <img className="img-fluid mb-4" src="img/monitor.png" alt="" height="75px" width="75px"/>
                        <h1 className="display-4" data-toggle="counter-up">{projectsCompleted}+</h1>
                        <p className="fs-5 text-primary mb-0">Projects Completed</p>
                    </div>
                    <div className="col-lg-4 col-md-6 text-center wow fadeIn" data-wow-delay="0.3s">
                        <img className="img-fluid mb-4" src="img/handshake.png" alt="" height="75px" width="75px"/>
                        <h1 className="display-4" data-toggle="counter-up">{clientSatisfactionRate}%</h1>
                        <p className="fs-5 text-primary mb-0">Client Satisfaction Rate</p>
                    </div>
                    <div className="col-lg-4 col-md-6 text-center wow fadeIn" data-wow-delay="0.5s">
                        <img className="img-fluid mb-4" src="img/experience.png" alt="" height="75px" width="75px"/>
                        <h1 className="display-4" data-toggle="counter-up">{yearsOfExperience}+</h1>
                        <p className="fs-5 text-primary mb-0">Years of Experience</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fact;
