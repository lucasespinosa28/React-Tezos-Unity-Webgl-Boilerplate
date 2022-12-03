npm run build

$Folder = '..\Assets\WebGLTemplates\ReactTemplate'
if (Test-Path -Path $Folder) {
    Remove-Item ..\Assets\WebGLTemplates\ReactTemplate  -r -fo
    Move-Item -Path build -Destination "..\Assets\WebGLTemplates\ReactTemplate" -Force
} else {
    Move-Item -Path build -Destination "..\Assets\WebGLTemplates\ReactTemplate" -Force
}
