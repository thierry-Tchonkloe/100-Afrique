// src/components/contact/ContactFormSection.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import ContactForm from './form/ContactForm';
import ContactCoordinatesCard from './form/ContactCoordinatesCard';
import ContactHoursCard from './form/ContactHoursCard';
import ContactLegalCard from './form/ContactLegalCard';

const ContactFormSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          <ContactForm />

          <div
            className="flex flex-col gap-6"
            style={{
              transition: 'opacity 0.7s 0.25s, transform 0.7s 0.25s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <ContactCoordinatesCard />
            <ContactHoursCard />
            <ContactLegalCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;