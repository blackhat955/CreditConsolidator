import React from 'react';

const Info = ({image,name,description,first}) => {
  return (
    <div className="container bcontent">
         <h1>About, {first}</h1>
      <hr />
      <div className="card" style={{ width: '70vw', height: 'auto', textAlign:"left", background:'#f2f8fe', alignItems:"center" }}>
        <div className="row no-gutters">
          <div className="col-sm-4 pr-0">
            <div className="position-relative">
              <img
                style={{ width: 'auto', height: '100%',
                padding:'40px',
                 objectFit: 'cover', borderRadius: '0', 
                  borderRadius:"50%" 
                  }}
                className="card-img"
                src={image}
                alt="Durgesh Image"
              />
             
              <div className="social-media-icons d-flex align-items-center " >
                {/* Add your social media icons here */}
                <i className="fab fa-facebook-square mx-2" style={{ fontSize: '24px', color: '#3b5998' ,paddingLeft:'32%',marginBottom:'5%'}}></i>
                <i className="fab fa-twitter-square mx-2" style={{ fontSize: '24px', color: '#1da1f2' ,paddingLeft:'3%',marginBottom:'5%'}}></i>
                <i className="fab fa-instagram-square mx-2" style={{ fontSize: '24px', color: '#e4405f',padding:'2%' }}></i>
                {/* Add more icons as needed */}
              </div>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="card-body text-center">
              <h5 className="card-title">{name}</h5>
              <p className="card-text ">
                {description}
              </p>
              <a href="#" className="btn btn-primary">
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
