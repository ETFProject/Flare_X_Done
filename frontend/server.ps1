# Simple PowerShell HTTP Server for Frontend
param(
    [int]$Port = 8000
)

Write-Host "Starting HTTP server on port $Port..."
Write-Host "Serving from: $(Get-Location)"
Write-Host "Open your browser to: http://localhost:$Port/index.html"
Write-Host "Press Ctrl+C to stop the server"

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

try {
    while ($listener.IsListening) {
        # Wait for incoming request
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $filePath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($filePath) -or $filePath -eq '/') {
            $filePath = 'index.html'
        }
        
        $fullPath = Join-Path (Get-Location) $filePath
        
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $($request.Url.LocalPath)"
        
        if (Test-Path $fullPath -PathType Leaf) {
            # Serve the file
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            
            # Set content type based on extension
            $extension = [System.IO.Path]::GetExtension($fullPath).ToLower()
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html; charset=utf-8' }
                '.css'  { $response.ContentType = 'text/css' }
                '.js'   { $response.ContentType = 'application/javascript' }
                '.json' { $response.ContentType = 'application/json' }
                default { $response.ContentType = 'application/octet-stream' }
            }
            
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # File not found
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("File not found: $filePath")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $listener.Stop()
    Write-Host "Server stopped."
} 