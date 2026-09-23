// Accessibility utilities for development
export const checkAccessibility = () => {
  if (import.meta.env.MODE === 'development') {
    // Check for images without alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
      console.warn('Image missing alt attribute:', img)
    })

    // Check for buttons without accessible names
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
      if (!btn.textContent?.trim()) {
        console.warn('Button without accessible name:', btn)
      }
    })

    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let prevLevel = 0
    headings.forEach(h => {
      const level = parseInt(h.tagName[1])
      if (level > prevLevel + 1 && prevLevel !== 0) {
        console.warn('Skipped heading level:', h)
      }
      prevLevel = level
    })

    // Check for landmarks
    const landmarks = document.querySelectorAll('main, nav, header, footer, section[role="main"], section[role="navigation"]')
    if (landmarks.length === 0) {
      console.warn('No landmark elements found')
    }
  }
}

// Focus management
export const focusTrap = (element, isActive) => {
  if (!isActive || !element) return () => {}

  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable.focus()
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)
  firstFocusable?.focus()

  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}