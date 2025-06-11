
import React from 'react';
import '../styles/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section container py-5 d-flex align-items-center">
        <div className="row w-100">
          <div className="col-md-6 hero-text">
            <h1>All-in-One AI Platform for Small Businesses</h1>
            <p>Super Biz AI helps freelancers, agencies, and startups grow smarter.</p>
            <div className="d-flex gap-3">
              <button className="btn btn-primary">Start Free Trial</button>
              <button className="btn btn-outline-dark">Book a Demo</button>
            </div>
          </div>
          <div className="col-md-6 hero-image">
            <div className="image-placeholder"></div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section text-center my-5">
        <h2>About Super Biz AI</h2>
        <p>Super Biz AI is the ultimate toolkit for small businesses, freelancers, and agencies. Whether you're looking to grow, streamline, or automate — we have the solution for you.</p>
      </section>

      {/* Features Section */}
      <section className="features-section container py-5 bg-white text-dark">
        <div className="row align-items-center">
          <div className="col-md-6 feature-image">
            <div className="image-placeholder"></div>
          </div>
          <div className="col-md-6">
            <h3>Features</h3>
            <ul>
              <li>AI Content Generation</li>
              <li>Appointment Scheduling with Google Sync</li>
              <li>Smart CRM for Leads</li>
              <li>Content Engine for Brand Management</li>
              <li>Easy Dashboard and Analytics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="pricing-section py-5 bg-white text-center">
        <h3>Subscription Plans</h3>
        <div className="row justify-content-center mt-4">
          <div className="col-md-3 m-2 card bg-primary text-white p-4">
            <h5>Basic</h5>
            <p>$19/month</p>
            <ul><li>Limited Features</li><li>Email Support</li></ul>
          </div>
          <div className="col-md-3 m-2 card bg-primary text-white p-4">
            <h5>Pro</h5>
            <p>$49/month</p>
            <ul><li>All Features</li><li>Priority Support</li></ul>
          </div>
          <div className="col-md-3 m-2 card bg-primary text-white p-4">
            <h5>Agency</h5>
            <p>$99/month</p>
            <ul><li>Multiple Users</li><li>Dedicated Account Manager</li></ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-5 container">
        <h3 className="text-center">Frequently Asked Questions</h3>
        <div className="accordion mt-4" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header"><button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#q1">What is Super Biz AI?</button></h2>
            <div id="q1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
              <div className="accordion-body">Super Biz AI is an all-in-one platform for small business automation and growth.</div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#q2">Do I need to install anything?</button></h2>
            <div id="q2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body">No installation is required. Everything runs on the cloud.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking & Register Section */}
      <section className="booking-section container py-5">
        <div className="row">
          <div className="col-md-6">
            <h4>Book a Demo</h4>
            <form>
              <input type="text" className="form-control my-2" placeholder="Name" required />
              <input type="email" className="form-control my-2" placeholder="Email" required />
              <textarea className="form-control my-2" placeholder="Message" rows="4" />
              <button className="btn btn-primary mt-2">Book Now</button>
            </form>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-start">
            <h4>Ready to try Super Biz AI?</h4>
            <p>Sign up now and transform your business operations.</p>
            <button className="btn btn-success">Register Now</button>
          </div>
        </div>
      </section>
    </div>
  );
}
