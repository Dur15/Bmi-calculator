document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const form = document.getElementById('bmiForm');
  const result = document.getElementById('result');
  const tips = document.getElementById('tips');
  const unitSwitch = document.getElementById('unitSwitch');
  const heightUnit = document.getElementById('heightUnit');
  const weightUnit = document.getElementById('weightUnit');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const scaleMarker = document.querySelector('.scale-marker');

  // Toggle mobile navigation
  navToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    this.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    this.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Update unit labels
  function updateUnits() {
    if (unitSwitch.checked) {
      heightUnit.textContent = 'in';
      weightUnit.textContent = 'lbs';
      document.getElementById('height').placeholder = 'Height in inches';
      document.getElementById('weight').placeholder = 'Weight in pounds';
    } else {
      heightUnit.textContent = 'cm';
      weightUnit.textContent = 'kg';
      document.getElementById('height').placeholder = 'Height in centimeters';
      document.getElementById('weight').placeholder = 'Weight in kilograms';
    }
  }

  // Initialize units
  updateUnits();
  unitSwitch.addEventListener('change', updateUnits);

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const age = parseInt(document.getElementById('age').value);
    let height = parseFloat(document.getElementById('height').value);
    let weight = parseFloat(document.getElementById('weight').value);

    // Validate inputs
    if (!age || age < 2 || age > 120) {
      showError('Please enter a valid age between 2 and 120');
      return;
    }
    
    if (!height || height <= 0) {
      showError('Please enter a valid height greater than 0');
      return;
    }
    
    if (!weight || weight <= 0) {
      showError('Please enter a valid weight greater than 0');
      return;
    }

    // Convert units if necessary
    if (unitSwitch.checked) {
      height *= 0.0254;  // inches to meters
      weight *= 0.453592; // lbs to kg
    } else {
      height /= 100;  // cm to meters
    }

    // Calculate BMI
    const bmi = weight / (height * height);
    displayResults(bmi, age);
  });

  // Display results
  function displayResults(bmi, age) {
    let category, advice, colorClass;
    let markerPosition = 0;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Consider consulting a healthcare provider or nutritionist. Focus on nutrient-dense foods to reach a healthy weight in a sustainable way.';
      colorClass = 'underweight';
      markerPosition = 8;
    } else if (bmi < 24.9) {
      category = 'Healthy Weight';
      advice = 'Maintain your healthy weight through balanced nutrition and regular physical activity. Continue with your healthy habits!';
      colorClass = 'normal';
      markerPosition = 38;
    } else if (bmi < 29.9) {
      category = 'Overweight';
      advice = 'Consider adopting healthier eating habits and increasing physical activity. Even small changes can make a big difference over time.';
      colorClass = 'overweight';
      markerPosition = 68;
    } else {
      category = 'Obese';
      advice = 'Consult with a healthcare provider to develop a personalized weight management plan. Focus on sustainable lifestyle changes.';
      colorClass = 'obese';
      markerPosition = 92;
    }

    // Display BMI results
    result.innerHTML = `
      <div class="result-content ${colorClass}">
        <h3>Your BMI Result</h3>
        <div class="result-value">${bmi.toFixed(1)}</div>
        <div class="result-category">${category}</div>
        <div class="result-description">Body Mass Index</div>
      </div>
      <div class="result-details">
        <div class="bmi-visualization">
          <div class="scale-container">
            <div class="scale-bar">
              <div class="scale-segment underweight" data-range="<18.5"></div>
              <div class="scale-segment normal" data-range="18.5-24.9"></div>
              <div class="scale-segment overweight" data-range="25-29.9"></div>
              <div class="scale-segment obese" data-range="30+"></div>
            </div>
            <div class="scale-marker" style="left: ${markerPosition}%"></div>
            <div class="scale-labels">
              <span>Underweight</span>
              <span>Healthy</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Display health advice
    tips.innerHTML = `
      <div class="tips-content">
        <div class="tips-header">
          <i class="fas fa-lightbulb"></i>
          <h3>Health Recommendations</h3>
        </div>
        <p class="tips-text">${advice}</p>
        ${age < 18 ? '<p class="child-note"><i class="fas fa-info-circle"></i> For children and teens, BMI is interpreted using age and sex-specific percentiles.</p>' : ''}
        <div class="additional-tips">
          <h4><i class="fas fa-tips"></i> Additional Tips:</h4>
          <ul>
            <li>Regular physical activity (150+ minutes per week)</li>
            <li>Balanced diet with plenty of fruits and vegetables</li>
            <li>Adequate sleep (7-9 hours per night)</li>
            <li>Regular health check-ups</li>
          </ul>
        </div>
      </div>
    `;

    // Animate results
    result.style.animation = 'none';
    void result.offsetWidth; // Trigger reflow
    result.style.animation = 'fadeIn 0.8s ease-out';

    // Update scale marker
    updateScaleMarker(markerPosition);

    // Scroll to results
    setTimeout(() => {
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  // Show error message
  function showError(message) {
    result.innerHTML = `
      <div class="result-error">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Input Error</h3>
        <p>${message}</p>
      </div>
    `;
    tips.innerHTML = '';
    updateScaleMarker(0);
  }

  // Update scale marker position
  function updateScaleMarker(percentage) {
    if (scaleMarker) {
      scaleMarker.style.left = `${percentage}%`;
    }
  }

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add input animations
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
      this.parentElement.style.boxShadow = '0 4px 15px rgba(108, 99, 255, 0.1)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
      this.parentElement.style.boxShadow = 'none';
    });
  });

  // FAQ Accordion functionality
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqCard = question.parentElement;
      faqCard.classList.toggle('active');
      
      // Close other open FAQs
      document.querySelectorAll('.faq-card').forEach(card => {
        if (card !== faqCard && card.classList.contains('active')) {
          card.classList.remove('active');
        }
      });
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      // Simple validation
      if (!formData.name || !formData.email || !formData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Show success message
      showNotification('Thank you for your message! We will respond within 24-48 hours.', 'success');
      
      // Reset form
      contactForm.reset();
    });
  }
});

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#48BB78' : '#F56565'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add animation keyframes for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .result-error {
    text-align: center;
    padding: 30px;
    color: #F56565;
  }
  
  .result-error i {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  
  .result-error h3 {
    margin-bottom: 10px;
    color: #F56565;
  }
  
  .additional-tips {
    margin-top: 20px;
    padding: 15px;
    background: rgba(90, 103, 216, 0.05);
    border-radius: 8px;
    border-left: 3px solid var(--primary);
  }
  
  .additional-tips h4 {
    color: var(--primary);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .additional-tips ul {
    margin-left: 20px;
    color: var(--gray);
  }
  
  .additional-tips li {
    margin-bottom: 5px;
  }
  
  .child-note {
    background: rgba(248, 150, 30, 0.08);
    padding: 12px 15px;
    border-radius: 8px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: var(--dark);
    border-left: 3px solid var(--warning);
  }
`;
document.head.appendChild(style);

// Add CSS for result states
const resultStyles = document.createElement('style');
resultStyles.textContent = `
  .result-content.underweight .result-category {
    background: rgba(76, 201, 240, 0.1);
    color: #4895EF;
  }
  
  .result-content.normal .result-category {
    background: rgba(72, 149, 239, 0.1);
    color: #4361EE;
  }
  
  .result-content.overweight .result-category {
    background: rgba(248, 150, 30, 0.1);
    color: #F8961E;
  }
  
  .result-content.obese .result-category {
    background: rgba(247, 37, 133, 0.1);
    color: #F72585;
  }
  
  .scale-marker {
    position: absolute;
    top: -15px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 20px solid var(--primary);
    transform: translateX(-12px);
    transition: all 0.5s ease;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
  
  .scale-bar {
    display: flex;
    height: 24px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    margin-bottom: 10px;
    background: linear-gradient(to right, 
      #4CC9F0 0%, 
      #4CC9F0 18.5%, 
      #4895EF 18.5%, 
      #4895EF 25%, 
      #4361EE 25%, 
      #4361EE 30%, 
      #F8961E 30%, 
      #F8961E 100%);
  }
`;
document.head.appendChild(resultStyles);

// Initialize the page
window.addEventListener('load', function() {
  // Set current year in footer
  const yearElement = document.querySelector('.footer-copyright');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
  }
  
  // Add animation to hero illustration
  const illustrationImg = document.querySelector('.illustration-img');
  if (illustrationImg) {
    illustrationImg.style.animation = 'float 6s ease-in-out infinite';
  }
});

// Add to the end of script.js

// PWA - Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registered:', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}

// Offline Detection
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const status = navigator.onLine ? 'online' : 'offline';
  console.log(`Network status: ${status}`);
  
  if (!navigator.onLine) {
    showNotification('You are currently offline. Some features may not work.', 'warning');
  }
}

// Add Install Prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button (you can add this to your UI)
  setTimeout(() => {
    if (deferredPrompt) {
      showInstallPrompt();
    }
  }, 10000); // Show after 10 seconds
});

function showInstallPrompt() {
  if (deferredPrompt) {
    const installBtn = document.createElement('button');
    installBtn.className = 'hero-button';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    installBtn.style.position = 'fixed';
    installBtn.style.bottom = '20px';
    installBtn.style.right = '20px';
    installBtn.style.zIndex = '10000';
    
    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        }
        deferredPrompt = null;
        installBtn.remove();
      });
    });
    
    document.body.appendChild(installBtn);
  }
}