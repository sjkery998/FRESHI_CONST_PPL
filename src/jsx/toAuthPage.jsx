import React from "react";
import { useNavigate } from "react-router-dom";

const CheckLoginActive = (navigate) => {
    sessionStorage.setItem("lastBeforeLogin", window.location.href);
    navigate("/AuthWebPage");
  
    return null;
  };
  
  export default CheckLoginActive;