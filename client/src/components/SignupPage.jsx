import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, User, Building } from 'lucide-react';
import { register } from '../api/authApi'; // Import the register function

function SignupPage({ onBack, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', // Frontend field for user's name
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User' // Default role for frontend selection
  });
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState(null);     // New state for errors
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => { // Make handleSubmit async
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null);   // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Client-side validation for passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Call the register API function
      // The authApi.js will map 'fullName' to 'name' and 'Restaurant Owner' to 'restaurant'
      const response = await register(formData);
      console.log('Registration successful:', response);
      setSuccessMessage(response.message || 'Registration successful! Please log in.');

      // After successful registration, redirect to login page
      // Use a small delay for the user to see the success message
      setTimeout(() => {
        if (onLogin) {
          onLogin(); // Navigate to LoginPage
        }
      }, 1500); // Redirect after 1.5 seconds

    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'An unexpected error occurred during registration.'); // Display error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200/30 rounded-full"></div>
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-red-200/30 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-300/30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-red-200/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-yellow-200/30 rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-orange-300/40 rounded-full"></div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 group"
        disabled={loading} // Disable back button during loading
      >
        <ArrowLeft className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
      </button>

      <div className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10">
        <div className="grid lg:grid-cols-2 h-full min-h-[700px]">
          {/* Left side - Food Images and Content */}
          <div className="relative p-8 lg:p-12 bg-gradient-to-br from-orange-400 to-red-500 flex flex-col justify-center">
            {/* Floating food images */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Salad */}
              <div className="absolute top-8 left-8 w-28 h-28 rounded-2xl overflow-hidden shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Fresh Salad"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* French Fries */}
              <div className="absolute top-1/4 right-8 w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="French Fries"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Pizza */}
              <div className="absolute bottom-1/3 left-12 w-32 h-32 rounded-2xl overflow-hidden shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Delicious Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Avocado */}
              <div className="absolute bottom-8 right-12 w-20 h-20 rounded-2xl overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Fresh Avocado"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Grilled Sandwich */}
              <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Grilled Sandwich"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Small decorative dots */}
              <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/30 rounded-full"></div>
              <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/35 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-white">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Join our food<br />
                <span className="text-yellow-300">community</span>
              </h1>
              <p className="text-white/90 text-lg leading-relaxed max-w-sm">
                Create your account and start your culinary journey with us. Discover amazing flavors and connect with food lovers.
              </p>
            </div>
          </div>

          {/* Right side - Signup Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
                <p className="text-gray-600">Create your account to get started</p>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* Success Message Display */}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Input */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your full name"
                    required
                    disabled={loading} // Disable during loading
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your email"
                    required
                    disabled={loading} // Disable during loading
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: 'User'})}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        formData.role === 'User' 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-orange-300'
                      }`}
                      disabled={loading} // Disable during loading
                    >
                      <User className="w-6 h-6" />
                      <span className="text-sm font-medium">User</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: 'Restaurant Owner'})}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        formData.role === 'Restaurant Owner' 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-orange-300'
                      }`}
                      disabled={loading} // Disable during loading
                    >
                      <Building className="w-6 h-6" />
                      <span className="text-sm font-medium">Restaurant Owner</span>
                    </button>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Create a password"
                      required
                      disabled={loading} // Disable during loading
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading} // Disable during loading
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Confirm your password"
                      required
                      disabled={loading} // Disable during loading
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading} // Disable during loading
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <div className="pt-8">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    disabled={loading} // Disable button when loading
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={onLogin}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                      disabled={loading} // Disable button when loading
                    >
                      Login
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
