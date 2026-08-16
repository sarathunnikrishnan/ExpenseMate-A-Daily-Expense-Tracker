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
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#6366f1', 600: '#4f46e5' }
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
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between">
  <div>
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-filter backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i class="fa-solid fa-wallet text-white text-xl"></i>
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
          <div id="overallStatusBadge" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold">
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
            <span class="text-slate-300">Checking Status...</span>
          </div>

          <button id="autoRefreshBtn" onclick="toggleAutoRefresh()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition">
            <i class="fa-solid fa-arrows-rotate text-indigo-400" id="refreshSpinner"></i>
            <span id="autoRefreshLabel">Auto-Refresh: ON</span>
          </button>

          <button onclick="fetchHealth()" class="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    </header>

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

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Environment</p>
            <p id="statEnv" class="text-lg font-semibold text-white capitalize">Development</p>
          </div>
          <i class="fa-solid fa-server text-slate-500 text-xl"></i>
        </div>
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Connection Status</p>
            <p id="statConnectionStatus" class="text-lg font-semibold text-emerald-400">Connected & Active</p>
          </div>
          <i class="fa-solid fa-signal text-slate-500 text-xl"></i>
        </div>
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Database Status</p>
            <p id="statDb" class="text-lg font-semibold text-emerald-400">Connected</p>
          </div>
          <i class="fa-solid fa-database text-slate-500 text-xl"></i>
        </div>
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">MongoDB Cluster / Host</p>
            <p id="statDbHost" class="text-sm font-semibold text-white truncate max-w-[180px]">Atlas Cluster</p>
          </div>
          <i class="fa-solid fa-network-wired text-slate-500 text-xl"></i>
        </div>
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Database Name</p>
            <p id="statDbName" class="text-sm font-semibold text-white font-mono">expense_tracker</p>
          </div>
          <i class="fa-solid fa-folder-tree text-slate-500 text-xl"></i>
        </div>
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Email OTP Service</p>
            <p id="statEmail" class="text-sm font-semibold text-white">Configured</p>
          </div>
          <i class="fa-solid fa-envelope text-slate-500 text-xl"></i>
        </div>
        <div class="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Cloudinary Storage</p>
            <p id="statCloudinary" class="text-sm font-semibold text-white">Configured</p>
          </div>
          <i class="fa-solid fa-cloud text-slate-500 text-xl"></i>
        </div>
      </div>

      <div class="glass rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-terminal text-indigo-400"></i> Live Diagnostic Logs
          </h2>
          <button onclick="clearDiagnosticLogs()" class="text-xs text-slate-400 hover:text-red-400 transition flex items-center gap-1">
            <i class="fa-solid fa-trash"></i> Clear Logs
          </button>
        </div>
        <div id="logContainer" class="font-mono text-xs space-y-2 max-h-80 overflow-y-auto log-scroll pr-2">
          <div class="text-slate-500 italic py-4 text-center">Fetching system logs...</div>
        </div>
      </div>
    </main>
  </div>

  <script>
    let autoRefresh = true;
    let refreshInterval = null;

    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        
        const badge = document.getElementById('overallStatusBadge');
        if (data.status === 'OK') {
          badge.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span class="text-emerald-300">Operational</span>';
          document.getElementById('globalErrorBanner').classList.add('hidden');
        } else {
          badge.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span><span class="text-red-300">Degraded</span>';
          document.getElementById('globalErrorBanner').classList.remove('hidden');
        }

        document.getElementById('statEnv').textContent = data.environment || 'development';
        document.getElementById('statConnectionStatus').textContent = data.connectionStatus || 'Connected & Active';
        document.getElementById('statConnectionStatus').className = 'text-lg font-semibold ' + (data.status === 'OK' ? 'text-emerald-400' : 'text-red-400');
        
        document.getElementById('statDb').textContent = data.database?.status || 'Unknown';
        document.getElementById('statDb').className = 'text-lg font-semibold ' + (data.database?.status === 'Connected' ? 'text-emerald-400' : 'text-red-400');
        document.getElementById('statDbHost').textContent = data.database?.host || 'Atlas Cluster';
        document.getElementById('statDbName').textContent = data.database?.name || 'expense_tracker';
        
        document.getElementById('statEmail').textContent = data.services?.email || 'Not Configured';
        document.getElementById('statEmail').className = 'text-sm font-semibold ' + (data.services?.email === 'Configured' ? 'text-emerald-400' : 'text-amber-400');
        
        document.getElementById('statCloudinary').textContent = data.services?.cloudinary || 'Not Configured';
        document.getElementById('statCloudinary').className = 'text-sm font-semibold ' + (data.services?.cloudinary === 'Configured' ? 'text-emerald-400' : 'text-slate-400');

        const logContainer = document.getElementById('logContainer');
        if (data.logs && data.logs.length > 0) {
          logContainer.innerHTML = data.logs.map(log => \`
            <div class="flex items-start gap-3 py-1 border-b border-slate-900/50">
              <span class="text-slate-500">\${new Date(log.timestamp).toLocaleTimeString()}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold \${getLogClass(log.level)}">\${log.level}</span>
              <span class="text-slate-400">[\${log.type}]</span>
              <span class="text-slate-200">\${log.message}</span>
            </div>
          \`).join('');
        } else {
          logContainer.innerHTML = '<div class="text-slate-500 italic py-4 text-center">No diagnostic logs recorded yet.</div>';
        }
      } catch (err) {
        console.error('Failed to fetch health data', err);
      }
    }

    function getLogClass(level) {
      if (level === 'error') return 'bg-red-500/20 text-red-400 border border-red-500/30';
      if (level === 'success') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }

    async function retryDbConnection() {
      try {
        await fetch('/api/health/retry', { method: 'POST' });
        fetchHealth();
      } catch (err) {
        console.error('Failed to retry DB connection', err);
      }
    }

    async function clearDiagnosticLogs() {
      try {
        await fetch('/api/health/clear-logs', { method: 'POST' });
        fetchHealth();
      } catch (err) {
        console.error('Failed to clear logs', err);
      }
    }

    function toggleAutoRefresh() {
      autoRefresh = !autoRefresh;
      document.getElementById('autoRefreshLabel').textContent = 'Auto-Refresh: ' + (autoRefresh ? 'ON' : 'OFF');
      if (autoRefresh) startTimer(); else clearInterval(refreshInterval);
    }

    function startTimer() {
      clearInterval(refreshInterval);
      refreshInterval = setInterval(fetchHealth, 5000);
    }

    document.addEventListener('DOMContentLoaded', () => {
      fetchHealth();
      startTimer();
    });
  </script>
</body>
</html>`;
};
