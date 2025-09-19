import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone, Utensils, Eye, Zap, Star, Users, ArrowRight, Play, Check, Globe, Sparkles } from 'lucide-react';
import TestimonialCarousel from './TestimonialCarousel';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  rating: number;
  cuisine: string;
}

const featuredRestaurants: Restaurant[] = [
  {
    id: 'bella-italia',
    name: 'Bella Italia',
    description: 'Authentic Italian cuisine with imported ingredients',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=100&h=100&fit=crop&crop=center',
    primaryColor: '#C41E3A',
    accentColor: '#228B23',
    rating: 4.8,
    cuisine: 'Italian'
  },
  {
    id: 'the-spice-garden',
    name: 'The Spice Garden',
    description: 'Aromatic Indian flavors and traditional recipes',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop&crop=center',
    primaryColor: '#FF6B35',
    accentColor: '#F7931E',
    rating: 4.7,
    cuisine: 'Indian'
  },
  {
    id: 'asian-fusion',
    name: 'Asian Fusion',
    description: 'Modern Asian cuisine with creative presentations',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop&crop=center',
    primaryColor: '#1F2937',
    accentColor: '#EF4444',
    rating: 4.9,
    cuisine: 'Asian'
  }
];

const stats = [
  { number: '10,000+', label: 'Happy Customers', icon: Users },
  { number: '500+', label: 'Partner Restaurants', icon: Utensils },
  { number: '1M+', label: 'AR Views', icon: Eye },
  { number: '99.9%', label: 'Uptime', icon: Zap }
];

const features = [
  {
    icon: Smartphone,
    title: 'Mobile-First Experience',
    description: 'Optimized for all devices with seamless mobile interaction'
  },
  {
    icon: Eye,
    title: 'Augmented Reality',
    description: 'See your food in 3D before ordering with cutting-edge AR technology'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant loading and smooth interactions powered by modern web tech'
  },
  {
    icon: Globe,
    title: 'Multi-Restaurant',
    description: 'Support for unlimited restaurants with unique branding'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Food Blogger',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b2e6b5da?w=60&h=60&fit=crop&crop=face',
    content: 'MejaAR has revolutionized how I experience restaurant menus. The AR feature is incredible!'
  },
  {
    name: 'Marco Rodriguez',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    content: 'Our customers love seeing dishes in 3D. Orders increased 40% since using MejaAR!'
  },
  {
    name: 'Lisa Chen',
    role: 'Tech Enthusiast',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
    content: 'The future of dining is here. MejaAR makes every meal feel like an adventure!'
  }
];

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                MejaAR
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-orange-600 transition-colors">Features</a>
              <a href="#restaurants" className="text-neutral-600 hover:text-orange-600 transition-colors">Restaurants</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-orange-600 transition-colors">Reviews</a>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-28 pb-20 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5"></div>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 sm:mb-8 leading-tight">
              Experience Food in
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block mt-2">
                Augmented Reality
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your dining experience with interactive 3D menus. See, explore, and order food like never before with MejaAR's cutting-edge technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
              <Link 
                to="/bella-italia"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Try Demo Restaurant</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="w-full sm:w-auto border-2 border-neutral-300 text-neutral-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-orange-500 hover:text-orange-600 transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Hero Image */}
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop&crop=center"
                  alt="MejaAR Demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
                    <Eye className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="font-semibold text-neutral-900">AR Menu Active</p>
                      <p className="text-sm text-neutral-600">Viewing Gourmet Burger in 3D</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-gradient-to-br from-neutral-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose MejaAR?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
              We're revolutionizing the restaurant industry with innovative technology that enhances every aspect of the dining experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section id="restaurants" className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Featured Restaurants
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover amazing restaurants using MejaAR technology. Each with their unique AR menu experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant, index) => (
              <Link 
                key={index}
                to={`/${restaurant.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{restaurant.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <img 
                      src={restaurant.logo} 
                      alt={`${restaurant.name} logo`}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-white/50"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-neutral-900">{restaurant.name}</h3>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: restaurant.primaryColor }}
                    >
                      {restaurant.cuisine}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4 leading-relaxed">{restaurant.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Try AR Menu</span>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View All Restaurants
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-32 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              What People Say
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers and restaurant owners who've transformed their dining experience.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-12 max-w-3xl mx-auto">
            Join the AR revolution and give your customers an unforgettable dining experience. Get started with MejaAR today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button className="w-full sm:w-auto bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300">
              Contact Sales
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-orange-100">
              <Check className="w-5 h-5" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-orange-100">
              <Check className="w-5 h-5" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-orange-100">
              <Check className="w-5 h-5" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">MejaAR</span>
              </div>
              <p className="text-lg text-neutral-400 mb-6 max-w-md">
                Revolutionizing the restaurant industry with augmented reality technology. Experience food like never before.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © 2025 MejaAR. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-neutral-400 hover:text-orange-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-orange-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-orange-400 transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
