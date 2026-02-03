import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { imageUpload } from "../../utils/imageUpload";

const Register = () => {
    const { createUser, updateUserProfile, googleSignIn, setLoading } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                const user = result.user;
                const userInfo = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    role: 'citizen'
                };
                axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
                    .then(res => {
                        navigate("/");
                        Swal.fire({
                            title: 'Success!',
                            text: 'User Signed In Successfully',
                            icon: 'success',
                            confirmButtonText: 'Cool'
                        });
                    })
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
            });
    };

    const onSubmit = async (data) => {
        let photoURL = "https://i.ibb.co/5GzXkwq/user.png"; // Default

        if (data.photo && data.photo[0]) {
            const imageData = await imageUpload(data.photo[0]);
            if (imageData.data) {
                photoURL = imageData.data.display_url;
            } else {
                Swal.fire('Error', 'Image upload failed, using default avatar', 'warning');
            }
        }

        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                updateUserProfile(data.name, photoURL)
                    .then(() => {
                        const userInfo = {
                            name: data.name,
                            email: data.email,
                            photo: photoURL,
                            role: 'citizen'
                        };
                        axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    Swal.fire({
                                        title: 'Success!',
                                        text: 'User Created Successfully',
                                        icon: 'success',
                                        confirmButtonText: 'Cool'
                                    });
                                    navigate("/");
                                }
                            })
                    })
                    .catch(error => {
                        setLoading(false);
                        console.log(error);
                    });
            })
            .catch(error => {
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Join InfraReport
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Create an account to start reporting issues.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                {...register("name", { required: true })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800"
                                placeholder="Full Name"
                            />
                            {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800"
                                placeholder="Email address"
                            />
                            {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: true,
                                    minLength: 6,
                                    pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                                })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800"
                                placeholder="Password"
                            />
                            {errors.password?.type === 'required' && <span className="text-red-500 text-sm">Password is required</span>}
                            {errors.password?.type === 'minLength' && <span className="text-red-500 text-sm">Password must be 6 characters</span>}
                            {errors.password?.type === 'pattern' && <span className="text-red-500 text-sm">Password must have uppercase, lowercase, number and special char</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo</label>
                            <input
                                type="file"
                                {...register("photo", { required: true })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {errors.photo && <span className="text-red-500 text-sm">Photo is required</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <span className="sr-only">Sign up with Google</span>
                            <svg className="w-5 h-5  mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg> Sign up with Google
                        </button>
                    </div>
                </div>

                <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover font-medium">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
