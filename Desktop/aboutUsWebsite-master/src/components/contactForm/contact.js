import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'wow.js/css/libs/animate.css';
import jQuery from 'jquery';
import 'jquery.counterup';
import WOW from 'react-wow';

const Contact = () => {
  const [contactNumber, setContactNumber] = useState('');
  const [isInvalidInput, setIsInvalidInput] = useState(false);

  const handleContactNumberChange = (e) => {
    const inputValue = e.target.value;
    // Use a regular expression to allow only numeric values
    const numericValue = inputValue.replace(/\D/g, '');
    setContactNumber(numericValue);

    // Check if the input is valid (contains only numeric characters)
    setIsInvalidInput(!/^\d*$/.test(inputValue));
  };

  const handlemailvalidation = (e) => {

    const inputValue = e.target.value;
    const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(inputValue);

  // Check if the input is valid (contains only numeric characters and is a valid email)
  setIsInvalidInput(!/^\d*$/.test(inputValue) || !isEmailValid);

  };

  const handleSubmit = () => {
    // Check if any required fields are empty
    if (!contactNumber || !document.querySelector('input[placeholder="First Name"]').value || !document.querySelector('input[placeholder="Last Name"]').value || !document.querySelector('input[placeholder="Email"]').value || !document.querySelector('textarea[placeholder="Enter Your Message....."]').value) {
      // Show a caution toast/alert if any required field is empty
      toast.warning('Please fill in all required fields before submitting.');
      return;
    }
  
    // Handle form submission only if the input is valid
    if (!isInvalidInput) {
      console.log('Contact Number:', contactNumber);
  
      // Clear form fields
      setContactNumber('');
      document.querySelector('input[placeholder="First Name"]').value = '';
      document.querySelector('input[placeholder="Last Name"]').value = '';
      document.querySelector('input[placeholder="Email"]').value = '';
      document.querySelector('textarea[placeholder="Enter Your Message....."]').value = '';
  
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)), // Simulate an asynchronous action
        {
          pending: 'Submitting...',
          success: 'Submitted! They will contact you shortly.',
          error: 'Oops! Something went wrong.',
        }
      );
    //   toast.success('Submitted! They will contact you shortly.');
    }
  };
  

  return (
    <>
      <div className="container-fluid bg-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-3 justify-content-center">
            <div className="col-md-6 text-center">
              <h3 className="mb-4">Contact Us</h3>
              <p> Welcome to InnovationWale</p>
              <div className="position-relative">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      className="form-control bg-transparent w-100 py-3 ps-4 pe-5"
                      type="text"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control bg-transparent w-100 py-3 ps-4 pe-5 "
                      type="text"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                <input
                  className="form-control bg-transparent w-100 py-3 ps-4 pe-5 mt-3"
                  type="text"
                  onChange={handlemailvalidation}
                  placeholder="Email"
                  style={{ borderColor: isInvalidInput ? 'red' : '' }}
                  required
                />
                <textarea
                  className="form-control bg-transparent w-100 py-3 ps-4 pe-5 mt-3"
                  type="text"
                  placeholder="Enter Your Message....."
                  required
                />
                <input
                  className="form-control bg-transparent w-100 py-3 ps-4 pe-5 mt-3"
                  type="tel"
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  placeholder="Contact Number"
                  style={{ borderColor: isInvalidInput ? 'red' : '' }}
                  required
                />

                {/* Send button adjusted */}
                <div className="col-md-6 mt-3">
                  <button type="button" className="btn btn-primary py-2 px-4 w-100" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      />
    </>
  );
};

export default Contact;
