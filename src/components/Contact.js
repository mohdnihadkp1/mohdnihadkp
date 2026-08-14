"use client";

import React, { useState } from 'react';
import styles from './Contact.module.css';
import { Mail, Download, MessageCircle, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    
    // Replace this with your actual phone number (include country code without + or 00)
    // Example: For India +91 9876543210 -> 919876543210
    const phoneNumber = "910000000000"; 
    
    const text = `Hi Nihad! I'm ${formData.name}. ${formData.message}`;
    const encodedText = encodeURIComponent(text);
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className={styles.footerSection} id="contact">
      <div className={styles.container}>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h2 className={styles.title}>Let's Build<br/>Something <span className={styles.highlight}>Great.</span></h2>
            <p className={styles.subtitle}>Have an idea or a project in mind? Shoot me a message directly on WhatsApp and let's make it happen.</p>
            
            <div className={styles.socials}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialLink}>[GitHub]</a>
              <a href="https://www.linkedin.com/in/mohammed-nihad-kp-71b6b6339" target="_blank" rel="noreferrer" className={styles.socialLink}>[LinkedIn]</a>
              <a href="mailto:intobusyness@gmail.com" className={styles.socialLink}><Mail size={18} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> Email</a>
              <a href="https://x.com/mohdnihadkp" target="_blank" rel="noreferrer" className={styles.socialLink}>[X]</a>
              <a href="https://www.instagram.com/mohdnihadkp" target="_blank" rel="noreferrer" className={styles.socialLink}>[Instagram]</a>
            </div>
            
            <a 
              href="https://drive.google.com/file/d/1wzvYQdy3LTLekoCOhytPM5m0AGO0n9nr/preview" 
              target="_blank" 
              rel="noreferrer"
              className={styles.resumeBtn}
            >
              <Download size={18} /> Download Full Resume
            </a>
          </div>

          <div className={styles.formContainer}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <MessageCircle size={24} className={styles.waIcon} />
                <h3>Direct WhatsApp Message</h3>
              </div>
              <form onSubmit={handleWhatsAppSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className={styles.input} 
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..." 
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    className={styles.textarea}
                  ></textarea>
                </div>
                
                <button type="submit" className={styles.submitBtn}>
                  Send via WhatsApp <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
