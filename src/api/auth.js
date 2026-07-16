import apiClient from "./client";

export const loginUser =(email,password)=>{
    return apiClient.post('/user/login',{email,password});

};

export const registerUser=(userData,addressId)=>{
    return apiClient.post(`/user/${addressId}`,userData);
};

export const createAddress=(addressData)=>{
    return apiClient.post('/address',addressData);
};

