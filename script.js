// script.js - Consolidated and corrected version
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements for BMI Calculator
  const bmiForm = document.getElementById('bmiForm');
  const bmiResult = document.getElementById('result');
  const resultVisualization = document.getElementById('resultVisualization');
  const tips = document.getElementById('tips');
  const unitSwitch = document.getElementById('unitSwitch');
  const heightUnit = document.getElementById('heightUnit');
  const weightUnit = document.getElementById('weightUnit');
  const scaleMarker = document.getElementById('scaleMarker');
  
  // Navigation elements
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // ==================== SET ACTIVE NAVIGATION ====================
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage || 
          (currentPage === 'index.html' && linkHref === 'index.html') ||
          (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  setActiveNav();

  // ==================== NAVIGATION ====================
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.setAttribute('aria-expanded', navLinks.classList.contains('active'));
      this.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (navToggle) {
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  }

  // ==================== BMI CALCULATOR ====================
  if (unitSwitch && heightUnit && weightUnit) {
    function updateUnits() {
      if (unitSwitch.checked) {
        heightUnit.textContent = 'in';
        weightUnit.textContent = 'lbs';
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        if (heightInput) heightInput.placeholder = 'Height in inches';
        if (weightInput) weightInput.placeholder = 'Weight in pounds';
      } else {
        heightUnit.textContent = 'cm';
        weightUnit.textContent = 'kg';
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        if (heightInput) heightInput.placeholder = 'Height in centimeters';
        if (weightInput) weightInput.placeholder = 'Weight in kilograms';
      }
    }
    updateUnits();
    unitSwitch.addEventListener('change', updateUnits);
  }

  if (bmiForm) {
    bmiForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const age = parseInt(document.getElementById('age')?.value);
      let height = parseFloat(document.getElementById('height')?.value);
      let weight = parseFloat(document.getElementById('weight')?.value);

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

      if (unitSwitch && unitSwitch.checked) {
        height *= 2.54;  // inches to cm
        weight *= 0.453592; // lbs to kg
      }
      
      height = height / 100; // cm to meters
      const bmi = weight / (height * height);
      displayBMIResults(bmi, age);
    });
  }

  function displayBMIResults(bmi, age) {
    let category, advice, colorClass;
    let markerPosition = 0;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Consider consulting a healthcare provider or nutritionist. Focus on nutrient-dense foods to reach a healthy weight in a sustainable way.';
      colorClass = 'underweight';
      markerPosition = 10; // 10% of the scale
    } else if (bmi < 25) {
      category = 'Healthy Weight';
      advice = 'Maintain your healthy weight through balanced nutrition and regular physical activity. Continue with your healthy habits!';
      colorClass = 'normal';
      markerPosition = 35; // 35% of the scale
    } else if (bmi < 30) {
      category = 'Overweight';
      advice = 'Consider adopting healthier eating habits and increasing physical activity. Even small changes can make a big difference over time.';
      colorClass = 'overweight';
      markerPosition = 65; // 65% of the scale
    } else {
      category = 'Obese';
      advice = 'Consult with a healthcare provider to develop a personalized weight management plan. Focus on sustainable lifestyle changes.';
      colorClass = 'obese';
      markerPosition = 90; // 90% of the scale
    }

    // Show visualization, hide placeholder
    if (bmiResult && resultVisualization) {
      bmiResult.style.display = 'none';
      resultVisualization.style.display = 'block';
    }

    // Update scale marker
    if (scaleMarker) {
      scaleMarker.style.left = markerPosition + '%';
    }

    // Update result display
    if (bmiResult) {
      bmiResult.innerHTML = `
        <div class="result-content ${colorClass}">
          <h3>Your BMI Result</h3>
          <div class="result-value">${bmi.toFixed(1)}</div>
          <div class="result-category">${category}</div>
          <div class="result-description">Body Mass Index</div>
        </div>
      `;
      bmiResult.style.display = 'block';
    }

    if (tips) {
      tips.innerHTML = `
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
      `;
    }

    // Scroll to results
    setTimeout(() => {
      const resultCard = document.getElementById('resultCard');
      if (resultCard) {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }

  function showError(message) {
    if (bmiResult && resultVisualization) {
      bmiResult.style.display = 'flex';
      resultVisualization.style.display = 'none';
      
      bmiResult.innerHTML = `
        <div class="result-error">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Input Error</h3>
          <p>${message}</p>
        </div>
      `;
    }
    if (scaleMarker) {
      scaleMarker.style.left = '0%';
    }
  }

  // ==================== SMOOTH SCROLLING ====================
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

  // ==================== INPUT ANIMATIONS ====================
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'scale(1.02)';
      this.style.boxShadow = '0 4px 15px rgba(108, 99, 255, 0.1)';
    });
    
    input.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // ==================== FAQ ACCORDION ====================
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqCard = question.parentElement;
      faqCard.classList.toggle('active');
      
      document.querySelectorAll('.faq-card').forEach(card => {
        if (card !== faqCard && card.classList.contains('active')) {
          card.classList.remove('active');
        }
      });
    });
  });

  // ==================== NOTIFICATION SYSTEM ====================
  window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  };

  // ==================== PWA & OFFLINE ====================
  // Update copyright year
  const yearElement = document.querySelector('.footer-copyright');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
  }
  
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
    });
  }

  // Offline Detection
  window.addEventListener('online', () => showNotification('You are back online!', 'success'));
  window.addEventListener('offline', () => showNotification('You are offline. Some features may not work.', 'warning'));
});

// Add CSS for additional styles
(function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .result-content {
      width: 100%;
      text-align: center;
      padding: 25px;
      border-radius: 20px;
      background: var(--light);
      margin-bottom: 25px;
    }
    
    .result-value {
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.2;
    }
    
    .result-category {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 10px 0;
      padding: 8px 24px;
      border-radius: 30px;
      display: inline-block;
    }
    
    .scale-container {
      position: relative;
      padding: 20px 0 30px;
    }
    
    .scale-bar {
      display: flex;
      height: 24px;
      border-radius: 30px;
      overflow: hidden;
      background: linear-gradient(90deg, 
        #4CC9F0 0%, 
        #4CC9F0 18.5%, 
        #4895EF 18.5%, 
        #4895EF 25%, 
        #4361EE 25%, 
        #4361EE 30%, 
        #F8961E 30%, 
        #F8961E 100%);
    }
    
    .scale-segment {
      flex: 1;
    }
    
    .scale-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 0.8rem;
      color: var(--gray);
    }
    
    .scale-marker {
      position: absolute;
      top: 0;
      width: 4px;
      height: 40px;
      background: var(--dark);
      transform: translateX(-2px);
      transition: left 0.5s ease;
      border-radius: 2px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      color: var(--dark);
      padding: 15px 25px;
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 9999;
      animation: slideInRight 0.3s ease;
      border-left: 4px solid var(--success);
    }
    
    .notification.warning { border-left-color: var(--warning); }
    .notification.error { border-left-color: var(--danger); }
    
    .additional-tips {
      margin-top: 20px;
      padding: 15px;
      background: var(--light);
      border-radius: 12px;
    }
    
    .child-note {
      background: rgba(248, 150, 30, 0.1);
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      border-left: 3px solid var(--warning);
    }
    
    .underweight .result-category { 
      background: rgba(76, 201, 240, 0.1); 
      color: #4CC9F0; 
    }
    .normal .result-category { 
      background: rgba(72, 149, 239, 0.1); 
      color: #4895EF; 
    }
    .overweight .result-category { 
      background: rgba(248, 150, 30, 0.1); 
      color: #F8961E; 
    }
    .obese .result-category { 
      background: rgba(247, 37, 133, 0.1); 
      color: #F72585; 
    }
  `;
  document.head.appendChild(style);
})();
