'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Menu as MenuIcon, X, Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Get best sellers (first 6 items for demo)
  const bestSellers = menuItems.slice(0, 6);

  // WhatsApp order link
  const whatsappLink = `https://wa.me/919162739650?text=Hello%20New%20Bombay%20Sweets!%20I%20would%20like%20to%20place%20an%20order.`;

  // Navigation component
  const Navigation = () => (
    <nav className="bg-gradient-to-r from-orange-600 to-orange-500 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8" />
            <span className="font-bold text-xl">New Bombay Sweets</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => setCurrentPage('home')} className={`hover:text-orange-200 ${currentPage === 'home' ? 'font-bold' : ''}`}>Home</button>
            <button onClick={() => setCurrentPage('about')} className={`hover:text-orange-200 ${currentPage === 'about' ? 'font-bold' : ''}`}>About</button>
            <button onClick={() => setCurrentPage('menu')} className={`hover:text-orange-200 ${currentPage === 'menu' ? 'font-bold' : ''}`}>Menu</button>
            <button onClick={() => setCurrentPage('bestsellers')} className={`hover:text-orange-200 ${currentPage === 'bestsellers' ? 'font-bold' : ''}`}>Best Sellers</button>
            <button onClick={() => setCurrentPage('gallery')} className={`hover:text-orange-200 ${currentPage === 'gallery' ? 'font-bold' : ''}`}>Gallery</button>
            <button onClick={() => setCurrentPage('contact')} className={`hover:text-orange-200 ${currentPage === 'contact' ? 'font-bold' : ''}`}>Contact</button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-orange-200">Home</button>
            <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-orange-200">About</button>
            <button onClick={() => { setCurrentPage('menu'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-orange-200">Menu</button>
            <button onClick={() => { setCurrentPage('bestsellers'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-orange-200">Best Sellers</button>
            <button onClick={() => { setCurrentPage('gallery'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-orange-200">Gallery</button>
            <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-orange-200">Contact</button>
          </div>
        )}
      </div>
    </nav>
  );

  // MenuItem Card Component
  const MenuItemCard = ({ item, isBestSeller = false }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
        {isBestSeller && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Best Seller
          </Badge>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-bold text-xl">₹{item.price}</span>
          <Badge variant="secondary">{item.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  // Home Page
  const HomePage = () => (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-orange-600 mb-4">
            New Bombay Sweets
          </h1>
          <p className="text-2xl text-gray-700 mb-8">Sweetness Served with Tradition</p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the authentic taste of India with our premium sweets, Bengali delicacies, and savory snacks.
            Made fresh daily with love and tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(whatsappLink, '_blank')}>
              <Phone className="mr-2 h-5 w-5" />
              Order on WhatsApp
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" onClick={() => setCurrentPage('menu')}>
              View Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Best Sellers Preview */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Customer Favorites</h2>
          <p className="text-gray-600">Our most loved items that keep customers coming back</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map(item => (
            <MenuItemCard key={item.id} item={item} isBestSeller={true} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button onClick={() => setCurrentPage('bestsellers')} className="bg-orange-600 hover:bg-orange-700">
            View All Best Sellers
          </Button>
        </div>
      </div>

      {/* Categories Highlight */}
      <div className="bg-orange-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Indian Sweets', 'Bengali Sweets', 'Snacks & Namkeen', 'Chaat & Dishes', 'Seasonal Specials'].map(cat => (
              <Card key={cat} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setSelectedCategory(cat); setCurrentPage('menu'); }}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">🍬</div>
                  <h3 className="font-semibold text-sm">{cat}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Festive Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 Special Festive Offers Available! 🎉</h2>
          <p className="text-xl mb-6">Celebrate every occasion with our premium sweets and savories</p>
          <Button size="lg" variant="secondary" onClick={() => window.open(whatsappLink, '_blank')}>
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-orange-600 mb-8">About Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Welcome to New Bombay Sweets, Dhanbad's trusted destination for authentic Indian sweets and savories. 
            For years, we have been serving the community with traditional recipes passed down through generations, 
            combined with modern hygiene standards and quality control.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Our journey began with a simple mission: to bring the authentic taste of Bombay's finest sweets to 
            Jharkhand. Today, we are proud to offer an extensive range of Indian sweets, Bengali delicacies, 
            fresh snacks, and mouth-watering chaat items.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className="text-gray-600">
                We use only the finest ingredients and maintain strict quality control to ensure every sweet 
                meets our high standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-bold mb-2">Fresh Daily</h3>
              <p className="text-gray-600">
                All our products are made fresh daily in our kitchen, ensuring you get the best taste and quality 
                every time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🧼</div>
              <h3 className="text-xl font-bold mb-2">Hygiene Standards</h3>
              <p className="text-gray-600">
                We follow stringent hygiene protocols in our kitchen and packaging, ensuring safe and clean 
                products for your family.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold mb-2">Traditional Recipes</h3>
              <p className="text-gray-600">
                Our expert halwais use time-tested recipes and traditional methods to create authentic flavors 
                you'll love.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Visit Us Today!</h3>
          <p className="text-gray-700 mb-6">
            Experience the taste of tradition at New Bombay Sweets, Dhanbad. We look forward to serving you!
          </p>
          <Button onClick={() => setCurrentPage('contact')} className="bg-orange-600 hover:bg-orange-700">
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );

  // Menu Page
  const MenuPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center text-orange-600 mb-4">Our Menu</h1>
      <p className="text-center text-gray-600 mb-12">Explore our wide range of sweets, snacks, and delicacies</p>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className={selectedCategory === cat ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600'}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'All Items' : cat}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600">No items found in this category.</p>
        </div>
      )}

      {/* Order CTA */}
      <div className="mt-16 bg-orange-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Order?</h3>
        <p className="text-gray-600 mb-6">Contact us on WhatsApp to place your order</p>
        <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => window.open(whatsappLink, '_blank')}>
          <Phone className="mr-2 h-5 w-5" />
          Order on WhatsApp
        </Button>
      </div>
    </div>
  );

  // Best Sellers Page
  const BestSellersPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center text-orange-600 mb-4">Best Sellers</h1>
      <p className="text-center text-gray-600 mb-12">Our customers' most loved items</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.slice(0, 9).map(item => (
          <MenuItemCard key={item.id} item={item} isBestSeller={true} />
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Customers Love Us</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div>
            <div className="text-3xl mb-2">⭐</div>
            <h4 className="font-bold mb-2">Premium Quality</h4>
            <p className="text-gray-600 text-sm">Only the finest ingredients</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🎂</div>
            <h4 className="font-bold mb-2">Fresh Daily</h4>
            <p className="text-gray-600 text-sm">Made fresh every morning</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💯</div>
            <h4 className="font-bold mb-2">Authentic Taste</h4>
            <p className="text-gray-600 text-sm">Traditional recipes</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Gallery Page
  const GalleryPage = () => {
    const galleryImages = [
      { url: 'https://via.placeholder.com/400x300?text=Fresh+Sweets', title: 'Fresh Sweets' },
      { url: 'https://via.placeholder.com/400x300?text=Bengali+Delights', title: 'Bengali Delights' },
      { url: 'https://via.placeholder.com/400x300?text=Festive+Special', title: 'Festive Special' },
      { url: 'https://via.placeholder.com/400x300?text=Snacks+Counter', title: 'Snacks Counter' },
      { url: 'https://via.placeholder.com/400x300?text=Shop+Interior', title: 'Shop Interior' },
      { url: 'https://via.placeholder.com/400x300?text=Chaat+Corner', title: 'Chaat Corner' },
      { url: 'https://via.placeholder.com/400x300?text=Gift+Boxes', title: 'Gift Boxes' },
      { url: 'https://via.placeholder.com/400x300?text=Traditional+Sweets', title: 'Traditional Sweets' },
      { url: 'https://via.placeholder.com/400x300?text=Namkeen+Variety', title: 'Namkeen Variety' },
    ];

    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center text-orange-600 mb-4">Gallery</h1>
        <p className="text-center text-gray-600 mb-12">A glimpse into our world of sweets and savories</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <img src={img.url} alt={img.title} className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300" />
              <div className="bg-white p-3 text-center">
                <p className="font-semibold text-gray-800">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Contact Page
  const ContactPage = () => (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center text-orange-600 mb-12">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div>
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Address</h3>
                    <p className="text-gray-600">City Centre Below ICICI Bank</p>
                    <p className="text-gray-600">Dhanbad, Jharkhand 826007</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <a href="tel:+919162739650" className="text-orange-600 hover:underline">
                      +91 9162739650
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Sunday</p>
                    <p className="text-gray-600">9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="lg"
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Order on WhatsApp
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('tel:+919162739650')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Google Map */}
        <div>
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.234567890123!2d86.4345678901234!3d23.7890123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzIwLjQiTiA4NsKwMjYnMDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px', borderRadius: '0.5rem' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="New Bombay Sweets Location"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-orange-50 rounded-lg p-8 text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Visit Our Store</h3>
        <p className="text-gray-600 mb-6">
          We're conveniently located in the heart of Dhanbad at City Centre, just below ICICI Bank. 
          Come visit us to experience our fresh sweets and warm hospitality!
        </p>
        <Button 
          onClick={() => window.open('https://maps.app.goo.gl/nLQdd54NXADE7YW86', '_blank')}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <MapPin className="mr-2 h-5 w-5" />
          Get Directions
        </Button>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingBag className="mr-2" />
              New Bombay Sweets
            </h3>
            <p className="text-gray-400">
              Serving authentic Indian sweets and savories with tradition and love since years.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('home')} className="block text-gray-400 hover:text-white">Home</button>
              <button onClick={() => setCurrentPage('menu')} className="block text-gray-400 hover:text-white">Menu</button>
              <button onClick={() => setCurrentPage('about')} className="block text-gray-400 hover:text-white">About Us</button>
              <button onClick={() => setCurrentPage('contact')} className="block text-gray-400 hover:text-white">Contact</button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p>City Centre Below ICICI Bank</p>
              <p>Dhanbad, Jharkhand 826007</p>
              <p>Phone: +91 9162739650</p>
              <p>Hours: 9:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 New Bombay Sweets. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ in Dhanbad</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'menu' && <MenuPage />}
        {currentPage === 'bestsellers' && <BestSellersPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer />
    </div>
  );
}