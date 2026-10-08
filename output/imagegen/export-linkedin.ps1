# Export the imagegen cover artwork, excluding its disposable cyan sheet margins.
param(
  [string]$Source = 'C:\Users\Usuario\.codex\generated_images\01a1030f-8ff1-7db2-9736-b75bb5b82f5a\exec-a317ada5-0474-454b-91e0-af265fcff8ce.png',
  [string]$Destination = 'C:\Users\Usuario\vsexperience\assets\images\brand\banner-linkedin-v1.png'
)
Add-Type -AssemblyName System.Drawing
if (Test-Path -LiteralPath $Destination) { throw 'Preserve the existing export; choose a new destination.' }
$sheet = [System.Drawing.Bitmap]::new($Source)
$cover = $null
$graphics = $null
$attributes = $null
try {
  function Test-ExportMargin([System.Drawing.Color]$Color) {
    return ($Color.R -lt 80 -and $Color.G -gt 190 -and $Color.B -gt 190)
  }
  $first = 0
  while ($first -lt $sheet.Height -and (Test-ExportMargin $sheet.GetPixel(10, $first))) { $first++ }
  $last = $sheet.Height - 1
  while ($last -ge $first -and (Test-ExportMargin $sheet.GetPixel(10, $last))) { $last-- }
  $height = $last - $first + 1
  $width = $height * 4
  if ($height -lt 300 -or $width -gt $sheet.Width) { throw 'Unexpected cover bounds; inspect the generated sheet.' }
  # Trim only a few outer background pixels to make the artwork exactly 4:1.
  $left = [int][Math]::Floor(($sheet.Width - $width) / 2)
  $cover = [System.Drawing.Bitmap]::new(1584, 396)
  $cover.SetResolution(96, 96)
  $graphics = [System.Drawing.Graphics]::FromImage($cover)
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $attributes = [System.Drawing.Imaging.ImageAttributes]::new()
  $attributes.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
  $graphics.DrawImage($sheet, [System.Drawing.Rectangle]::new(0, 0, 1584, 396), $left, $first, $width, $height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
  $cover.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  $size = (Get-Item -LiteralPath $Destination).Length
  if ($size -ge 8MB) { throw 'Export exceeds the LinkedIn file size limit.' }
  [PSCustomObject]@{Path=$Destination;Width=$cover.Width;Height=$cover.Height;Bytes=$size;SourceCrop="$left,$first,$width,$height"}
} finally {
  if ($attributes) { $attributes.Dispose() }
  if ($graphics) { $graphics.Dispose() }
  if ($cover) { $cover.Dispose() }
  $sheet.Dispose()
}
