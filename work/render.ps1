param([string]$deck, [string]$outDir, [string]$pdf = "")
New-Item -ItemType Directory -Force $outDir | Out-Null
Get-ChildItem $outDir -Filter *.png | Remove-Item -Force
$pp = New-Object -ComObject PowerPoint.Application
$p = $pp.Presentations.Open($deck, -1, 0, 0)
foreach ($s in $p.Slides) { $s.Export((Join-Path $outDir ("s" + $s.SlideIndex + ".png")), "PNG", 1920, 1080) }
if ($pdf -ne "") { $p.SaveAs($pdf, 32) }
"exported " + $p.Slides.Count + " slides"
$p.Close(); $pp.Quit()
