import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { login } from '../api/authApi';

function LoginPage({ onBack, onSignup, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      console.log('Login successful:', response);

      if (onLogin) {
        onLogin(response); 
      }

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200/30 rounded-full"></div>
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-red-200/30 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-300/30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-red-200/30 rounded-full"></div>
      </div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
      </button>

      <div className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10">
        <div className="grid lg:grid-cols-2 h-full min-h-[600px]">
          <div className="relative p-8 lg:p-12 bg-gradient-to-br from-orange-400 to-red-500 flex flex-col justify-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 left-8 w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Delicious Burger"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute top-1/3 right-8 w-20 h-20 rounded-2xl overflow-hidden shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Pizza Slice"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute bottom-1/4 left-12 w-28 h-28 rounded-2xl overflow-hidden shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Sandwich"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Donut"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/30 rounded-full"></div>
              <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-white/20 rounded-full"></div>
            </div>

            <div className="relative z-10 text-white">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Better food for<br />
                <span className="text-yellow-300">more people</span>
              </h1>
              <p className="text-white/90 text-lg leading-relaxed max-w-sm">
                We are committed to bringing you the best food experience with quality ingredients and exceptional service.
              </p>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                <p className="text-gray-600">Welcome back! Please sign in to your account</p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  />
                </div>

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
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={onSignup}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                      disabled={loading}
                    >
                      Sign up
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

export default LoginPage;