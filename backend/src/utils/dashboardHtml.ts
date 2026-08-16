/**
 * @file dashboardHtml.ts
 * @description Generates the HTML string for the live backend API system health dashboard UI.
 */

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

    <!-- Global Alert Banner -->
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
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div class="flex border-b border-slate-800 space-x-1 sm:space-x-4">
        <button id="tabBtn-statusTab" onclick="switchTab('statusTab')" class="px-4 py-2.5 text-sm font-medium text-indigo-400 border-b-2 border-indigo-500 flex items-center gap-2 transition">
          <i class="fa-solid fa-chart-line"></i> Services Status
        </button>
        <button id="tabBtn-logsTab" onclick="switchTab('logsTab')" class="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center gap-2 transition">
          <i class="fa-solid fa-terminal"></i> Diagnostic Logs
          <span id="logBadge" class="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 font-mono">0</span>
        </button>
      </div>

      <div id="statusTab" class="tab-content space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Environment</p>
              <p id="statEnv" class="text-lg font-semibold text-white capitalize">...</p>
            </div>
          </div>
          <div class="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-medium">Server Uptime</p>
              <p id="statUptime" class="text-lg font-semibold text-white font-mono">0s</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script>
    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
      } catch (err) {
        console.error('Failed to fetch health data', err);
      }
    }
  </script>
</body>
</html>`;
};
