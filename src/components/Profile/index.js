import { useState, useEffect } from "react";
import { Hourglass } from "react-loader-spinner";
import Cookies from "js-cookie";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Navbar from "../Navbar";
import "./index.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setUserEmail] = useState("");
  const [balance, setUserBal] = useState(0);

  const [showLoader, setLoaderStatus] = useState(false);

  const jwtToken = Cookies.get("jwt_token");

  const getUserDetails = async () => {
    setLoaderStatus(true);

    const API_URL = "https://transaction-management-app.onrender.com/user/profile";
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(API_URL, options);
    const data = await response.json();

    if (response.ok === true) {
      setLoaderStatus(false);
      setUsername(data[0].userName);
      setUserEmail(data[0].email);
      setUserBal(data[0].accountBalance);
    } else {
      setLoaderStatus(false);
      alert(data.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const balanceClass = balance < 2500 ? "account-balance red-balance" : "account-balance";

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        {showLoader ? (
          <div className="loader-container">
            <p className="loader"> <Hourglass color="#3b82f6" /> </p>
          </div>
        ) : (
          <>
            <div className="profile-details">
              <div className="bal-container"> 
                  <div className={balanceClass}>₹ {balance.toLocaleString()}</div>
              </div>
              <p>
                <strong>Username:</strong> <span>{username}</span>
              </p>
              <p>
                <strong>Email:</strong> <span>{email}</span>
              </p>
            </div>

            <div className='back-btn-container'>
              <Link to="/">
                  <button className='back-to-dashboard-btn'> Back </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
