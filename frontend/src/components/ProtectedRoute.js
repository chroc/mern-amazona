import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";

const ProtectedRoute = ({ children }) => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    return userInfo ? children : <Navigate to={'/signin'} />
};

export default ProtectedRoute;