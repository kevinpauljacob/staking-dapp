"use client";

import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  rootMargin?: string;
  threshold?: number;
  root?: Element | null;
}

export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
) {
  const [activeSection, setActiveSection] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const {
      rootMargin = "-20% 0px -80% 0px",
      threshold = 0,
      root = null,
    } = options;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds, options.rootMargin, options.threshold, options.root]);

  return activeSection;
}

// Hook for smooth scrolling to sections
export function useScrollToSection() {
  const scrollToSection = (sectionId: string, offset: number = 20) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return scrollToSection;
}

// Hook for scroll within a container
export function useScrollToSectionInContainer() {
  const scrollToSection = (
    sectionId: string,
    containerId: string,
    offset: number = 20
  ) => {
    const container = document.getElementById(containerId);
    const element = document.getElementById(sectionId);

    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop =
        elementRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: relativeTop - offset,
        behavior: "smooth",
      });
    }
  };

  return scrollToSection;
}
