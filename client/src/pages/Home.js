import React from 'react';
import '../styles/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import heroBg from '../assets/hero-bg.jpg';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section d-flex align-items-center"
        style={{
          background: `url(${heroBg}) center center / cover no-repeat`,
        }}
      >
        <div className="container">
          <div className="row w-100">
            <div className="col-md-6 d-flex flex-column justify-content-center align-items-start text-start text-white">
              <h1 className="hero-heading">Run your business smarter with Super Biz AI</h1>
              <p className="hero-subtext">An all-in-one platform built for small businesses and freelancers to scale effortlessly.</p>
              <button className="btn start-btn mt-3">Start Free Trial</button>
            </div>
            <div className="col-md-6 modules-list">
              <div className="module-box">
                <ul className="list-unstyled text-white">
                  <li>📅 Appointment Booking</li>
                  <li>🧠 Content Generator</li>
                  <li>📈 Analytics & SEO</li>
                  <li>📋 Smart Forms</li>
                  <li>🗂️ CRM & Leads</li>
                  <li>🚀 Ad Creator</li>
                  <li>💼 Productive Space</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Banner */}
      <section className="about-banner-section py-5 text-white">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-md-6 text-start">
              <h2>Who We Are</h2>
              <p>
                Super Biz AI empowers small businesses with AI-powered tools that simplify marketing,
                automation, and operations – no tech expertise required.
              </p>
              <button className="btn btn-light mt-3">Contact for Demo</button>
            </div>
            <div className="col-md-6 text-start">
              <h4>Our Core Values</h4>
              <ul>
                <li>✨ Simplicity First</li>
                <li>💡 Innovation for Everyone</li>
                <li>💬 Honest Communication</li>
                <li>👥 Customer-Centered</li>
                <li>🔐 Data Security Always</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="pricing-section py-5 bg-white">
        <div className="container">
          <h3 className="text-start mb-4">Subscription Plans</h3>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card bg-dark text-white p-4 h-100">
                <h5>Basic</h5>
                <p>$19/month</p>
                <ul><li>Limited Features</li><li>Email Support</li></ul>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-dark text-white p-4 h-100">
                <h5>Pro</h5>
                <p>$49/month</p>
                <ul><li>All Features</li><li>Priority Support</li></ul>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-dark text-white p-4 h-100">
                <h5>Agency</h5>
                <p>$99/month</p>
                <ul><li>Multiple Users</li><li>Dedicated Manager</li></ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-5 container">
        <h3 className="text-start">Frequently Asked Questions</h3>
        <div className="accordion mt-4" id="faqAccordion">
          {[
            {
              q: 'What is Super Biz AI?',
              a: 'Super Biz AI is an all-in-one AI-powered platform designed to help small businesses manage content, clients, and marketing efficiently.',
            },
            {
              q: 'How will it help my business?',
              a: 'It saves time, automates content, manages appointments and forms, and provides real-time analytics to grow faster.',
            },
            {
              q: 'Do I need to install anything?',
              a: 'No. It’s fully cloud-based – just sign in and start using from any browser.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes! We offer a free trial to explore all tools before committing.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Absolutely. You can cancel or upgrade plans whenever you like.',
            },
          ].map((item, idx) => (
            <div className="accordion-item" key={idx}>
              <h2 className="accordion-header">
                <button className={`accordion-button ${idx !== 0 ? 'collapsed' : ''}`} data-bs-toggle="collapse" data-bs-target={`#q${idx}`}>
                  {item.q}
                </button>
              </h2>
              <div id={`q${idx}`} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} data-bs-parent="#faqAccordion">
                <div className="accordion-body">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section container py-5">
        <div className="row">
          <div className="col-md-6 text-start">
            <h4>Need Help Deciding?</h4>
            <p>Send us a message and our team will get back to you with recommendations based on your needs.</p>
            <form>
              <input type="text" className="form-control my-2" placeholder="Name" required />
              <input type="email" className="form-control my-2" placeholder="Email" required />
              <textarea className="form-control my-2" placeholder="Message" rows="4" />
              <button className="btn btn-dark mt-2">Send Message</button>
            </form>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center text-start">
            <h4>Let’s Build Something Together</h4>
            <p>Start your AI-powered business journey today. All-in-one tools. Zero coding needed.</p>
            <button className="btn btn-outline-dark mt-2">Try Free Today</button>
          </div>
        </div>
      </section>
    </div>
  );
}
