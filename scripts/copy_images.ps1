Param(
    [Parameter(Mandatory=$false)]
    [string]$SourceBase = "C:\Users\anusr\OneDrive\Desktop\portfolio- works",
    [int]$Port = 5174,
    [switch]$Force
)

$repoRoot = (Resolve-Path "$PSScriptRoot\.." ).Path

$mappings = @{
    'best_works' = @{ dst = 'public/images/featured'; n = 5 }
    'scroll bar 1' = @{ dst = 'public/images/row1'; n = 5 }
    'scroll bar 2' = @{ dst = 'public/images/row2'; n = 5 }
    'capsules' = @{ dst = 'public/images/capsules'; n = 3 }
}

function Ensure-Dir($path){
    if (-not (Test-Path $path)){
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

Write-Output "Repository root: $repoRoot"
Write-Output "Source base: $SourceBase"
Write-Output "Dev server port (for HTTP checks): $Port"

foreach ($srcRel in $mappings.Keys) {
    $map = $mappings[$srcRel]
    $dstRel = $map.dst
    $take = $map.n

    $srcDir = Join-Path $SourceBase $srcRel
    if (-not (Test-Path $srcDir)){
        Write-Warning "Source folder not found: $srcDir -- skipping"
        continue
    }

    $dstDir = Join-Path $repoRoot $dstRel
    Ensure-Dir $dstDir

    $files = Get-ChildItem -Path $srcDir -Include *.svg,*.jpg,*.jpeg,*.png -File | Sort-Object LastWriteTime -Descending | Select-Object -First $take
    if (-not $files -or $files.Count -eq 0){
        Write-Warning "No image files found in $srcDir -- skipping"
        continue
    }

    $i = 1
    foreach ($f in $files){
        $ext = $f.Extension.ToLower()
        $destName = "$i$ext"
        $destPath = Join-Path $dstDir $destName

        if ((Test-Path $destPath) -and (-not $Force)){
            Write-Output "Skipping existing file: $destPath (use -Force to overwrite)"
        } else {
            Copy-Item -Path $f.FullName -Destination $destPath -Force
            Write-Output "Copied: $($f.Name) -> $dstRel/$destName"
        }
        $i++
    }

    Write-Output ("Files now in {0}:" -f $dstRel)
    Get-ChildItem -Path $dstDir -File | Sort-Object Name | ForEach-Object { Write-Output (" - {0}" -f $_.Name) }
    Write-Output ""
}

Write-Output "HTTP checks against dev server (this attempts a HEAD request for each copied file)."
foreach ($srcRel in $mappings.Keys) {
    $dstRel = $mappings[$srcRel].dst
    $dstDir = Join-Path $repoRoot $dstRel
    if (-not (Test-Path $dstDir)) { continue }
    $files = Get-ChildItem -Path $dstDir -File | Sort-Object Name
    foreach ($f in $files){
        $url = "http://localhost:$Port/images/$([uri]::EscapeUriString((Split-Path $dstRel -Leaf)))/$($f.Name)"
        try{
            $resp = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 10
            Write-Output "HTTP OK: $url -> $($resp.StatusCode)"
        } catch {
            Write-Warning "HTTP check failed: $url -> $($_.Exception.Message)"
        }
    }
}

Write-Output "Done. If files were copied, update `src/images/index.js` to point to the real filenames (e.g. 1.jpg, 2.jpg) if necessary, then restart the dev server and hard-refresh the browser."
