import React, { useState } from "react";
import BannerSection from "../components/BannerSection";
 import AboutSection from "../components/AboutSection";
 import USPSection from "../components/USPSection";
 import TeamAdmin from "../components/TeamAdmin";
 import Services from "../components/Services";
 import OurProjects  from "../components/OurProjects";
import Testimonial from "../components/Testimonial";
import Contact from "../components/Contact";

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("banner");

  const renderSection = () => {
    switch (selectedSection) {
      case "banner":
        return <BannerSection />;
      case "about":
         return <AboutSection />;
       case "usp":
         return <USPSection />;
       case "who":
         return <TeamAdmin />;
       case "services":
         return <Services />;
         case "projects":
         return <OurProjects />;
         case "testimonial":
         return <Testimonial />;
          case "contact":
         return <Contact />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Homepage Content Manager
      </h1>

      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="border px-4 py-2 rounded-lg mb-6"
      >
        <option value="banner">Banner</option>
        <option value="about">About Us</option>
        <option value="usp">Our USP</option>
        <option value="who">Who We Are</option>
        <option value="services">Services</option>
        <option value="projects">Our Projects</option>
        <option value="testimonial">Testimonials</option>
        <option value="contact">Contact</option>
      </select>

      {renderSection()}
    </div>
  );
};

export default Dashboard;
