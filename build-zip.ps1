Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = 'c:\Users\Stephen Reponen\Desktop\contact-game-itch.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

function Add-FileToZip($zip, $filePath, $entryName) {
    $entry = $zip.CreateEntry($entryName)
    $stream = $entry.Open()
    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $stream.Write($fileBytes, 0, $fileBytes.Length)
    $stream.Close()
}

# Add root files
Add-FileToZip $zip 'index.html' 'index.html'
Add-FileToZip $zip 'style.css' 'style.css'
Add-FileToZip $zip 'abase.txt' 'abase.txt'

# Add all JS files with forward slashes
Get-ChildItem -Path 'js' -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    $entryName = $relativePath.Replace('\', '/')
    Add-FileToZip $zip $_.FullName $entryName
}

# Add all audio files with forward slashes
Get-ChildItem -Path 'audio' -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    $entryName = $relativePath.Replace('\', '/')
    Add-FileToZip $zip $_.FullName $entryName
}

$zip.Dispose()
Write-Output 'ZIP created successfully with forward-slash paths'
