# start-dev.ps1
Write-Host "🚀 RealWorld environment manager" -ForegroundColor Cyan

# Configuration
$backendPort = 3001
$uiPort = 4100
$backendPath = "C:\Users\carse\realworld-backend"
$uiPath = "C:\Users\carse\realworld-app\ui"

function Test-Port {
    param ([int]$Port)
    try {
        $tcp = New-Object Net.Sockets.TcpClient
        $tcp.Connect("localhost", $Port)
        $tcp.Close()
        return $true
    } catch {
        return $false
    }
}

$backendRunning = Test-Port $backendPort
$uiRunning = Test-Port $uiPort

if ($backendRunning -or $uiRunning) {
    Write-Host "⚠️  Detected running environment:" -ForegroundColor Yellow
    if ($backendRunning) { Write-Host " - Backend on port $backendPort" }
    if ($uiRunning) { Write-Host " - UI on port $uiPort" }

    $choice = Read-Host "Do you want to restart both? (y/n)"
    if ($choice -eq 'y') {
        Write-Host "🛑 Stopping Node processes..." -ForegroundColor Yellow
        Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Sleep -Seconds 2
    } else {
        Write-Host "✅ Environment left running. Exiting..."
        exit
    }
}

Write-Host "🚀 Starting backend and UI..." -ForegroundColor Cyan

# Start backend minimized
Start-Process powershell -ArgumentList "cd '$backendPath'; npm start" -WindowStyle Minimized

# Give backend a head start
Start-Sleep -Seconds 3

# Start UI normal
Start-Process powershell -ArgumentList "cd '$uiPath'; npm start" -WindowStyle Normal

Write-Host "✅ Backend and UI started!"
