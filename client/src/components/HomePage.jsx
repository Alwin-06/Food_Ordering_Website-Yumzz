import React from 'react';
import { Sparkles, Star } from 'lucide-react';

function HomePage({ onOrderNow, onAdminLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-white/10 to-transparent rounded-full"></div>
        <div className="absolute top-20 left-20 text-white/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-20 right-20 text-white/20">
          <Star className="w-6 h-6" />
        </div>
        <div className="absolute top-1/2 left-10 text-white/20">
          <Star className="w-4 h-4" />
        </div>
      </div>

      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative z-10">
        <div className="grid lg:grid-cols-2 h-full min-h-[600px]">
          {/* Left side - Food Images */}
          <div className="relative p-8 flex items-center justify-center">
            {/* Main featured dish */}
            <div className="relative">
              <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Delicious Indian Curry"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Floating food items */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Samosas"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-2xl overflow-hidden shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Biryani"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute top-1/2 -left-12 w-20 h-20 rounded-2xl overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Indian Sweets"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-orange-900 rounded-full px-4 py-2 font-bold text-sm shadow-lg animate-bounce">
                50% OFF
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center text-white relative">
            <div className="space-y-6">
              {/* Welcome badge */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                <Star className="w-4 h-4 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">Welcome to Yumzz</span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Taste Paradise &<br />
                <span className="text-yellow-300 relative">
                  Exclusive
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-300/50 rounded-full"></div>
                </span><br />
                Flavour Hunt
              </h1>
              
              {/* Description */}
              <p className="text-xl text-white/90 max-w-md leading-relaxed">
                Discover authentic flavors and experience culinary excellence with our handcrafted dishes made from the finest ingredients.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  onClick={onOrderNow}
                  className="group bg-white text-orange-500 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center"
                >
                  Order Now
                  <div className="ml-3 w-6 h-6 bg-orange-500 group-hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full transform group-hover:translate-x-0.5 transition-transform"></div>
                  </div>
                </button>
              </div>

              {/* Admin Login Link
              <div className="pt-4">
                <button 
                  onClick={onAdminLogin}
                  className="text-white/80 hover:text-white text-sm underline transition-colors"
                >
                  Admin Login
                </button>
              </div> */}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-white/80">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center justify-center">
                    4.9 <Star className="w-4 h-4 text-yellow-300 ml-1 fill-current" />
                  </div>
                  <div className="text-sm text-white/80">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">200+</div>
                  <div className="text-sm text-white/80">Dishes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;