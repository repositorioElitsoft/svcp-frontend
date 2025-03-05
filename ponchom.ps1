# run-poncho.ps1
# This script runs a series of poncho commands.

# Run the first command: poncho -s -f sector sectores
Write-Host "Executing: poncho -s -f agrupacion-comercial agrupaciones-comerciales"
try {
    poncho -s -f agrupacion-comercial agrupaciones-comerciales
} catch {
    Write-Error "Error executing 'poncho -s -f agrupacion-comercial agrupaciones-comerciales': $_"
}



Write-Host "Executing: poncho -s -f clasificacion-cliente clasificaciones-clientes"
try {
    poncho -s -f clasificacion-cliente clasificaciones-clientes
} catch {
    Write-Error "Error executing 'poncho -s -f clasificacion-cliente clasificaciones-clientes': $_"
}



Write-Host "Executing: poncho -s -f sector sectores"
try {
    poncho -s -f sector sectores
} catch {
    Write-Error "Error executing 'poncho -s -f sector sectores': $_"
}


Write-Host "Executing: poncho -s -f segmentacion-cliente segmentaciones-clientes"
try {
    poncho -s -f segmentacion-cliente segmentaciones-clientes
} catch {
    Write-Error "Error executing 'poncho -s -f segmentacion-cliente segmentaciones-clientes': $_"
}

Write-Host "Executing: poncho -s -f tarea tareas"
try {
    poncho -s -f tarea tareas
} catch {
    Write-Error "Error executing 'poncho -s -f tarea tareas': $_"
}

Write-Host "Executing: poncho -s -f tipo-cliente tipos-clientes"
try {
    poncho -s -f tipo-cliente tipos-clientes
} catch {
    Write-Error "Error executing 'poncho -s -f tipo-cliente tipos-clientes': $_"
}

Write-Host "Executing: poncho -s -f tipo-producto tipos-productos"
try {
    poncho -s -f tipo-producto tipos-productos
} catch {
    Write-Error "Error executing 'poncho -s -f tipo-producto tipo-productos': $_"
}

Write-Host "Executing: poncho -s -f tipo-empleado tipos-empleados"
try {
    poncho -s -f tipo-empleado tipos-empleados
} catch {
    Write-Error "Error executing 'poncho -s -f tipo-empleado tipo-empleados': $_"
}


# Run the second command: poncho -s -f tipo-servicio tipos-servicios
Write-Host "Executing: poncho -s -f tipo-servicio tipos-servicios"
try {
    poncho -s -f tipo-servicio tipos-servicios
} catch {
    Write-Error "Error executing 'poncho -s -f tipo-servicio tipos-servicios': $_"
}


Write-Host "Executing: poncho -s -f trabajo trabajos"
try {
    poncho -s -f trabajo trabajos
} catch {
    Write-Error "Error executing 'poncho -s -f trabajo trabajos': $_"
}

Write-Host "Executing: poncho -s -f zona zonas"
try {
    poncho -s -f zona zonas
} catch {
    Write-Error "Error executing 'poncho -s -f zona zonas': $_"
}


Write-Host "All commands executed."
