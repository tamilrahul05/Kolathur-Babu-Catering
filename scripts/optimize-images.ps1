Add-Type -AssemblyName System.Drawing

$srcDir = Join-Path $PSScriptRoot '..\src\assets\websiteimage\websiteimage'
$destDir = Join-Path $PSScriptRoot '..\src\assets\websiteimage\optimized'

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

Get-ChildItem $srcDir -Filter '*.JPG' | ForEach-Object {
    $srcPath = $_.FullName
    $destPath = Join-Path $destDir ($_.BaseName + '.jpg')
    
    $orig = [System.Drawing.Image]::FromFile($srcPath)
    $maxDim = 1600
    $w = $orig.Width
    $h = $orig.Height
    
    if ($w -gt $maxDim -or $h -gt $maxDim) {
        if ($w -gt $h) {
            $newW = $maxDim
            $newH = [int]($h * ($maxDim / $w))
        } else {
            $newH = $maxDim
            $newW = [int]($w * ($maxDim / $h))
        }
    } else {
        $newW = $w
        $newH = $h
    }
    
    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($orig, 0, 0, $newW, $newH)
    
    $bmp.Save($destPath, $jpegCodec, $encoderParams)
    
    $g.Dispose()
    $bmp.Dispose()
    $orig.Dispose()
    
    $outFileInfo = Get-Item $destPath
    Write-Output ('Optimized {0}: {1}x{2} -> {3} KB' -f $_.Name, $newW, $newH, [math]::Round($outFileInfo.Length / 1KB))
}
