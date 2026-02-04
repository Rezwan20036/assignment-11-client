import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://assignment-11-server-flax-seven.vercel.app'
});

const useAxiosSecure = () => {
    const { user, logOut } = useContext(AuthContext);

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            if (user) {
                const token = await user.getIdToken();
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        const responseInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;
