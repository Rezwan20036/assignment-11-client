import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";
import { LogIn } from "lucide-react";

const Login = () => {
    const { signIn, googleSignIn, setLoading } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        signIn(data.email, data.password)
            .then(result => {
                Swal.fire({
                    title: 'Success!',
                    text: 'User Login Successful',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid email or password',//error.message
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    };

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                // Save user to DB if needed
                Swal.fire({
                    title: 'Success!',
                    text: 'Google Sign-In Successful',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
            });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <LogIn className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800"
                                placeholder="Email address"
                            />
                            {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                {...register("password", { required: true })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800"
                                placeholder="Password"
                            />
                            {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                    fill="currentColor"
                                />
                            </svg>
                            Google
                        </button>
                    </div>
                </div>
                <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="text-primary hover:text-primary-hover font-medium">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
