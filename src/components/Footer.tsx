"use client"

import React from "react"
import Image from "next/image"
import { Facebook, Mail, Linkedin, Phone, MapPin, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useNavigation } from "@/contexts/NavigationContext"

export default function Footer() {
  const { setCurrentPage, setIsLoading } = useNavigation()

  const handleNavigation = (page: 'privacy' | 'disclosure') => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsLoading(false)
    }, 150)
  }

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Image 
                  src="/assets/logo.png" 
                  alt="Senior Care Solutions of AZ" 
                  width={60} 
                  height={60} 
                  className="w-12 h-12 object-contain" 
                />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-foreground">Senior Care Solutions</h3>
                <p className="text-muted-foreground">of Arizona</p>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-muted-foreground leading-relaxed mb-6 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Providing compassionate senior care placement services with integrity, 
              kindness, and respect. Our 100% free service helps families find the 
              perfect care community for their loved ones.
            </motion.p>
            
            {/* Contact Info */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:602-565-6101" className="hover:text-primary transition-colors font-medium">
                  602-565-6101
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:care@senior-care-solutions.com" className="hover:text-primary transition-colors">
                  care@senior-care-solutions.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Serving the Greater Phoenix Area</span>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('privacy')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('disclosure')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Disclosure
                </button>
              </li>
            </ul>
          </motion.div>
          
          {/* Social & Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="font-semibold text-foreground mb-6">Connect With Us</h4>
            <div className="flex gap-4 mb-8">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="https://facebook.com/profile.php?id=100067831516654" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 gradient-primary text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="mailto:care@senior-care-solutions.com" 
                  className="w-10 h-10 gradient-primary text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-300"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="https://linkedin.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 gradient-primary text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </motion.div>
            </div>
            
            {/* Trust Message */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 gradient-trust rounded-xl border border-primary/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">Thank You!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trust in our services means everything to us.
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="border-t mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Senior Care Solutions of AZ. All rights reserved.
            </p>
            <Card className="glass border-white/20">
              <CardContent className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">
                    Our services are 100% FREE to families
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
