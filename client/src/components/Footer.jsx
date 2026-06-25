import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Code2, MessageCircle, Briefcase, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const links = {
    Product: [
      { label: 'Generate Course', to: '#' },
      { label: 'My Courses', to: '/' },
      { label: 'Certificates', to: '/' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Blog', to: '/' },
      { label: 'Careers', to: '/' },
    ],
    Support: [
      { label: 'Help Center', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Text-to-Learn
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered personalized course generation. Learn anything, anytime, your way.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Code2, href: 'https://github.com', label: 'GitHub' },
                { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Briefcase, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.action ? (
                      <button
                        onClick={item.action}
                        className="text-sm text-slate-500 hover:text-slate-200 transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Text-to-Learn. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
