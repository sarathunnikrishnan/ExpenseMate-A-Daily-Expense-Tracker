export const getDashboardHtml = (): string => {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ExpenseMate API - System Dashboard</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'Fira Code', monospace; }
    .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .log-scroll::-webkit-scrollbar { width: 8px; }
    .log-scroll::-webkit-scrollbar-track { background: #0f172a; }
    .log-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

  <!-- Main Container -->
  <div>
    <!-- Top Navigation Header -->
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-filter backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i class="fa-solid me-0 fa-wallet text-white text-xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-bold text-white tracking-tight">ExpenseMate API</h1>
              <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">v1.0.0</span>
            </div>
            <p class="text-xs text-slate-400">Live Health, Service Connections & Diagnostic Console</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Overall Status Badge -->
          <div id="overallStatusBadge" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold">
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
            <span class="text-slate-300">Checking Status...</span>
          </div>

          <!-- Auto Refresh Toggle -->
          <button id="autoRefreshBtn" onclick="toggleAutoRefresh()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition">
            <i class="fa-solid fa-arrows-rotate text-indigo-400" id="refreshSpinner"></i>
            <span id="autoRefreshLabel">Auto-Refresh: ON</span>
          </button>

          <!-- Refresh Now -->
          <button onclick="fetchHealth()" class="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Global Alert Banner (Shows when DB or Critical Service has Error) -->
    <div id="globalErrorBanner" class="hidden bg-red-950/80 border-b border-red-800/80 px-4 py-3">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div class="flex items-center gap-2 text-red-200">
          <i class="fa-solid fa-triangle-exclamation text-red-400 text-base"></i>
          <span class="font-medium" id="globalErrorMsg">MongoDB connection failed. Check environment variables or database host.</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="retryDbConnection()" class="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition text-xs flex items-center gap-1">
            <i class="fa-solid fa-plug-circle-bolt"></i> Retry DB Connection
          </button>
          <button onclick="switchTab('logsTab'); filterLogs('error');" class="px-3 py-1 bg-red-900/60 hover:bg-red-800/80 text-red-100 rounded font-medium transition text-xs flex items-center gap-1 border border-red-700">
            <i class="fa-solid fa-terminal"></i> Switch to Logs
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-800 space-x-1 sm:space-x-4">
        <button id="tabBtn-statusTab" onclick="switchTab('statusTab')" class="px-4 py-2.5 text-sm font-medium text-indigo-400 border-b-2 border-indigo-500 flex items-center gap-2 transition">
          <i class="fa-solid fa-chart-line"></i> Services Status
        </button>
        <button id="tabBtn-logsTab" onclick="switchTab('logsTab')" class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center gap-2 transition">
          <i class="fa-solid fa-terminal"></i> Diagnostic Logs
          <span id="logBadge" class="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 font-mono">0</span>
        </button>
        <button id="tabBtn-apiTab" onclick="switchTab('apiTab')" class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center gap-2 transition">
          <i class="fa-solid fa-network-wired"></i> API Directory
        </button>
      </div>

      <!-- TAB 1: SERVICES STATUS -->
      <div id="statusTab" class="tab-content space-y-6">
        
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Environment -->
          <div class="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Environment</p>
              <p id="statEnv" class="text-lg font-semibold text-white capitalize">...</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
              <i class="fa-solid fa-server"></i>
            </div>
          </div>

          <!-- Uptime -->
          <div class="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Server Uptime</p>
              <p id="statUptime" class="text-lg font-semibold text-white font-mono">0s</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
              <i class="fa-solid fa-clock"></i>
            </div>
          </div>

          <!-- Node Version -->
          <div class="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Node Runtime</p>
              <p id="statNodeVersion" class="text-lg font-semibold text-white font-mono">...</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
              <i class="fa-fab fa-node-js"></i>
            </div>
          </div>

          <!-- Total Logged Events -->
          <div class="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Recorded Logs</p>
              <p id="statLogsCount" class="text-lg font-semibold text-white font-mono">0</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
              <i class="fa-solid fa-list-check"></i>
            </div>
          </div>

        </div>

        <!-- Connection Cards Grid -->
        <h2 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Infrastructure & Service Connections</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- 1. MongoDB Connection Card -->
          <div class="glass p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden border border-slate-800 hover:border-slate-700 transition" id="cardMongo">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 text-xl">
                  <i class="fa-solid fa-database"></i>
                </div>
                <div>
                  <h3 class="font-bold text-white">MongoDB Database</h3>
                  <p class="text-xs text-slate-400">Primary Data Storage</p>
                </div>
              </div>
              <span id="badgeMongo" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">Checking</span>
            </div>

            <div class="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-mono">
              <div class="flex justify-between">
                <span class="text-slate-500">Host:</span>
                <span id="mongoHost" class="text-slate-200">N/A</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Database Name:</span>
                <span id="mongoName" class="text-slate-200">N/A</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Status Code:</span>
                <span id="mongoCode" class="text-slate-200">0</span>
              </div>
            </div>

            <div id="mongoErrorBox" class="hidden p-3 rounded-lg bg-red-950/50 border border-red-900/50 text-xs text-red-300 space-y-1">
              <div class="font-semibold flex items-center gap-1.5 text-red-400">
                <i class="fa-solid fa-circle-xmark"></i> Connection Failed
              </div>
              <p id="mongoErrorMsg" class="font-mono text-[11px] break-all">No connection</p>
            </div>

            <div class="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
              <span class="text-slate-400">Connection State</span>
              <button onclick="retryDbConnection()" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                <i class="fa-solid fa-rotate"></i> Re-connect
              </button>
            </div>
          </div>

          <!-- 2. Cloudinary Storage Card -->
          <div class="glass p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden border border-slate-800 hover:border-slate-700 transition" id="cardCloudinary">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-xl bg-sky-950/60 border border-sky-800/50 flex items-center justify-center text-sky-400 text-xl">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div>
                  <h3 class="font-bold text-white">Cloudinary Storage</h3>
                  <p class="text-xs text-slate-400">Profile & Media Bucket</p>
                </div>
              </div>
              <span id="badgeCloudinary" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">Checking</span>
            </div>

            <div class="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-mono">
              <div class="flex justify-between">
                <span class="text-slate-500">Cloud Name:</span>
                <span id="cloudinaryCloud" class="text-slate-200">Not Set</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">API Key:</span>
                <span id="cloudinaryKey" class="text-slate-200">Not Set</span>
              </div>
            </div>

            <div class="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
              <span class="text-slate-400">Config Status</span>
              <span id="cloudinaryStatusDetail" class="text-slate-400 font-mono text-[11px]">Ready</span>
            </div>
          </div>

          <!-- 3. SMTP Mailer Card -->
          <div class="glass p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden border border-slate-800 hover:border-slate-700 transition" id="cardSmtp">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 text-xl">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h3 class="font-bold text-white">SMTP Emailer</h3>
                  <p class="text-xs text-slate-400">OTP & Verification Service</p>
                </div>
              </div>
              <span id="badgeSmtp" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">Checking</span>
            </div>

            <div class="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-mono">
              <div class="flex justify-between">
                <span class="text-slate-500">Server Host:</span>
                <span id="smtpHost" class="text-slate-200">Console Mode</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Dispatch Mode:</span>
                <span id="smtpMode" class="text-slate-200">Console</span>
              </div>
            </div>

            <div class="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
              <span class="text-slate-400">Delivery Channel</span>
              <span id="smtpStatusDetail" class="text-slate-400 font-mono text-[11px]">Active</span>
            </div>
          </div>

        </div>
      </div>

      <!-- TAB 2: DIAGNOSTIC LOGS & ERROR SWITCHER -->
      <div id="logsTab" class="tab-content hidden space-y-4">
        
        <!-- Log Controls Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-medium text-slate-400 mr-2">Filter Level:</span>
            <button onclick="filterLogs('all')" id="logFilter-all" class="log-filter-btn px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600 text-white">
              ALL (<span id="countAll">0</span>)
            </button>
            <button onclick="filterLogs('error')" id="logFilter-error" class="log-filter-btn px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-red-400 hover:bg-slate-700">
              <i class="fa-solid fa-circle-exclamation mr-1"></i> ERRORS (<span id="countError">0</span>)
            </button>
            <button onclick="filterLogs('warn')" id="logFilter-warn" class="log-filter-btn px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-amber-400 hover:bg-slate-700">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i> WARNINGS (<span id="countWarn">0</span>)
            </button>
            <button onclick="filterLogs('info')" id="logFilter-info" class="log-filter-btn px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-sky-400 hover:bg-slate-700">
              INFO (<span id="countInfo">0</span>)
            </button>
            <button onclick="filterLogs('success')" id="logFilter-success" class="log-filter-btn px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-emerald-400 hover:bg-slate-700">
              SUCCESS (<span id="countSuccess">0</span>)
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="copyLogsToClipboard()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition">
              <i class="fa-regular fa-copy"></i> Copy Logs
            </button>
            <button onclick="clearLogsServer()" class="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition">
              <i class="fa-solid fa-trash-can"></i> Clear
            </button>
          </div>
        </div>

        <!-- Terminal Console View -->
        <div class="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
          <div class="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span class="text-xs font-mono text-slate-400 ml-2">system.log - live tail</span>
            </div>
            <span class="text-[11px] font-mono text-slate-500" id="lastUpdatedLogTime">Refreshed just now</span>
          </div>

          <div id="logContainer" class="p-4 font-mono text-xs max-h-[500px] overflow-y-auto log-scroll space-y-2">
            <p class="text-slate-500 italic">No system log entries recorded yet...</p>
          </div>
        </div>

      </div>

      <!-- TAB 3: API ROUTES DIRECTORY -->
      <div id="apiTab" class="tab-content hidden space-y-4">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-white">Registered API Endpoints</h3>
            <p class="text-xs text-slate-400">All available REST API routes exposed by ExpenseMate backend</p>
          </div>
          <a href="/api/health" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-indigo-400 flex items-center gap-1.5">
            <i class="fa-solid fa-code"></i> JSON Health Endpoint
          </a>
        </div>

        <div class="glass rounded-xl overflow-hidden border border-slate-800">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th class="px-4 py-3">Route Base</th>
                <th class="px-4 py-3">Endpoint Group</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Auth Required</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/auth</td>
                <td class="px-4 py-3">Authentication (Signup, Login, OTP, Password Reset)</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-slate-500">Public / Bearer</td>
              </tr>
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/transactions</td>
                <td class="px-4 py-3">Expense & Income Transactions CRUD</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-amber-400">Bearer Token</td>
              </tr>
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/categories</td>
                <td class="px-4 py-3">Category Management</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-amber-400">Bearer Token</td>
              </tr>
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/budgets</td>
                <td class="px-4 py-3">Monthly Budget Rules & Threshold Alerts</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-amber-400">Bearer Token</td>
              </tr>
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/reports</td>
                <td class="px-4 py-3">Analytics & Spending Insights</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-amber-400">Bearer Token</td>
              </tr>
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/accounts</td>
                <td class="px-4 py-3">User Financial Accounts & Wallets</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-amber-400">Bearer Token</td>
              </tr>
              <tr class="hover:bg-slate-900/50">
                <td class="px-4 py-3 text-indigo-400 font-semibold">/api/health</td>
                <td class="px-4 py-3">System Health & Diagnostic JSON API</td>
                <td class="px-4 py-3"><span class="text-emerald-400">Active</span></td>
                <td class="px-4 py-3 text-slate-500">Public</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>

  <!-- Footer -->
  <footer class="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
    <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
      <p>ExpenseMate Engine API © 2026</p>
      <div class="flex items-center gap-4">
        <span>Server Time: <span id="serverTimeText" class="font-mono text-slate-400">...</span></span>
        <a href="/api/health" class="text-indigo-400 hover:underline">Raw Health JSON</a>
      </div>
    </div>
  </footer>

  <!-- Embedded Dashboard Script -->
  <script>
    let autoRefresh = true;
    let refreshInterval = null;
    let cachedLogs = [];
    let currentLogFilter = 'all';

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.getElementById(tabId).classList.remove('hidden');

      document.querySelectorAll('[id^="tabBtn-"]').forEach(btn => {
        btn.classList.remove('text-indigo-400', 'border-indigo-500');
        btn.classList.add('text-slate-400', 'border-transparent');
      });

      const activeBtn = document.getElementById('tabBtn-' + tabId);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'border-transparent');
        activeBtn.classList.add('text-indigo-400', 'border-indigo-500');
      }
    }

    function toggleAutoRefresh() {
      autoRefresh = !autoRefresh;
      const label = document.getElementById('autoRefreshLabel');
      const spinner = document.getElementById('refreshSpinner');

      if (autoRefresh) {
        label.innerText = 'Auto-Refresh: ON';
        spinner.classList.add('fa-spin');
        startAutoRefresh();
      } else {
        label.innerText = 'Auto-Refresh: OFF';
        spinner.classList.remove('fa-spin');
        if (refreshInterval) clearInterval(refreshInterval);
      }
    }

    function startAutoRefresh() {
      if (refreshInterval) clearInterval(refreshInterval);
      refreshInterval = setInterval(fetchHealth, 5000);
    }

    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        const logsRes = await fetch('/api/health/logs');
        const logsData = await logsRes.json();
        
        updateDashboard(data, logsData.logs || []);
      } catch (err) {
        console.error('Failed to fetch health data', err);
        showGlobalError('Unable to communicate with ExpenseMate server.');
      }
    }

    function updateDashboard(health, logs) {
      cachedLogs = logs;
      
      // Update overall status badge
      const badge = document.getElementById('overallStatusBadge');
      if (health.overallStatus === 'operational') {
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300';
        badge.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span>All Systems Operational</span>';
        hideGlobalError();
      } else if (health.overallStatus === 'degraded') {
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-800 text-xs font-semibold text-amber-300';
        badge.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span>Degraded Services</span>';
        hideGlobalError();
      } else {
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-xs font-semibold text-red-300';
        badge.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span><span>System Error / Connection Required</span>';
        showGlobalError(health.database.lastError || 'MongoDB Database Connection Error! Update MONGO_URI in .env.');
      }

      // Quick stats
      document.getElementById('statEnv').innerText = health.environment;
      document.getElementById('statUptime').innerText = formatUptime(health.uptime);
      document.getElementById('statNodeVersion').innerText = health.nodeVersion;
      document.getElementById('statLogsCount').innerText = health.logsCount;
      document.getElementById('serverTimeText').innerText = new Date(health.timestamp).toLocaleTimeString();
      document.getElementById('logBadge').innerText = logs.length;

      // MongoDB Card
      const db = health.database;
      const badgeMongo = document.getElementById('badgeMongo');
      const mongoErrorBox = document.getElementById('mongoErrorBox');

      document.getElementById('mongoHost').innerText = db.host || 'N/A';
      document.getElementById('mongoName').innerText = db.name || 'N/A';
      document.getElementById('mongoCode').innerText = db.code;

      if (db.code === 1) {
        badgeMongo.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60';
        badgeMongo.innerText = 'Connected';
        mongoErrorBox.classList.add('hidden');
      } else if (db.code === 2) {
        badgeMongo.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/60';
        badgeMongo.innerText = 'Connecting...';
        mongoErrorBox.classList.add('hidden');
      } else {
        badgeMongo.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700/60';
        badgeMongo.innerText = 'Disconnected';
        mongoErrorBox.classList.remove('hidden');
        document.getElementById('mongoErrorMsg').innerText = db.lastError || 'MONGO_URI environment variable missing or invalid connection parameters.';
      }

      // Cloudinary Card
      const c = health.services.cloudinary;
      const badgeCloudinary = document.getElementById('badgeCloudinary');
      document.getElementById('cloudinaryCloud').innerText = c.details.includes('Cloud:') ? c.details.split('Cloud: ')[1] : 'Not Configured';
      document.getElementById('cloudinaryKey').innerText = c.configured ? '••••••••' : 'Missing';
      document.getElementById('cloudinaryStatusDetail').innerText = c.label;

      if (c.configured) {
        badgeCloudinary.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60';
        badgeCloudinary.innerText = 'Configured';
      } else {
        badgeCloudinary.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/60';
        badgeCloudinary.innerText = 'Optional';
      }

      // SMTP Card
      const s = health.services.smtp;
      const badgeSmtp = document.getElementById('badgeSmtp');
      document.getElementById('smtpHost').innerText = s.details.includes('Host:') ? s.details.split('Host: ')[1] : 'Console Mode';
      document.getElementById('smtpMode').innerText = s.configured ? 'Live SMTP' : 'Console Log';
      document.getElementById('smtpStatusDetail').innerText = s.label;

      if (s.configured) {
        badgeSmtp.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60';
        badgeSmtp.innerText = 'Configured';
      } else {
        badgeSmtp.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/60';
        badgeSmtp.innerText = 'Dev Mode';
      }

      // Render Logs
      renderLogs();
    }

    function renderLogs() {
      const container = document.getElementById('logContainer');
      const filtered = cachedLogs.filter(l => currentLogFilter === 'all' || l.level === currentLogFilter);

      // Counts
      document.getElementById('countAll').innerText = cachedLogs.length;
      document.getElementById('countError').innerText = cachedLogs.filter(l => l.level === 'error').length;
      document.getElementById('countWarn').innerText = cachedLogs.filter(l => l.level === 'warn').length;
      document.getElementById('countInfo').innerText = cachedLogs.filter(l => l.level === 'info').length;
      document.getElementById('countSuccess').innerText = cachedLogs.filter(l => l.level === 'success').length;

      if (filtered.length === 0) {
        container.innerHTML = '<p class="text-slate-500 italic py-4 text-center">No logs match the selected filter.</p>';
        return;
      }

      let html = '';
      filtered.forEach(log => {
        let colorClass = 'text-slate-300';
        let bgBadge = 'bg-slate-800 text-slate-400';
        let icon = '<i class="fa-solid fa-info text-sky-400"></i>';

        if (log.level === 'error') {
          colorClass = 'text-red-400 font-semibold';
          bgBadge = 'bg-red-950/80 text-red-300 border border-red-800';
          icon = '<i class="fa-solid fa-circle-xmark text-red-500"></i>';
        } else if (log.level === 'warn') {
          colorClass = 'text-amber-300';
          bgBadge = 'bg-amber-950/80 text-amber-300 border border-amber-800';
          icon = '<i class="fa-solid fa-triangle-exclamation text-amber-400"></i>';
        } else if (log.level === 'success') {
          colorClass = 'text-emerald-400';
          bgBadge = 'bg-emerald-950/80 text-emerald-300 border border-emerald-800';
          icon = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
        }

        const timeStr = new Date(log.timestamp).toLocaleTimeString();

        html += \`
          <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col space-y-1 hover:border-slate-700 transition">
            <div class="flex items-center justify-between text-[11px]">
              <div class="flex items-center space-x-2">
                \${icon}
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase \${bgBadge}">\${log.category}</span>
                <span class="text-slate-400 font-mono">\${timeStr}</span>
              </div>
              <span class="text-slate-600 font-mono">#\${log.id}</span>
            </div>
            <p class="text-xs font-mono \${colorClass} pl-5">\${escapeHtml(log.message)}</p>
            \${log.details ? \`<pre class="mt-1 p-2 rounded bg-slate-950 text-[11px] text-slate-400 overflow-x-auto border border-slate-800 font-mono ml-5">\${escapeHtml(log.details)}</pre>\` : ''}
          </div>
        \`;
      });

      container.innerHTML = html;
    }

    function filterLogs(level) {
      currentLogFilter = level;
      document.querySelectorAll('.log-filter-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-slate-800');
      });
      const activeBtn = document.getElementById('logFilter-' + level);
      if (activeBtn) {
        activeBtn.classList.remove('bg-slate-800');
        activeBtn.classList.add('bg-indigo-600', 'text-white');
      }
      renderLogs();
    }

    async function retryDbConnection() {
      try {
        const res = await fetch('/api/health/retry-db', { method: 'POST' });
        const data = await res.json();
        alert(data.message || 'Retrying MongoDB Connection...');
        setTimeout(fetchHealth, 1500);
      } catch (err) {
        alert('Failed to trigger DB retry: ' + err.message);
      }
    }

    async function clearLogsServer() {
      if (confirm('Clear all in-memory system logs?')) {
        await fetch('/api/health/logs', { method: 'DELETE' });
        fetchHealth();
      }
    }

    function copyLogsToClipboard() {
      const text = cachedLogs.map(l => \`[\${l.timestamp}] [\${l.category}] [\${l.level.toUpperCase()}]: \${l.message} \${l.details || ''}\`).join('\\n');
      navigator.clipboard.writeText(text);
      alert('Copied ' + cachedLogs.length + ' log entries to clipboard!');
    }

    function showGlobalError(msg) {
      const banner = document.getElementById('globalErrorBanner');
      document.getElementById('globalErrorMsg').innerText = msg;
      banner.classList.remove('hidden');
    }

    function hideGlobalError() {
      document.getElementById('globalErrorBanner').classList.add('hidden');
    }

    function formatUptime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (h > 0) return \`\${h}h \${m}m \${s}s\`;
      if (m > 0) return \`\${m}m \${s}s\`;
      return \`\${s}s\`;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Initialize
    fetchHealth();
    startAutoRefresh();
  </script>
</body>
</html>`;
};
