import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home', // Component selector used in HTML
  standalone: true, // Allows use without being declared in a module
  imports: [CommonModule, RouterModule, NavbarComponent], // Needed modules and components
  templateUrl: './home.html', // HTML template for the home page
  styleUrl: './home.css' // CSS styles for the home page
})
export class HomeComponent implements OnInit, AfterViewInit {

  // FAQ data array, used for FAQ accordion rendering
  faqs = [
    {
      question: 'What does this platform do?',
      answer: 'It helps businesses segment customers and generate personalized marketing content using AI.'
    },
    {
      question: 'Is my uploaded data stored?',
      answer: 'Yes, uploaded data is securely stored to support ongoing improvements, retraining, and keeping the AI models up to date.'
    },
    {
      question: 'How is the generated content tailored to my customers?',
      answer: 'The platform analyzes your uploaded dataset to identify customer segments and generate content specifically optimized for each group.'
    },
    {
      question: 'What file formats can I upload?',
      answer: 'You ca only upload Excel files (.xlsx) with required columns like date, location, and loyalty tier.'
    }
  ];

  // Tracks which FAQ is open; null means all are collapsed
  activeFaq: number | null = null;

  // Tracks which section is currently active (used for highlighting nav pills)
  activeSection = '';

  /**
   * Lifecycle hook: runs when the component is initialized
   * - Initializes AOS animations
   * - Sets up scroll listener for active section tracking
   */
  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });

    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  /**
   * Scroll listener:
   * Updates `activeSection` when the viewport passes a section
   */
  onScroll() {
    const sections = ['overview', 'use-cases', 'how-it-works', 'faq', 'contact'];
    for (const id of sections) {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.activeSection = id;
          break;
        }
      }
    }
  }

  /**
   * Lifecycle hook: runs after the view is fully initialized
   * - Uses IntersectionObserver to set active state on nav links
   */
  ngAfterViewInit(): void {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.section-nav-inner a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const target = link.dataset['section'];
              if (target === id) {
                navLinks.forEach((l) => l.classList.remove('active'));
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /**
   * Toggles an FAQ item open or closed
   * @param index - Index of the clicked FAQ
   */
  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  /**
   * Smooth scroll to a specific section by ID
   * @param sectionId - The target section's ID
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
