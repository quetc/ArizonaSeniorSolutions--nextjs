"use client"

import React, { useState } from "react"
import Image from "next/image"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MessageSquare, Send } from "lucide-react"

export default function ContactPage() {
  const [formType, setFormType] = useState<'contact' | 'testimonial'>('contact')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const serviceIdContact = 'service_yu1omg9'
  const templateIdContact = 'template_q64ztcq'
  const userIdContact = 'fyejM9DucPV2ID0UG'
  const serviceIdTestimonial = 'service_yu1omg9'
  const templateIdTestimonial = 'template_aekk8md'
  const userIdTestimonial = 'fyejM9DucPV2ID0UG'

  const switchForm = () => {
    setFormType(formType === 'contact' ? 'testimonial' : 'contact')
    setSubmitMessage("")
  }

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const serviceId = formType === 'contact' ? serviceIdContact : serviceIdTestimonial
    const templateId = formType === 'contact' ? templateIdContact : templateIdTestimonial
    const userId = formType === 'contact' ? userIdContact : userIdTestimonial

    try {
      const result = await emailjs.sendForm(serviceId, templateId, e.currentTarget, userId)
      console.log('Email sent successfully:', result.text)
      setSubmitMessage('Message sent successfully!')
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitMessage('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      className="min-h-screen py-20 bg-gradient-to-b from-accent to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Get In{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to find the perfect care community for your loved one? 
            We&apos;re here to help with expert guidance and personalized service.
          </p>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-20"></div>
            <Image 
              src="/assets/contact.jpeg" 
              alt="Contact Us" 
              width={600}
              height={400}
              className="relative z-10 w-full rounded-2xl shadow-2xl object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 glass-card relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
              
              <CardHeader className="text-center relative z-10">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    formType === 'contact' ? 'gradient-primary' : 'gradient-secondary'
                  }`}>
                    {formType === 'contact' ? (
                      <Mail className="h-8 w-8 text-white" />
                    ) : (
                      <MessageSquare className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={switchForm}
                    variant="outline"
                    className="mb-4 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Switch to {formType === 'contact' ? 'Testimonial' : 'Contact'} Form
                  </Button>
                </motion.div>
                <CardTitle className="text-3xl font-display font-bold text-foreground">
                  {formType === 'contact' ? 'Contact us today!' : 'Send some love!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={sendEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-medium text-foreground">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="from_name"
                      required
                      placeholder="Your full name"
                      className="h-12 text-lg border-2 focus:border-primary transition-colors duration-300"
                    />
                  </div>

                  {formType === 'contact' && (
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-lg font-medium text-foreground">Phone</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="Your phone number"
                        className="h-12 text-lg border-2 focus:border-primary transition-colors duration-300"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-medium text-foreground">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="user_email"
                      required
                      placeholder="your.email@example.com"
                      className="h-12 text-lg border-2 focus:border-primary transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-lg font-medium text-foreground">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder={
                        formType === 'contact' 
                          ? "Tell us about your needs and how we can help..."
                          : "Share your experience with us..."
                      }
                      className="text-lg border-2 focus:border-primary transition-colors duration-300 resize-none"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {submitMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-center p-4 rounded-lg font-medium ${
                        submitMessage.includes('successfully') 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {submitMessage}
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Other Ways to Reach Us</h3>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                <motion.a
                  href="tel:602-565-6101"
                  className="flex items-center text-lg text-blue-600 hover:text-blue-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Phone className="mr-2 h-6 w-6" />
                  (602) 565-6101
                </motion.a>
                <motion.a
                  href="mailto:info@arizonaseniorsolutions.com"
                  className="flex items-center text-lg text-purple-600 hover:text-purple-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="mr-2 h-6 w-6" />
                  info@arizonaseniorsolutions.com
                </motion.a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
