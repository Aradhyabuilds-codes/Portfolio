// Aura Analytics - Dashboard JavaScript Engine
// Integrates live Supabase data with interactive local simulations and portfolios.

// Supabase API Credentials
const SUPABASE_URL = "https://lqpugleisrgkghldzvgq.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcHVnbGVpc3Jna2dobDR6dmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDQxMjgsImV4cCI6MjEwMTU4MDEyOH0.vRGholAF7sf21nVyNOm6ZEnp_m2o0YoiYHLdeU3I2O8";

// Application State
const state = {
  activeTab: "dashboard",
  
  // Date Filters
  dateFilterType: "all", // "all", "jan", "feb", "mar", "custom"
  startDate: "2026-01-01",
  endDate: "2026-03-23", // default end date matching march baseline

  representativeTarget: 30000,
  
  // Supabase Raw baseline data
  supabaseRaw: null,
  
  // Generated base transactions (ground truth)
  baseTransactions: null,
  
  // Local simulated transactions
  simulatedSales: [],
  
  // Representative Profiles
  reps: {
    "Nidhi": {
      name: "Nidhi",
      role: "Enterprise Accounts Lead",
      bio: "Nidhi specializes in high-value enterprise software acquisitions. With over 8 years of experience in business development, she manages our Fortune 500 client portfolio.",
      email: "nidhi.sharma@apexanalytics.co",
      phone: "+1 (555) 304-9821",
      avatarTheme: "indigo-theme",
      focus: "SaaS / Cloud Enterprise"
    },
    "Sanika": {
      name: "Sanika",
      role: "Senior Account Director",
      bio: "Sanika drives business expansion in cloud consulting and infrastructure integration services. She has a strong technical background and excels at custom SLA negotiations.",
      email: "sanika.patil@apexanalytics.co",
      phone: "+1 (555) 718-2938",
      avatarTheme: "violet-theme",
      focus: "Infrastructure & SLA"
    },
    "Karishma": {
      name: "Karishma",
      role: "Strategic Accounts Manager",
      bio: "Karishma focuses on mid-market growth and software integrations. She is known for exceptional client relationship management and creating high customer lifetime value.",
      email: "karishma.nair@apexanalytics.co",
      phone: "+1 (555) 289-4731",
      avatarTheme: "teal-theme",
      focus: "Integrations & SaaS"
    },
    "Faizan": {
      name: "Faizan",
      role: "Business Development Representative",
      bio: "Faizan handles inbound business inquiries and strategic outreach. He is quick at closing mid-tier subscriptions and consistently delivers high transaction volumes.",
      email: "faizan.khan@apexanalytics.co",
      phone: "+1 (555) 492-8310",
      avatarTheme: "indigo-theme",
      focus: "Mid-Tier Subscriptions"
    },
    "Prabhat": {
      name: "Prabhat",
      role: "Client Success & Accounts Executive",
      bio: "Prabhat bridges client success with account upsells. He works closely with customer engineering teams to facilitate smooth software deployments and hardware upgrades.",
      email: "prabhat.kumar@apexanalytics.co",
      phone: "+1 (555) 830-1928",
      avatarTheme: "violet-theme",
      focus: "Deployments & Upgrades"
    }
  },
  
  // Custom Portfolio Base (Loyalty and contact information)
  customers: [
    { id: "cust-1", company: "Acme Corporation", contact: "John Doe", email: "j.doe@acme.com", phone: "+1 (555) 123-4567", website: "acme.com", tier: "Platinum", rep: "Nidhi" },
    { id: "cust-2", company: "Globex Corporation", contact: "Alice Smith", email: "sales@globex.com", phone: "+1 (555) 987-6543", website: "globex.co", tier: "Gold", rep: "Sanika" },
    { id: "cust-3", company: "Initech Systems", contact: "Peter Gibbons", email: "peter@initech.net", phone: "+1 (555) 246-8135", website: "initech.net", tier: "Silver", rep: "Karishma" },
    { id: "cust-4", company: "Umbrella Corp", contact: "Albert Wesker", email: "a.wesker@umbrella.org", phone: "+1 (555) 369-2580", website: "umbrella.org", tier: "Bronze", rep: "Faizan" },
    { id: "cust-5", company: "Stark Industries", contact: "Pepper Potts", email: "p.potts@stark.com", phone: "+1 (555) 111-2222", website: "starkindustries.com", tier: "Platinum", rep: "Prabhat" },
    { id: "cust-6", company: "Wayne Enterprises", contact: "Lucius Fox", email: "l.fox@wayne.corp", phone: "+1 (555) 333-4444", website: "waynecorp.com", tier: "Platinum", rep: "Nidhi" },
    { id: "cust-7", company: "Cyberdyne Systems", contact: "Sarah Connor", email: "s.connor@cyberdyne.io", phone: "+1 (555) 555-6666", website: "cyberdyne.io", tier: "Gold", rep: "Sanika" },
    { id: "cust-8", company: "Hooli Corp", contact: "Gavin Belson", email: "gavin@hooli.xyz", phone: "+1 (555) 777-8888", website: "hooli.xyz", tier: "Gold", rep: "Karishma" },
    { id: "cust-9", company: "Soylent Corp", contact: "Robert Thorn", email: "r.thorn@soylent.net", phone: "+1 (555) 999-0000", website: "soylentgreen.com", tier: "Silver", rep: "Faizan" },
    { id: "cust-10", company: "Oscorp Industries", contact: "Harry Osborn", email: "h.osborn@oscorp.org", phone: "+1 (555) 121-2323", website: "oscorp.org", tier: "Bronze", rep: "Prabhat" }
  ]
};

// Global Chart Instances
let trendChartInstance = null;
let productChartInstance = null;
let monthlyBarChart = null;
let compareTrendChart = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load settings & local sales from Cache
  loadLocalCache();
  
  // Setup sidebar navigations
  setupSidebarNav();

  // Setup date range selectors listeners
  setupDateFilterListeners();

  // Setup standard event listeners
  setupEventListeners();
  
  // Seed initial simulated sales in local storage if empty
  seedInitialSimulatedSales();
  
  // Fetch initial baseline data from Supabase (for March 2026)
  fetchDashboardData("2026-03-23");
});

/**
 * Load settings and local sales from localStorage
 */
function loadLocalCache() {
  const cachedSales = localStorage.getItem("apex_simulated_sales");
  if (cachedSales) {
    state.simulatedSales = JSON.parse(cachedSales);
  }
  
  const cachedTarget = localStorage.getItem("apex_rep_target");
  if (cachedTarget) {
    state.representativeTarget = parseFloat(cachedTarget);
    const targetInput = document.getElementById("settings-rep-target");
    if (targetInput) targetInput.value = state.representativeTarget;
  }
}

/**
 * Save simulated transactions to localStorage
 */
function saveSimulatedSales() {
  localStorage.setItem("apex_simulated_sales", JSON.stringify(state.simulatedSales));
}

/**
 * Switch Active View tabs in sidebar
 */
function setupSidebarNav() {
  const sidebarItems = document.querySelectorAll(".sidebar-nav li.nav-item");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");

  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      const tabName = item.getAttribute("data-tab");
      if (!tabName) return;

      // Update active nav class
      sidebarItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      // Update active tab panel
      tabPanels.forEach(panel => {
        panel.classList.remove("active");
      });
      document.getElementById(`tab-${tabName}`).classList.add("active");
      
      // Update state
      state.activeTab = tabName;

      // Set header titles based on page
      if (tabName === "dashboard") {
        pageTitle.innerText = "Aura Analytics";
        pageSubtitle.innerText = "Real-time Sales Performance & Revenue Leaderboard";
      } else if (tabName === "analytics") {
        pageTitle.innerText = "Analytics & Performance";
        pageSubtitle.innerText = "Representative comparisons and trend analysis";
        renderAnalyticsView();
      } else if (tabName === "sales-reps") {
        pageTitle.innerText = "Representatives Ledger";
        pageSubtitle.innerText = "Direct insight into agent stats and target completions";
        renderRepresentativesView();
      } else if (tabName === "customers") {
        pageTitle.innerText = "Customer Accounts Portfolio";
        pageSubtitle.innerText = "Detailed transactional history and account relationships";
        renderCustomersView();
      } else if (tabName === "settings") {
        pageTitle.innerText = "System Preferences";
        pageSubtitle.innerText = "Manage dashboard thresholds and simulation records";
      }
      
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}

/**
 * Attach UI event listeners
 */
function setupEventListeners() {
  // Modal: Open Simulate Sale Form
  const openSimBtn = document.getElementById("open-simulate-modal-btn");
  const simOverlay = document.getElementById("modal-simulate");
  if (openSimBtn) {
    openSimBtn.addEventListener("click", () => {
      populateSimulateFormDropdowns();
      // Default form date to selected end date
      document.getElementById("sim-date").value = state.endDate;
      simOverlay.classList.add("active");
    });
  }

  // Modal: Close buttons
  const closeSimBtn = document.getElementById("close-simulate-modal-btn");
  const cancelSimBtn = document.getElementById("cancel-simulate-modal-btn");
  const closeRepBtn = document.getElementById("close-rep-modal-btn");
  const closeCustBtn = document.getElementById("close-customer-modal-btn");

  if (closeSimBtn) closeSimBtn.addEventListener("click", () => simOverlay.classList.remove("active"));
  if (cancelSimBtn) cancelSimBtn.addEventListener("click", () => simOverlay.classList.remove("active"));
  if (closeRepBtn) closeRepBtn.addEventListener("click", () => document.getElementById("modal-rep-detail").classList.remove("active"));
  if (closeCustBtn) closeCustBtn.addEventListener("click", () => document.getElementById("modal-customer-detail").classList.remove("active"));

  // Form Submit: Simulate sale
  const simForm = document.getElementById("simulate-sale-form");
  if (simForm) {
    simForm.addEventListener("submit", (e) => {
      e.preventDefault();
      recordSimulatedSale();
    });
  }

  // Filters: Representatives search and tier selectors
  const searchReps = document.getElementById("search-reps");
  const filterRepTier = document.getElementById("filter-rep-tier");
  if (searchReps) searchReps.addEventListener("input", renderRepresentativesView);
  if (filterRepTier) filterRepTier.addEventListener("change", renderRepresentativesView);

  // Filters: Customers search, tier, and rep selectors
  const searchCustomers = document.getElementById("search-customers");
  const filterCustomerTier = document.getElementById("filter-customer-tier");
  const filterCustomerRep = document.getElementById("filter-customer-rep");
  if (searchCustomers) searchCustomers.addEventListener("input", renderCustomersView);
  if (filterCustomerTier) filterCustomerTier.addEventListener("change", renderCustomersView);
  if (filterCustomerRep) filterCustomerRep.addEventListener("change", renderCustomersView);

  // Comparison Selectors
  const compRepA = document.getElementById("compare-rep-a");
  const compRepB = document.getElementById("compare-rep-b");
  if (compRepA) compRepA.addEventListener("change", updateRepComparisonData);
  if (compRepB) compRepB.addEventListener("change", updateRepComparisonData);

  // Representative Modal Tab Toggles
  const btnRepTabCust = document.getElementById("btn-rep-tab-customers");
  const btnRepTabTx = document.getElementById("btn-rep-tab-transactions");
  
  if (btnRepTabCust) {
    btnRepTabCust.addEventListener("click", () => {
      btnRepTabCust.classList.add("active");
      if (btnRepTabTx) btnRepTabTx.classList.remove("active");
      document.getElementById("rep-tab-content-customers").classList.add("active");
      document.getElementById("rep-tab-content-transactions").classList.remove("active");
    });
  }

  if (btnRepTabTx) {
    btnRepTabTx.addEventListener("click", () => {
      if (btnRepTabCust) btnRepTabCust.classList.remove("active");
      btnRepTabTx.classList.add("active");
      document.getElementById("rep-tab-content-customers").classList.remove("active");
      document.getElementById("rep-tab-content-transactions").classList.add("active");
    });
  }

  // Settings: Save target
  const btnSaveSettings = document.getElementById("btn-save-settings");
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener("click", () => {
      const val = parseFloat(document.getElementById("settings-rep-target").value);
      if (!isNaN(val) && val > 0) {
        state.representativeTarget = val;
        localStorage.setItem("apex_rep_target", val);
        showToast("System thresholds saved successfully.", "success");
        aggregateAndRenderAll();
      } else {
        showToast("Please enter a valid target amount.", "error");
      }
    });
  }

  // Settings: Clear local simulated transactions
  const btnClearSim = document.getElementById("btn-clear-simulated");
  if (btnClearSim) {
    btnClearSim.addEventListener("click", () => {
      state.simulatedSales = [];
      localStorage.removeItem("apex_simulated_sales");
      showToast("Simulated transactions cache purged.", "success");
      aggregateAndRenderAll();
    });
  }

  // Settings: Seed sample data
  const btnSeedData = document.getElementById("btn-seed-data");
  if (btnSeedData) {
    btnSeedData.addEventListener("click", () => {
      seedSampleTransactions();
      showToast("Simulated database seeded with sample logs.", "success");
      aggregateAndRenderAll();
    });
  }

  // Live Transaction Search Listener
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filteredTx = getTransactionsInRange(state.startDate, state.endDate);
      renderTransactionHistory(filteredTx);
    });
  }
}

/**
 * Setup listeners for presets and custom date input range changes
 */
function setupDateFilterListeners() {
  const presetAll = document.getElementById("filter-all");
  const presetJan = document.getElementById("filter-jan");
  const presetFeb = document.getElementById("filter-feb");
  const presetMar = document.getElementById("filter-mar");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  const setActivePreset = (activeBtn) => {
    [presetAll, presetJan, presetFeb, presetMar].forEach(btn => {
      if (btn) btn.classList.remove("active");
    });
    if (activeBtn) activeBtn.classList.add("active");
  };

  const handlePresetClick = (btn, start, end, type) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      setActivePreset(btn);
      state.dateFilterType = type;
      state.startDate = start;
      state.endDate = end;
      
      if (startDateInput) startDateInput.value = start;
      if (endDateInput) endDateInput.value = end;

      aggregateAndRenderAll();
    });
  };

  handlePresetClick(presetAll, "2026-01-01", "2026-03-23", "all");
  handlePresetClick(presetJan, "2026-01-01", "2026-01-31", "jan");
  handlePresetClick(presetFeb, "2026-02-01", "2026-02-28", "feb");
  handlePresetClick(presetMar, "2026-03-01", "2026-03-23", "mar");

  const handleCustomDateChange = () => {
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    if (startVal && endVal) {
      setActivePreset(null);
      state.dateFilterType = "custom";
      state.startDate = startVal;
      state.endDate = endVal;
      aggregateAndRenderAll();
    }
  };

  if (startDateInput) {
    startDateInput.value = state.startDate;
    startDateInput.addEventListener("change", handleCustomDateChange);
  }
  if (endDateInput) {
    endDateInput.value = state.endDate;
    endDateInput.addEventListener("change", handleCustomDateChange);
  }
}

/**
 * Loading Overlay Display toggler
 */
function toggleLoadingOverlay(show, text = "Connecting to database...") {
  const overlay = document.getElementById("loading-overlay");
  const overlayText = document.getElementById("loading-text");
  if (overlay) {
    if (show) {
      if (overlayText) overlayText.innerText = text;
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
    }
  }
}

/**
 * Fetch baseline metrics from Supabase
 */
async function fetchDashboardData(dateStr) {
  toggleLoadingOverlay(true, "Synchronizing with Supabase database...");
  
  const endpoint = `${SUPABASE_URL}/rpc/get_sales_dashboard`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ report_date: dateStr })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result || result.length === 0) {
      throw new Error("No data returned for the selected date.");
    }
    
    state.supabaseRaw = result[0];
    state.baseTransactions = null; // force regeneration of ground truth
    
    aggregateAndRenderAll();
    showToast("Dashboard synchronized with cloud database.", "success");
    
  } catch (error) {
    console.error("Dashboard Fetch Failure, loading local fallback data...", error);
    showToast("Fetch failed. Loading local simulated database.", "error");
    
    // Create simulated fallback data for raw state
    state.supabaseRaw = getFallbackRawData();
    state.baseTransactions = null;
    aggregateAndRenderAll();
  } finally {
    toggleLoadingOverlay(false);
  }
}

/**
 * Aggregate the Supabase raw JSON data with local simulated sales
 * and trigger UI updates for the active components.
 */
function aggregateAndRenderAll() {
  if (!state.supabaseRaw) return;
  
  // 1. Generate base transactions database if null
  if (!state.baseTransactions) {
    state.baseTransactions = generateBaseTransactions(state.supabaseRaw);
  }

  // 2. Fetch all transactions and filter by active date range
  const rangeTx = getTransactionsInRange(state.startDate, state.endDate);

  // 3. Compute KPI metrics and update UI cards
  updateNovaKPIs(rangeTx);

  // 4. Update the Active Panel Content
  if (state.activeTab === "dashboard") {
    const emptyMsg = document.getElementById("charts-empty-msg");
    const chartsWrapper = document.getElementById("charts-content-wrapper");

    if (rangeTx.length === 0) {
      if (emptyMsg) emptyMsg.style.display = "flex";
      if (chartsWrapper) chartsWrapper.style.display = "none";
    } else {
      if (emptyMsg) emptyMsg.style.display = "none";
      if (chartsWrapper) chartsWrapper.style.display = "grid";
      
      // Render Trend and Contribution Charts
      renderDailyTrendChart(rangeTx);
      renderProductChart(rangeTx);
    }
    
    // Render Leaderboard and Transactions list
    renderLeaderboard(rangeTx);
    renderTransactionHistory(rangeTx);

  } else if (state.activeTab === "analytics") {
    renderAnalyticsView();
  } else if (state.activeTab === "sales-reps") {
    renderRepresentativesView();
  } else if (state.activeTab === "customers") {
    renderCustomersView();
  }
}

/**
 * Generate 100% deterministic transaction lists from Supabase raw metrics
 */
function generateBaseTransactions(raw) {
  const transactions = [];
  if (!raw) return transactions;

  const customers = state.customers;
  const categories = [
    "Enterprise Software Suite",
    "Cloud Migration Consulting",
    "SaaS Subscription Pro",
    "Dedicated Hardware Package",
    "Priority Support SLA (Annual)"
  ];
  const destinations = [
    "New York, USA",
    "London, UK",
    "San Francisco, USA",
    "Paris, France",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Frankfurt, Germany",
    "Toronto, Canada",
    "Mumbai, India",
    "Singapore"
  ];

  // Helper to generate deterministic values based on a seed
  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  let seed = 100;

  // 1. Generate March 2026 transactions from daily_metrics
  if (raw.daily_metrics) {
    raw.daily_metrics.forEach(metric => {
      const dateStr = metric.order_date;
      const count = metric.no_of_sales;
      const totalRev = metric.total_revenue;

      if (count <= 0) return;

      let remainingRev = totalRev;
      for (let i = 0; i < count; i++) {
        let amount;
        if (i === count - 1) {
          amount = remainingRev;
        } else {
          const rand = seededRandom(seed++);
          const share = (1 / count) * (0.6 + rand * 0.8); // 60% to 140% of average
          amount = Math.round((totalRev * share) * 100) / 100;
          if (amount > remainingRev - 10) {
            amount = Math.round((remainingRev / 2) * 100) / 100;
          }
          remainingRev -= amount;
        }

        const custIdx = Math.floor(seededRandom(seed++) * customers.length);
        const cust = customers[custIdx];
        const catIdx = Math.floor(seededRandom(seed++) * categories.length);
        const destIdx = Math.floor(seededRandom(seed++) * destinations.length);

        transactions.push({
          id: `ORD-2026-${10000 + transactions.length}`,
          customer: cust.company,
          contact: cust.contact,
          rep: cust.rep,
          amount: amount,
          date: dateStr,
          category: categories[catIdx],
          destination: destinations[destIdx]
        });
      }
    });
  }

  // 2. Generate February 2026 transactions (Feb has 402 sales, $285,595 revenue)
  const febSales = raw.kpi_cards && raw.kpi_cards[0] ? parseInt(raw.kpi_cards[0].PM_SALES || 402) : 402;
  const febRevenue = raw.kpi_cards && raw.kpi_cards[0] ? parseFloat(raw.kpi_cards[0].PM_REVENUE || 285595) : 285595;
  let remainingFebRev = febRevenue;
  
  for (let i = 0; i < febSales; i++) {
    const day = Math.floor(seededRandom(seed++) * 28) + 1;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-02-${dayStr}`;

    let amount;
    if (i === febSales - 1) {
      amount = remainingFebRev;
    } else {
      const rand = seededRandom(seed++);
      const share = (1 / febSales) * (0.5 + rand * 1.0);
      amount = Math.round((febRevenue * share) * 100) / 100;
      if (amount > remainingFebRev - 10) {
        amount = Math.round((remainingFebRev / 2) * 100) / 100;
      }
      remainingFebRev -= amount;
    }

    const custIdx = Math.floor(seededRandom(seed++) * customers.length);
    const cust = customers[custIdx];
    const catIdx = Math.floor(seededRandom(seed++) * categories.length);
    const destIdx = Math.floor(seededRandom(seed++) * destinations.length);

    transactions.push({
      id: `ORD-2026-${10000 + transactions.length}`,
      customer: cust.company,
      contact: cust.contact,
      rep: cust.rep,
      amount: amount,
      date: dateStr,
      category: categories[catIdx],
      destination: destinations[destIdx]
    });
  }

  // 3. Generate January 2026 transactions (Jan has 322 sales, $225,400 revenue)
  const janSales = 322;
  const janRevenue = 225400;
  let remainingJanRev = janRevenue;
  
  for (let i = 0; i < janSales; i++) {
    const day = Math.floor(seededRandom(seed++) * 31) + 1;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-01-${dayStr}`;

    let amount;
    if (i === janSales - 1) {
      amount = remainingJanRev;
    } else {
      const rand = seededRandom(seed++);
      const share = (1 / janSales) * (0.5 + rand * 1.0);
      amount = Math.round((janRevenue * share) * 100) / 100;
      if (amount > remainingJanRev - 10) {
        amount = Math.round((remainingJanRev / 2) * 100) / 100;
      }
      remainingJanRev -= amount;
    }

    const custIdx = Math.floor(seededRandom(seed++) * customers.length);
    const cust = customers[custIdx];
    const catIdx = Math.floor(seededRandom(seed++) * categories.length);
    const destIdx = Math.floor(seededRandom(seed++) * destinations.length);

    transactions.push({
      id: `ORD-2026-${10000 + transactions.length}`,
      customer: cust.company,
      contact: cust.contact,
      rep: cust.rep,
      amount: amount,
      date: dateStr,
      category: categories[catIdx],
      destination: destinations[destIdx]
    });
  }

  return transactions;
}

/**
 * Merge simulated sales and base transactions
 */
function getAllTransactions() {
  const base = state.baseTransactions || [];
  
  const destinations = [
    "New York, USA", "London, UK", "San Francisco, USA", "Paris, France", 
    "Tokyo, Japan", "Sydney, Australia", "Frankfurt, Germany", "Toronto, Canada"
  ];

  const simulated = state.simulatedSales.map(s => {
    const destIdx = s.customer.length % destinations.length;
    return {
      id: s.id,
      customer: s.customer,
      contact: state.customers.find(c => c.company === s.customer)?.contact || "Client",
      rep: s.rep,
      amount: parseFloat(s.amount),
      date: s.date,
      category: s.category || "Enterprise Software Suite",
      destination: destinations[destIdx]
    };
  });

  return [...simulated, ...base];
}

/**
 * Filter transactions by selected date range
 */
function getTransactionsInRange(start, end) {
  const all = getAllTransactions();
  return all.filter(tx => tx.date >= start && tx.date <= end);
}

/**
 * Update the 4 KPI Stats cards
 */
function updateNovaKPIs(transactions) {
  let totalRevenue = 0;
  let totalOrders = transactions.length;
  const uniqueCustomers = new Set();

  transactions.forEach(tx => {
    totalRevenue += tx.amount;
    uniqueCustomers.add(tx.customer);
  });

  const aov = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const activeCustomersCount = uniqueCustomers.size;

  // Bind values to DOM elements
  const elRevenue = document.getElementById("metric-revenue");
  const elOrders = document.getElementById("metric-orders");
  const elAOV = document.getElementById("metric-aov");
  const elAgents = document.getElementById("metric-agents");

  if (elRevenue) elRevenue.innerText = formatCurrency(totalRevenue);
  if (elOrders) elOrders.innerText = formatInteger(totalOrders);
  if (elAOV) elAOV.innerText = formatCurrency(aov);
  if (elAgents) elAgents.innerText = formatInteger(activeCustomersCount);
}

/**
 * Renders the daily trend area chart (using Chart.js)
 */
function renderDailyTrendChart(transactions) {
  const canvas = document.getElementById("trendChartCanvas");
  if (!canvas) return;

  const dateMap = {};
  
  // Initialize date points for the filtered range
  const start = new Date(state.startDate);
  const end = new Date(state.endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dateMap[dateStr] = { revenue: 0, count: 0 };
  }

  // Populate data
  transactions.forEach(tx => {
    if (dateMap[tx.date]) {
      dateMap[tx.date].revenue += tx.amount;
      dateMap[tx.date].count += 1;
    }
  });

  const sortedDates = Object.keys(dateMap).sort();
  const revenues = sortedDates.map(d => dateMap[d].revenue);
  const counts = sortedDates.map(d => dateMap[d].count);
  
  // Format labels ("Mar 12")
  const labels = sortedDates.map(d => {
    const parts = d.split('-');
    return `${getMonthAbbreviation(parseInt(parts[1]))} ${parseInt(parts[2])}`;
  });

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenues,
          borderColor: '#6366f1',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          yAxisID: 'yRevenue',
          pointRadius: revenues.length > 31 ? 0 : 3,
          pointHoverRadius: 6,
        },
        {
          label: 'Sales Count',
          data: counts,
          borderColor: '#14b8a6',
          borderWidth: 2,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.3,
          yAxisID: 'yCount',
          pointRadius: counts.length > 31 ? 0 : 3,
          pointHoverRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#9ca3af',
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: '#101625',
          titleColor: '#fff',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: 'Outfit', weight: '600' },
          bodyFont: { family: 'Plus Jakarta Sans' },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.datasetIndex === 0) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y + ' orders';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { family: 'Plus Jakarta Sans', size: 10 }
          }
        },
        yRevenue: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#9ca3af',
            font: { family: 'Plus Jakarta Sans', size: 10 },
            callback: function(value) {
              return '$' + formatNumberCompact(value);
            }
          }
        },
        yCount: {
          type: 'linear',
          position: 'right',
          grid: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { family: 'Plus Jakarta Sans', size: 10 },
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Renders the product contribution doughnut chart (using Chart.js)
 */
function renderProductChart(transactions) {
  const canvas = document.getElementById("productChartCanvas");
  if (!canvas) return;

  const categoriesMap = {};
  transactions.forEach(tx => {
    if (!categoriesMap[tx.category]) {
      categoriesMap[tx.category] = 0;
    }
    categoriesMap[tx.category] += tx.amount;
  });

  const sortedCategories = Object.keys(categoriesMap).sort((a, b) => categoriesMap[b] - categoriesMap[a]);
  const data = sortedCategories.map(cat => categoriesMap[cat]);
  
  const colors = [
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#fbbf24', // Amber
    '#ef4444'  // Red
  ];

  if (productChartInstance) {
    productChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  productChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sortedCategories,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, sortedCategories.length),
        borderColor: '#101625',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            color: '#9ca3af',
            boxWidth: 10,
            font: { family: 'Plus Jakarta Sans', size: 9, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: '#101625',
          titleColor: '#fff',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return ` ${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '72%'
    }
  });
}

/**
 * Populate the Sales Rep Leaderboard table rows (ranked by sales revenue)
 */
function renderLeaderboard(transactions) {
  const tbody = document.getElementById("leaderboard-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const repStatsMap = {};
  
  // Initialize reps
  Object.keys(state.reps).forEach(name => {
    repStatsMap[name] = { sales: 0, revenue: 0 };
  });

  transactions.forEach(tx => {
    if (repStatsMap[tx.rep]) {
      repStatsMap[tx.rep].sales += 1;
      repStatsMap[tx.rep].revenue += tx.amount;
    }
  });

  const repList = Object.keys(repStatsMap).map(name => ({
    name: name,
    sales: repStatsMap[name].sales,
    revenue: repStatsMap[name].revenue
  })).sort((a, b) => b.revenue - a.revenue);

  repList.forEach((rep, index) => {
    const rank = index + 1;
    const profile = state.reps[rep.name] || { avatarTheme: "indigo-theme" };
    const initials = rep.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const progressPercent = Math.min((rep.revenue / state.representativeTarget) * 100, 100);
    
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => openRepresentativeModal(rep.name));
    
    let rankHtml = `<div class="rank-badge rank-other">${rank}</div>`;
    if (rank === 1) rankHtml = `<div class="rank-badge rank-1"><i class="fas fa-crown"></i></div>`;
    else if (rank === 2) rankHtml = `<div class="rank-badge rank-2">2</div>`;
    else if (rank === 3) rankHtml = `<div class="rank-badge rank-3">3</div>`;
    
    tr.innerHTML = `
      <td>${rankHtml}</td>
      <td>
        <div class="rep-cell">
          <div class="rep-avatar ${profile.avatarTheme}">${initials}</div>
          <span class="rep-name">${rep.name}</span>
        </div>
      </td>
      <td>${formatInteger(rep.sales)}</td>
      <td style="font-weight: 600; color: white;">${formatCurrency(rep.revenue)}</td>
      <td>
        <div class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <span class="progress-text ${progressPercent >= 100 ? 'completed' : ''}">${progressPercent.toFixed(0)}%</span>
        </div>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

/**
 * Populate Transaction History table rows with key search logic
 */
function renderTransactionHistory(transactions) {
  const tbody = document.getElementById("orders-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchInput = document.getElementById("search-input");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  // Apply search query filters
  const filtered = transactions.filter(tx => {
    if (!query) return true;
    return tx.id.toLowerCase().includes(query) ||
           tx.customer.toLowerCase().includes(query) ||
           tx.category.toLowerCase().includes(query) ||
           tx.destination.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-secondary text-center" style="text-align: center; padding: 40px 0;">No matching transactions found in database.</td></tr>`;
    return;
  }

  // Sort transactions descending by date
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach(tx => {
    const tr = document.createElement("tr");
    const customerObj = state.customers.find(c => c.company === tx.customer) || { id: 'cust-1' };

    tr.innerHTML = `
      <td class="font-jakarta text-secondary" style="font-size: 0.8rem; font-weight: 500;">${tx.id}</td>
      <td>
        <div class="cust-name-cell">
          <span class="cust-company" onclick="openCustomerModal('${customerObj.id}')">${tx.customer}</span>
          <span class="cust-email">${tx.customer.toLowerCase().replace(/\s+/g, '')}.com</span>
        </div>
      </td>
      <td>${tx.category}</td>
      <td>
        <span class="font-jakarta" style="font-size: 0.82rem;"><i class="fas fa-location-dot" style="color: var(--accent-teal); margin-right: 4px; font-size: 0.75rem;"></i> ${tx.destination}</span>
      </td>
      <td style="font-weight: 600; color: var(--accent-teal);">${formatCurrency(tx.amount)}</td>
      <td class="font-jakarta text-secondary" style="font-size: 0.82rem;">${formatDateString(tx.date)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Render components for the Analytics View (Tab 2)
 */
function renderAnalyticsView() {
  const allTx = getAllTransactions();
  
  // 1. Group all transactions by month to render Monthly volume chart (bar chart)
  const monthlyMetricsMap = {};
  allTx.forEach(tx => {
    const d = new Date(tx.date);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const key = `${y}-${m}`;
    if (!monthlyMetricsMap[key]) {
      monthlyMetricsMap[key] = { year: y, month: m, no_of_sales: 0 };
    }
    monthlyMetricsMap[key].no_of_sales += 1;
  });
  const monthlyMetrics = Object.values(monthlyMetricsMap);

  renderMonthlyChart(monthlyMetrics);

  // 2. Populate Dropdowns for comparison
  populateCompareDropdowns();

  // 3. Trigger initial comparison update
  updateRepComparisonData();

  // 4. Generate AI Insights
  generatePerformanceInsights(allTx);
}

/**
 * Renders the monthly volume bar chart (using Chart.js)
 */
function renderMonthlyChart(monthlyMetrics) {
  const canvas = document.getElementById("monthly-bar-chart");
  if (!canvas) return;

  const sortedMetrics = [...monthlyMetrics].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
  
  const labels = sortedMetrics.map(item => `${getMonthAbbreviation(item.month)} ${item.year}`);
  const salesCounts = sortedMetrics.map(item => item.no_of_sales);

  if (monthlyBarChart) {
    monthlyBarChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 300, 0);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(1, '#ec4899');

  monthlyBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Orders Count',
        data: salesCounts,
        backgroundColor: gradient,
        borderRadius: 5,
        borderWidth: 0,
        barThickness: 16
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#101625',
          titleColor: '#fff',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return ` ${context.parsed.x} transactions`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans', size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans', size: 10 } }
        }
      }
    }
  });
}

/**
 * Populate comparison dropdowns with representatives names
 */
function populateCompareDropdowns() {
  const selectA = document.getElementById("compare-rep-a");
  const selectB = document.getElementById("compare-rep-b");
  if (!selectA || !selectB) return;

  const valA = selectA.value;
  const valB = selectB.value;
  selectA.innerHTML = "";
  selectB.innerHTML = "";

  const repsList = Object.keys(state.reps);
  
  repsList.forEach((rep) => {
    const optA = document.createElement("option");
    optA.value = rep;
    optA.innerText = rep;
    selectA.appendChild(optA);

    const optB = document.createElement("option");
    optB.value = rep;
    optB.innerText = rep;
    selectB.appendChild(optB);
  });

  if (valA && repsList.includes(valA)) selectA.value = valA;
  else selectA.value = repsList[0];

  if (valB && repsList.includes(valB)) selectB.value = valB;
  else selectB.value = repsList[1] || repsList[0];
}

/**
 * Handle updating Comparative metrics and trend charts
 */
function updateRepComparisonData() {
  const repAName = document.getElementById("compare-rep-a").value;
  const repBName = document.getElementById("compare-rep-b").value;

  if (!repAName || !repBName) return;

  const allTx = getAllTransactions();
  const rangeTx = getTransactionsInRange(state.startDate, state.endDate);

  const getStats = (name, txList) => {
    let rev = 0;
    let sales = 0;
    txList.forEach(tx => {
      if (tx.rep.trim().toLowerCase() === name.trim().toLowerCase()) {
        rev += tx.amount;
        sales += 1;
      }
    });
    return { revenue: rev, sales: sales };
  };

  const rangeStatsA = getStats(repAName, rangeTx);
  const rangeStatsB = getStats(repBName, rangeTx);

  const allTimeStatsA = getStats(repAName, allTx);
  const allTimeStatsB = getStats(repBName, allTx);

  // Bind values to DOM comparison cards
  document.getElementById("compare-a-today-rev").innerText = formatCurrency(rangeStatsA.revenue);
  document.getElementById("compare-b-today-rev").innerText = formatCurrency(rangeStatsB.revenue);
  
  document.getElementById("compare-a-today-sales").innerText = formatInteger(rangeStatsA.sales);
  document.getElementById("compare-b-today-sales").innerText = formatInteger(rangeStatsB.sales);

  document.getElementById("compare-a-mtd-rev").innerText = formatCurrency(allTimeStatsA.revenue);
  document.getElementById("compare-b-mtd-rev").innerText = formatCurrency(allTimeStatsB.revenue);

  document.getElementById("compare-a-mtd-sales").innerText = formatInteger(allTimeStatsA.sales);
  document.getElementById("compare-b-mtd-sales").innerText = formatInteger(allTimeStatsB.sales);

  renderRepComparisonChart(repAName, repBName);
}

/**
 * Renders the side-by-side comparison chart for two agents (using Chart.js)
 */
function renderRepComparisonChart(repA, repB) {
  const dates = [];
  const revA = [];
  const revB = [];

  const start = new Date(state.startDate);
  const end = new Date(state.endDate);

  const dateMapA = {};
  const dateMapB = {};

  // Initialize dates
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dateMapA[dateStr] = 0;
    dateMapB[dateStr] = 0;
  }

  const allTx = getAllTransactions();
  allTx.forEach(tx => {
    if (tx.date >= state.startDate && tx.date <= state.endDate) {
      if (tx.rep.trim().toLowerCase() === repA.trim().toLowerCase()) {
        if (dateMapA[tx.date] !== undefined) dateMapA[tx.date] += tx.amount;
      }
      if (tx.rep.trim().toLowerCase() === repB.trim().toLowerCase()) {
        if (dateMapB[tx.date] !== undefined) dateMapB[tx.date] += tx.amount;
      }
    }
  });

  const sortedDates = Object.keys(dateMapA).sort();
  sortedDates.forEach(d => {
    const parts = d.split('-');
    dates.push(`${getMonthAbbreviation(parseInt(parts[1]))} ${parseInt(parts[2])}`);

    revA.push(dateMapA[d].toFixed(2));
    revB.push(dateMapB[d].toFixed(2));
  });

  const canvas = document.getElementById("compare-trend-chart");
  if (!canvas) return;

  if (compareTrendChart) {
    compareTrendChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  compareTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: repA,
          data: revA,
          borderColor: '#6366f1',
          borderWidth: 3,
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.4,
          pointRadius: dates.length > 31 ? 0 : 3,
        },
        {
          label: repB,
          data: revB,
          borderColor: '#14b8a6',
          borderWidth: 3,
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.4,
          pointRadius: dates.length > 31 ? 0 : 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans', size: 11 } }
        },
        tooltip: {
          backgroundColor: '#101625',
          titleColor: '#fff',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: ${formatCurrency(value)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#9ca3af',
            font: { family: 'Plus Jakarta Sans', size: 10 },
            callback: function(value) {
              return '$' + formatNumberCompact(value);
            }
          }
        }
      }
    }
  });
}

/**
 * Generate simple AI Performance Insights based on date-filtered transactions
 */
function generatePerformanceInsights(allTx) {
  const container = document.getElementById("ai-insights-container");
  if (!container) return;
  container.innerHTML = "";

  const rangeTx = getTransactionsInRange(state.startDate, state.endDate);

  const repStatsMap = {};
  Object.keys(state.reps).forEach(name => {
    repStatsMap[name] = 0;
  });

  rangeTx.forEach(tx => {
    if (repStatsMap[tx.rep] !== undefined) {
      repStatsMap[tx.rep] += tx.amount;
    }
  });

  const repsList = Object.keys(repStatsMap).map(name => ({
    name: name,
    revenue: repStatsMap[name]
  })).sort((a, b) => b.revenue - a.revenue);

  if (rangeTx.length === 0 || repsList.reduce((sum, r) => sum + r.revenue, 0) === 0) {
    container.innerHTML = `<div class="text-secondary font-jakarta" style="font-size: 0.85rem;"><i class="fas fa-info-circle" style="margin-right: 6px;"></i> No sufficient sales records within the selected range to generate insights.</div>`;
    return;
  }

  const topRep = repsList[0];
  const totalRev = repsList.reduce((sum, r) => sum + r.revenue, 0);
  const avgRev = totalRev / repsList.length;

  const insights = [
    {
      type: "trend-up",
      icon: "fa-trending-up",
      text: `<strong>${topRep.name}</strong> is currently leading the team with <strong>${formatCurrency(topRep.revenue)}</strong> in total revenue, representing <strong>${((topRep.revenue / totalRev) * 100).toFixed(0)}%</strong> of total volume in this range.`
    },
    {
      type: "info",
      icon: "fa-bullseye",
      text: `Team target completion stands at <strong>${((totalRev / (state.representativeTarget * repsList.length)) * 100).toFixed(1)}%</strong> overall. Average representative billing is <strong>${formatCurrency(avgRev)}</strong>.`
    }
  ];

  const targetBeaters = repsList.filter(r => r.revenue >= state.representativeTarget);
  if (targetBeaters.length > 0) {
    const names = targetBeaters.map(r => r.name).join(", ");
    insights.push({
      type: "trend-up",
      icon: "fa-trophy",
      text: `Outstanding Performance: <strong>${names}</strong> have successfully surpassed the target threshold of <strong>${formatCurrency(state.representativeTarget)}</strong>.`
    });
  }

  const laggingReps = repsList.filter(r => r.revenue < state.representativeTarget * 0.5);
  if (laggingReps.length > 0) {
    const names = laggingReps.map(r => r.name).join(", ");
    insights.push({
      type: "warning",
      icon: "fa-triangle-exclamation",
      text: `Performance Review: <strong>${names}</strong> are currently billing below 50% of the target threshold in this period. Recommend priority alignment.`
    });
  }

  insights.forEach(item => {
    const div = document.createElement("div");
    div.className = "insight-item";
    
    div.innerHTML = `
      <i class="fas ${item.icon} insight-icon ${item.type}" style="font-size: 1rem; width: 20px;"></i>
      <span class="insight-text">${item.text}</span>
    `;
    container.appendChild(div);
  });
}

/**
 * Render Representative Cards Grid (Sales Reps tab)
 */
function renderRepresentativesView() {
  const container = document.getElementById("reps-grid");
  if (!container) return;
  container.innerHTML = "";

  const searchQuery = document.getElementById("search-reps").value.toLowerCase().trim();
  const tierFilter = document.getElementById("filter-rep-tier").value;

  const rangeTx = getTransactionsInRange(state.startDate, state.endDate);

  const repStatsMap = {};
  Object.keys(state.reps).forEach(name => {
    repStatsMap[name] = { sales: 0, revenue: 0 };
  });

  rangeTx.forEach(tx => {
    if (repStatsMap[tx.rep]) {
      repStatsMap[tx.rep].sales += 1;
      repStatsMap[tx.rep].revenue += tx.amount;
    }
  });

  const filteredReps = Object.keys(state.reps).filter(repKey => {
    const rep = state.reps[repKey];
    const stats = repStatsMap[repKey];
    
    const matchesSearch = rep.name.toLowerCase().includes(searchQuery) || 
                          rep.role.toLowerCase().includes(searchQuery) ||
                          rep.focus.toLowerCase().includes(searchQuery);
    
    if (!matchesSearch) return false;

    const progress = (stats.revenue / state.representativeTarget) * 100;

    if (tierFilter === "all") return true;
    if (tierFilter === "top") return progress >= 100;
    if (tierFilter === "ontrack") return progress >= 75 && progress < 100;
    if (tierFilter === "needs-attention") return progress < 75;

    return true;
  });

  if (filteredReps.length === 0) {
    container.innerHTML = `<div class="text-secondary font-jakarta" style="grid-column: 1/-1; text-align: center; padding: 40px 0;">No representative profiles match the specified filters.</div>`;
    return;
  }

  filteredReps.forEach(repKey => {
    const rep = state.reps[repKey];
    const stats = repStatsMap[repKey];
    
    const initials = rep.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const progress = (stats.revenue / state.representativeTarget) * 100;
    
    let tierClass = "needs-attention";
    let tierText = "Needs Attention";
    if (progress >= 100) {
      tierClass = "top";
      tierText = "Top Performer";
    } else if (progress >= 75) {
      tierClass = "ontrack";
      tierText = "On Track";
    }

    const customerCount = state.customers.filter(c => c.rep.trim().toLowerCase() === rep.name.trim().toLowerCase()).length;

    const card = document.createElement("div");
    card.className = "rep-card";
    card.addEventListener("click", () => openRepresentativeModal(rep.name));
    
    card.innerHTML = `
      <div class="rep-card-header">
        <div class="rep-avatar ${rep.avatarTheme}">${initials}</div>
        <div class="rep-card-info">
          <span class="rep-card-name">${rep.name}</span>
          <span class="rep-card-role">${rep.role}</span>
          <span class="rep-card-tier ${tierClass}">${tierText}</span>
        </div>
      </div>
      
      <div class="rep-card-metrics">
        <div class="rep-metric-box">
          <span class="rep-stat-label">Range Revenue</span>
          <span class="rep-metric-val">${formatCurrency(stats.revenue)}</span>
        </div>
        <div class="rep-metric-box">
          <span class="rep-stat-label">Range Orders</span>
          <span class="rep-metric-val">${formatInteger(stats.sales)}</span>
        </div>
        <div class="rep-metric-box" style="grid-column: span 2; border-top: 1px solid rgba(255, 255, 255, 0.03); padding-top: 8px; margin-top: 4px;">
          <span class="rep-stat-label">Assigned Portfolio</span>
          <span class="rep-metric-val" style="font-size: 1rem;">${customerCount} Corporate Accounts</span>
        </div>
      </div>
      
      <div class="rep-card-target">
        <div class="progress-container" style="width: 100%;">
          <div class="progress-bar-wrapper">
            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
          </div>
          <span class="progress-text ${progress >= 100 ? 'completed' : ''}">${progress.toFixed(0)}% Target</span>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

/**
 * Render Customer Datatable (Customers Portfolio tab)
 */
function renderCustomersView() {
  const tbody = document.getElementById("customers-rows");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchQuery = document.getElementById("search-customers").value.toLowerCase().trim();
  const tierFilter = document.getElementById("filter-customer-tier").value;
  const repFilter = document.getElementById("filter-customer-rep").value;

  const rangeTx = getTransactionsInRange(state.startDate, state.endDate);

  const customerStatsMap = {};
  state.customers.forEach(c => {
    customerStatsMap[c.company] = { spend: 0, purchases: 0, lastTx: "" };
  });

  rangeTx.forEach(tx => {
    if (customerStatsMap[tx.customer]) {
      customerStatsMap[tx.customer].spend += tx.amount;
      customerStatsMap[tx.customer].purchases += 1;
      if (!customerStatsMap[tx.customer].lastTx || tx.date > customerStatsMap[tx.customer].lastTx) {
        customerStatsMap[tx.customer].lastTx = tx.date;
      }
    }
  });

  const filteredCustomers = state.customers.filter(cust => {
    const matchesSearch = cust.company.toLowerCase().includes(searchQuery) ||
                          cust.contact.toLowerCase().includes(searchQuery) ||
                          cust.email.toLowerCase().includes(searchQuery);

    if (!matchesSearch) return false;
    if (tierFilter !== "all" && cust.tier !== tierFilter) return false;
    if (repFilter !== "all" && cust.rep.trim().toLowerCase() !== repFilter.trim().toLowerCase()) return false;

    return true;
  });

  populateCustomerRepFilter();

  if (filteredCustomers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-secondary text-center" style="text-align: center; padding: 40px 0;">No client accounts match the selected filter criteria.</td></tr>`;
    return;
  }

  filteredCustomers.forEach(cust => {
    const stats = customerStatsMap[cust.company];
    const lastTxStr = stats.lastTx ? formatDateString(stats.lastTx) : "--";

    const tr = document.createElement("tr");
    
    tr.innerHTML = `
      <td>
        <div class="cust-name-cell">
          <span class="cust-company" onclick="openCustomerModal('${cust.id}')">${cust.company}</span>
          <span class="cust-email">${cust.website}</span>
        </div>
      </td>
      <td>${cust.contact}</td>
      <td><span class="loyalty-badge ${cust.tier.toLowerCase()}">${cust.tier}</span></td>
      <td>
        <div class="rep-cell">
          <span class="rep-name">${cust.rep}</span>
        </div>
      </td>
      <td>${stats.purchases}</td>
      <td style="font-weight: 600; color: #ffffff;">${formatCurrency(stats.spend)}</td>
      <td class="font-jakarta text-secondary" style="font-size: 0.85rem;">${lastTxStr}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

/**
 * Populate list of representative filters in Customers view
 */
function populateCustomerRepFilter() {
  const select = document.getElementById("filter-customer-rep");
  if (!select) return;

  if (select.options.length > 1) return;

  select.innerHTML = '<option value="all">All Assigned Representatives</option>';
  
  Object.keys(state.reps).forEach(repName => {
    const opt = document.createElement("option");
    opt.value = repName;
    opt.innerText = repName;
    select.appendChild(opt);
  });
}

/**
 * Modal Populator: Simulate Sale Dropdowns
 */
function populateSimulateFormDropdowns() {
  const repSelect = document.getElementById("sim-rep");
  const custSelect = document.getElementById("sim-customer");
  if (!repSelect || !custSelect) return;

  repSelect.innerHTML = "";
  custSelect.innerHTML = "";

  Object.keys(state.reps).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.innerText = name;
    repSelect.appendChild(opt);
  });

  state.customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.company;
    opt.innerText = `${c.company} (${c.contact})`;
    custSelect.appendChild(opt);
  });
}

/**
 * Handle simulated transaction submit
 */
function recordSimulatedSale() {
  const rep = document.getElementById("sim-rep").value;
  const customer = document.getElementById("sim-customer").value;
  const amount = parseFloat(document.getElementById("sim-amount").value);
  const date = document.getElementById("sim-date").value;
  const category = document.getElementById("sim-category").value;

  if (!rep || !customer || isNaN(amount) || amount <= 0 || !date) {
    showToast("Please supply all transaction specifications.", "error");
    return;
  }

  // Create local sale log
  const newSale = {
    id: "ORD-SIM-" + Date.now().toString().slice(-5),
    rep: rep,
    customer: customer,
    amount: amount,
    date: date,
    category: category
  };

  // Add to local state and cache
  state.simulatedSales.push(newSale);
  saveSimulatedSales();

  // Close modal and reset form
  document.getElementById("modal-simulate").classList.remove("active");
  document.getElementById("simulate-sale-form").reset();

  // Trigger celebration explosion!
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  showToast(`Simulated sale of ${formatCurrency(amount)} recorded for ${rep}.`, "success");

  // Re-aggregate and update view
  aggregateAndRenderAll();
}

/**
 * Open Representative Deep-dive Modal
 */
function openRepresentativeModal(name) {
  const rep = state.reps[name.trim()];
  if (!rep) return;

  const allTx = getAllTransactions();
  const rangeTx = getTransactionsInRange(state.startDate, state.endDate);

  const getStats = (txList) => {
    let rev = 0;
    let sales = 0;
    txList.forEach(tx => {
      if (tx.rep.trim().toLowerCase() === name.trim().toLowerCase()) {
        rev += tx.amount;
        sales += 1;
      }
    });
    return { revenue: rev, sales: sales };
  };

  const rangeStats = getStats(rangeTx);
  const allTimeStats = getStats(allTx);

  const initials = rep.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  const avatar = document.getElementById("rep-detail-avatar");
  avatar.className = `rep-avatar large-avatar ${rep.avatarTheme}`;
  avatar.innerText = initials;

  document.getElementById("rep-detail-name").innerText = rep.name;
  document.getElementById("rep-detail-role").innerText = rep.role;
  document.getElementById("rep-detail-bio").innerText = rep.bio;
  document.getElementById("rep-detail-email").innerText = rep.email;
  document.getElementById("rep-detail-phone").innerText = rep.phone;

  // Set Performance Tier badge based on range progress
  const progress = (rangeStats.revenue / state.representativeTarget) * 100;
  const tierBadge = document.getElementById("rep-detail-tier-badge");
  
  let tierText = "Needs Attention";
  tierBadge.className = "rep-detail-badge rep-card-tier needs-attention";
  if (progress >= 100) {
    tierText = "Top Performer";
    tierBadge.className = "rep-detail-badge rep-card-tier top";
  } else if (progress >= 75) {
    tierText = "On Track";
    tierBadge.className = "rep-detail-badge rep-card-tier ontrack";
  }
  tierBadge.innerText = tierText;

  // Bind Stats numbers (Today/MTD tags mapped to Range/All-Time in modals)
  document.getElementById("rep-detail-today-rev").innerText = formatCurrency(rangeStats.revenue);
  document.getElementById("rep-detail-today-sales").innerText = formatInteger(rangeStats.sales);
  document.getElementById("rep-detail-mtd-rev").innerText = formatCurrency(allTimeStats.revenue);
  document.getElementById("rep-detail-mtd-sales").innerText = formatInteger(allTimeStats.sales);

  // Target Progress bar
  document.getElementById("rep-detail-progress-fill").style.width = `${Math.min(progress, 100)}%`;
  document.getElementById("rep-detail-progress-text").innerText = `${progress.toFixed(0)}%`;

  // Bind Tab 1: Assigned Clients
  const clientsTbody = document.getElementById("rep-detail-customers-rows");
  clientsTbody.innerHTML = "";
  
  const assignedClients = state.customers.filter(c => c.rep.trim().toLowerCase() === rep.name.trim().toLowerCase());
  
  if (assignedClients.length === 0) {
    clientsTbody.innerHTML = `<tr><td colspan="5" class="text-secondary text-center" style="text-align: center; padding: 20px 0;">No assigned clients found.</td></tr>`;
  } else {
    assignedClients.forEach(c => {
      const clientTx = allTx.filter(tx => tx.customer === c.company);
      const totalSpend = clientTx.reduce((sum, tx) => sum + tx.amount, 0);
      const lastDate = clientTx.length > 0 ? clientTx.sort((a,b) => new Date(b.date) - new Date(a.date))[0].date : "--";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight:600; color:white;">${c.company}</td>
        <td><span class="loyalty-badge ${c.tier.toLowerCase()}">${c.tier}</span></td>
        <td>${clientTx.length}</td>
        <td style="font-weight: 500;">${formatCurrency(totalSpend)}</td>
        <td class="font-jakarta text-secondary">${lastDate !== "--" ? formatDateString(lastDate) : "--"}</td>
      `;
      clientsTbody.appendChild(tr);
    });
  }

  // Bind Tab 2: Recent Transactions
  const txTbody = document.getElementById("rep-detail-transactions-rows");
  txTbody.innerHTML = "";

  const repTx = allTx.filter(tx => tx.rep.trim().toLowerCase() === rep.name.trim().toLowerCase())
                     .sort((a,b) => new Date(b.date) - new Date(a.date));

  if (repTx.length === 0) {
    txTbody.innerHTML = `<tr><td colspan="5" class="text-secondary text-center" style="text-align: center; padding: 20px 0;">No transactions recorded.</td></tr>`;
  } else {
    repTx.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-jakarta text-secondary" style="font-size:0.8rem;">${tx.id}</td>
        <td style="font-weight:600; color:white;">${tx.customer}</td>
        <td class="font-jakarta">${formatDateString(tx.date)}</td>
        <td>${tx.category}</td>
        <td style="font-weight:600; color:var(--accent-teal);">${formatCurrency(tx.amount)}</td>
      `;
      txTbody.appendChild(tr);
    });
  }

  // Set active sub-tab back to Clients
  document.getElementById("btn-rep-tab-customers").click();

  // Show Modal
  document.getElementById("modal-rep-detail").classList.add("active");
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Open Customer Profile modal
 */
function openCustomerModal(custId) {
  const cust = state.customers.find(c => c.id === custId);
  if (!cust) return;

  const allTx = getAllTransactions();
  const clientTx = allTx.filter(tx => tx.customer === cust.company);

  const totalSpent = clientTx.reduce((sum, tx) => sum + tx.amount, 0);
  const lastDate = clientTx.length > 0 ? clientTx.sort((a,b) => new Date(b.date) - new Date(a.date))[0].date : "--";

  const initials = cust.company.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  const avatar = document.getElementById("cust-detail-initials");
  avatar.className = `cust-initials`;
  avatar.innerText = initials;

  document.getElementById("cust-detail-company").innerText = cust.company;
  document.getElementById("cust-detail-contact-name").innerText = cust.contact;
  document.getElementById("cust-detail-email").innerText = cust.email;
  document.getElementById("cust-detail-phone").innerText = cust.phone;
  document.getElementById("cust-detail-website").innerText = `www.${cust.website}`;

  const badge = document.getElementById("cust-detail-tier-badge");
  badge.className = `cust-detail-badge loyalty-badge ${cust.tier.toLowerCase()}`;
  badge.innerText = `${cust.tier} Member`;

  // Assigned Rep block
  const repProfile = state.reps[cust.rep.trim()] || { name: cust.rep, role: "Sales Representative", avatarTheme: "indigo-theme" };
  const repInitials = repProfile.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  
  const repAvatar = document.getElementById("cust-detail-rep-avatar");
  repAvatar.className = `rep-avatar ${repProfile.avatarTheme}`;
  repAvatar.innerText = repInitials;

  document.getElementById("cust-detail-rep-name").innerText = repProfile.name;
  document.getElementById("cust-detail-rep-role").innerText = repProfile.role;

  const viewRepBtn = document.getElementById("btn-view-assigned-rep");
  viewRepBtn.onclick = () => {
    document.getElementById("modal-customer-detail").classList.remove("active");
    setTimeout(() => openRepresentativeModal(repProfile.name), 300);
  };

  document.getElementById("cust-detail-total-spend").innerText = formatCurrency(totalSpent);
  document.getElementById("cust-detail-total-orders").innerText = clientTx.length;
  document.getElementById("cust-detail-last-date").innerText = lastDate !== "--" ? formatDateString(lastDate) : "--";

  // Purchase timeline list
  const historyTbody = document.getElementById("cust-detail-history-rows");
  historyTbody.innerHTML = "";

  const sortedHistory = [...clientTx].sort((a,b) => new Date(b.date) - new Date(a.date));

  if (sortedHistory.length === 0) {
    historyTbody.innerHTML = `<tr><td colspan="4" class="text-secondary text-center" style="text-align: center; padding: 20px 0;">No transactions recorded.</td></tr>`;
  } else {
    sortedHistory.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-jakarta">${formatDateString(tx.date)}</td>
        <td style="color:white; font-weight:500;">${tx.category}</td>
        <td>${tx.rep}</td>
        <td style="font-weight:600; color:var(--accent-teal);">${formatCurrency(tx.amount)}</td>
      `;
      historyTbody.appendChild(tr);
    });
  }

  document.getElementById("modal-customer-detail").classList.add("active");
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Seed initial simulated sales if localStorage is empty
 */
function seedInitialSimulatedSales() {
  if (state.simulatedSales.length > 0) return;
  seedSampleTransactions();
}

function seedSampleTransactions() {
  const sampleSales = [
    { id: "ORD-SIM-1284", rep: "Nidhi", customer: "Acme Corporation", amount: 15500.00, date: "2026-03-23", category: "Enterprise Software Suite" },
    { id: "ORD-SIM-8491", rep: "Sanika", customer: "Globex Corporation", amount: 7200.00, date: "2026-03-22", category: "SaaS Subscription Pro" },
    { id: "ORD-SIM-4029", rep: "Karishma", customer: "Initech Systems", amount: 4800.00, date: "2026-03-23", category: "Cloud Migration Consulting" },
    { id: "ORD-SIM-7132", rep: "Faizan", customer: "Umbrella Corp", amount: 1250.00, date: "2026-03-21", category: "Priority Support SLA (Annual)" },
    { id: "ORD-SIM-9104", rep: "Prabhat", customer: "Stark Industries", amount: 22000.00, date: "2026-03-20", category: "Dedicated Hardware Package" }
  ];
  state.simulatedSales = sampleSales;
  saveSimulatedSales();
}

/**
 * Fallback baseline mock data if cloud sync fails
 */
function getFallbackRawData() {
  return {
    kpi_cards: [{
      PM_SALES: 402,
      mtd_sales: 277,
      PMSD_SALES: 320,
      PM_REVENUE: 285595,
      MTD_REVENUE: 197913,
      TODAY_SALES: 9,
      PMSD_REVENUE: 230849,
      TODAY_REVENUE: 5839.81
    }],
    daily_metrics: [
      { order_date: "2026-03-01", no_of_sales: 24, total_revenue: 18420.80 },
      { order_date: "2026-03-02", no_of_sales: 11, total_revenue: 7668.88 },
      { order_date: "2026-03-03", no_of_sales: 14, total_revenue: 10090.00 },
      { order_date: "2026-03-04", no_of_sales: 12, total_revenue: 8727.16 },
      { order_date: "2026-03-05", no_of_sales: 12, total_revenue: 8117.42 },
      { order_date: "2026-03-06", no_of_sales: 11, total_revenue: 7456.85 },
      { order_date: "2026-03-07", no_of_sales: 6, total_revenue: 3249.25 },
      { order_date: "2026-03-08", no_of_sales: 9, total_revenue: 5678.89 },
      { order_date: "2026-03-09", no_of_sales: 4, total_revenue: 2454.23 },
      { order_date: "2026-03-10", no_of_sales: 15, total_revenue: 8826.85 },
      { order_date: "2026-03-11", no_of_sales: 20, total_revenue: 15152.50 },
      { order_date: "2026-03-12", no_of_sales: 7, total_revenue: 8468.65 },
      { order_date: "2026-03-13", no_of_sales: 12, total_revenue: 8388.18 },
      { order_date: "2026-03-14", no_of_sales: 13, total_revenue: 8751.77 },
      { order_date: "2026-03-15", no_of_sales: 14, total_revenue: 8420.82 },
      { order_date: "2026-03-16", no_of_sales: 11, total_revenue: 6261.86 },
      { order_date: "2026-03-17", no_of_sales: 11, total_revenue: 10109.60 },
      { order_date: "2026-03-18", no_of_sales: 22, total_revenue: 14498.60 },
      { order_date: "2026-03-19", no_of_sales: 19, total_revenue: 14170.50 },
      { order_date: "2026-03-20", no_of_sales: 9, total_revenue: 5475.75 },
      { order_date: "2026-03-21", no_of_sales: 8, total_revenue: 7366.10 },
      { order_date: "2026-03-22", no_of_sales: 4, total_revenue: 4318.64 },
      { order_date: "2026-03-23", no_of_sales: 9, total_revenue: 5839.81 }
    ]
  };
}

/* ------------------ Formatters & Helper Functions ------------------ */

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(val);
}

function formatInteger(val) {
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}

function formatNumberCompact(val) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(val);
}

function formatDateString(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function getMonthAbbreviation(monthIndex) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[(monthIndex - 1) % 12];
}

/**
 * Toast Notification dispatcher
 */
function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  if (type === "error") icon = "fa-triangle-exclamation";
  
  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1rem; margin-right: 10px;"></i>
    <div class="toast-content">${msg}</div>
  `;
  
  container.appendChild(toast);
  
  // Slide out and remove toast after 4s
  setTimeout(() => {
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
