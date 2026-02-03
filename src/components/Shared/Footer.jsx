import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
                            <span className="text-xl font-bold text-gray-800 dark:text-white"><span className="text-green-700">Infra</span>Report</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Empowering citizens to report public infrastructure issues effectively. Together we build a better, cleaner, and safer city.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">Home</Link></li>
                            <li><Link to="/all-issues" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">All Issues</Link></li>
                            <li><Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">Features</Link></li>
                            <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link to="/cookie" className="text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-green-600 mt-1" />
                                <span className="text-gray-600 dark:text-gray-400 text-sm">123 City Hall Avenue,<br />Dhaka 1212, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-green-600" />
                                <span className="text-gray-600 dark:text-gray-400 text-sm">+880 1234 567890</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-green-600" />
                                <span className="text-gray-600 dark:text-gray-400 text-sm">infrareport@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} InfraReport. All rights reserved. | Design & Developed by <span className="text-green-600 font-bold">Razwen</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
