// Application Data
const appData = {
  metrics: [
    {"title": "Total Users", "value": "12,543", "change": "+5.2%", "icon": "👥", "trend": "up"},
    {"title": "Sales", "value": "$45,892", "change": "+12.3%", "icon": "💰", "trend": "up"},
    {"title": "Orders", "value": "1,284", "change": "-2.1%", "icon": "📦", "trend": "down"},
    {"title": "Revenue", "value": "$98,765", "change": "+8.7%", "icon": "📈", "trend": "up"}
  ],
  navigationItems: [
    {"name": "Dashboard", "icon": "🏠", "active": true},
    {"name": "Users", "icon": "👥", "active": false},
    {"name": "Analytics", "icon": "📊", "active": false},
    {"name": "Settings", "icon": "⚙️", "active": false},
    {"name": "Logout", "icon": "🚪", "active": false}
  ],
  tableData: [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "Admin", "status": "Active"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "User", "status": "Active"},
    {"id": 3, "name": "Bob Johnson", "email": "bob@example.com", "role": "Editor", "status": "Inactive"},
    {"id": 4, "name": "Alice Brown", "email": "alice@example.com", "role": "User", "status": "Active"},
    {"id": 5, "name": "Charlie Wilson", "email": "charlie@example.com", "role": "Admin", "status": "Active"}
  ],
  chartData: {
    monthlyRevenue: [45000, 52000, 48000, 61000, 55000, 67000],
    userGrowth: [1200, 1350, 1180, 1420, 1380, 1543],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  }
};

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'light';
    this.themeToggleBtn = document.getElementById('themeToggle');
    this.init();
  }

  getStoredTheme() {
    return document.documentElement.getAttribute('data-color-scheme');
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.updateThemeIcon();
  }

  setupEventListeners() {
    this.themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    this.updateThemeIcon();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    // Force a repaint to ensure theme changes are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }

  updateThemeIcon() {
    const icon = this.themeToggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
  }
}

// Sidebar Management
class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupNavigationLinks();
    this.checkMobileState();
  }

  checkMobileState() {
    // Force mobile state for smaller viewports
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.sidebarToggle.style.display = 'block';
    } else {
      this.sidebarToggle.style.display = 'none';
      this.closeSidebar();
    }
  }

  setupEventListeners() {
    this.sidebarToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleSidebar();
    });

    this.sidebarOverlay.addEventListener('click', () => {
      this.closeSidebar();
    });

    // Close sidebar on window resize if mobile breakpoint is exceeded
    window.addEventListener('resize', () => {
      this.checkMobileState();
      if (window.innerWidth > 768) {
        this.closeSidebar();
      }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          this.sidebar.classList.contains('open') && 
          !this.sidebar.contains(e.target) && 
          !this.sidebarToggle.contains(e.target)) {
        this.closeSidebar();
      }
    });
  }

  setupNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
          this.closeSidebar();
        }
      });
    });
  }

  toggleSidebar() {
    const isOpen = this.sidebar.classList.contains('open');
    if (isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.sidebar.classList.add('open');
    this.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Chart Management
class ChartManager {
  constructor() {
    this.charts = {};
    this.init();
  }

  init() {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
      this.createRevenueChart();
      this.createUserGrowthChart();
    }, 100);
  }

  createRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    this.charts.revenue = new Chart(ctx, {
      type: 'line',
      data: {
        labels: appData.chartData.months,
        datasets: [{
          label: 'Monthly Revenue ($)',
          data: appData.chartData.monthlyRevenue,
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          borderColor: '#1FB8CD',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#1FB8CD',
          pointBorderColor: '#1FB8CD',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000) + 'k';
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  createUserGrowthChart() {
    const canvas = document.getElementById('userChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    this.charts.userGrowth = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: appData.chartData.months,
        datasets: [{
          label: 'User Growth',
          data: appData.chartData.userGrowth,
          backgroundColor: '#FFC185',
          borderColor: '#FFC185',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }
}

// Dashboard Management
class DashboardManager {
  constructor() {
    this.init();
  }

  init() {
    this.addCardHoverEffects();
    this.addTableInteractivity();
  }

  addCardHoverEffects() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  addTableInteractivity() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
      row.addEventListener('click', () => {
        // Remove active class from all rows
        tableRows.forEach(r => r.classList.remove('active'));
        // Add active class to clicked row
        row.classList.add('active');
      });
    });
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  // Set initial theme to light
  document.documentElement.setAttribute('data-color-scheme', 'light');
  
  // Initialize all managers
  const themeManager = new ThemeManager();
  const sidebarManager = new SidebarManager();
  const chartManager = new ChartManager();
  const dashboardManager = new DashboardManager();

  // Add loading animation completion
  document.body.classList.add('loaded');

  // Handle window resize for responsive behavior
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Redraw charts on resize
      Object.values(chartManager.charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
          chart.resize();
        }
      });
    }, 250);
  });

  // Add smooth scrolling behavior
  document.documentElement.style.scrollBehavior = 'smooth';

  console.log('Dashboard initialized successfully');
});