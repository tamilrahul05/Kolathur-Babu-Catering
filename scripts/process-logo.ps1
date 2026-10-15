Add-Type -AssemblyName System.Drawing

$srcFile = 'C:\Users\tamil\.gemini\antigravity-ide\brain\ba174ed1-10ed-4f9a-9308-d3a01855875f\.user_uploaded\media_1791990085809.png'
$destPng = Join-Path $PSScriptRoot '..\src\assets\images\logo.png'
$destJpg = Join-Path $PSScriptRoot '..\src\assets\images\logo.jpg'
$destIcon = Join-Path $PSScriptRoot '..\src\assets\images\logo-mark.png'

$bmp = [System.Drawing.Bitmap]::FromFile($srcFile)
$w = $bmp.Width
$h = $bmp.Height

# Bounding box of full content:
# Cloche top: around Y=334
# Bottom of text: around Y=696
# Left of B / Cloche: around X=182
# Right of text: around X=790
$minX = 180
$maxX = 795
$minY = 330
$maxY = 700

$cropW = $maxX - $minX
$cropH = $maxY - $minY

$croppedBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($croppedBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Flood fill outer white to transparent
# Use a queue to flood-fill transparent from the perimeter where pixel is white (R>245, G>245, B>245)
$visited = New-Object 'bool[,]' $cropW, $cropH
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Enqueue border pixels
for ($x = 0; $x -lt $cropW; $x++) {
    $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
    $queue.Enqueue((New-Object System.Drawing.Point($x, $cropH - 1)))
}
for ($y = 0; $y -lt $cropH; $y++) {
    $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
    $queue.Enqueue((New-Object System.Drawing.Point($cropW - 1, $y)))
}

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $px = $pt.X
    $py = $pt.Y
    if ($px -ge 0 -and $px -lt $cropW -and $py -ge 0 -and $py -lt $cropH) {
        if (-not $visited[$px, $py]) {
            $visited[$px, $py] = $true
            $col = $croppedBmp.GetPixel($px, $py)
            # If pixel is near-white or background color
            if ($col.R -gt 240 -and $col.G -gt 240 -and $col.B -gt 240) {
                $croppedBmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
                $queue.Enqueue((New-Object System.Drawing.Point($px + 1, $py)))
                $queue.Enqueue((New-Object System.Drawing.Point($px - 1, $py)))
                $queue.Enqueue((New-Object System.Drawing.Point($px, $py + 1)))
                $queue.Enqueue((New-Object System.Drawing.Point($px, $py - 1)))
            }
        }
    }
}

# Save transparent PNG
$croppedBmp.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Also save clean high-quality JPG with white background
$jpgBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$gJpg = [System.Drawing.Graphics]::FromImage($jpgBmp)
$gJpg.Clear([System.Drawing.Color]::White)
$gJpg.DrawImage($croppedBmp, 0, 0)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
$jpgBmp.Save($destJpg, $jpegCodec, $encoderParams)

# Also create mark-only icon (just the Cloche + B mark: X from 0 to about 205 in cropped coordinates)
$markW = 205
$markH = $cropH
$markBmp = New-Object System.Drawing.Bitmap($markW, $markH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gMark = [System.Drawing.Graphics]::FromImage($markBmp)
$gMark.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gMark.DrawImage($croppedBmp, 0, 0, (New-Object System.Drawing.Rectangle(0, 0, $markW, $markH)), [System.Drawing.GraphicsUnit]::Pixel)
$markBmp.Save($destIcon, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$gJpg.Dispose()
$gMark.Dispose()
$croppedBmp.Dispose()
$jpgBmp.Dispose()
$markBmp.Dispose()
$bmp.Dispose()

Write-Output "Successfully generated perfect transparent logo.png, logo.jpg, and logo-mark.png"
