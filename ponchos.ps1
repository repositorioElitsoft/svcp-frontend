# run-poncho.ps1
# This script runs a series of poncho commands.

# Run the first command: poncho -s  sector sectores
Write-Host "Executing: poncho -s  agrupacion-comercial agrupaciones-comerciales"
try {
    poncho -s  agrupacion-comercial agrupaciones-comerciales
} catch {
    Write-Error "Error executing 'poncho -s  agrupacion-comercial agrupaciones-comerciales': $_"
}



Write-Host "Executing: poncho -s  clasificacion-cliente clasificaciones-clientes"
try {
    poncho -s  clasificacion-cliente clasificaciones-clientes
} catch {
    Write-Error "Error executing 'poncho -s  clasificacion-cliente clasificaciones-clientes': $_"
}



Write-Host "Executing: poncho -s  sector sectores"
try {
    poncho -s  sector sectores
} catch {
    Write-Error "Error executing 'poncho -s  sector sectores': $_"
}


Write-Host "Executing: poncho -s  segmentacion-cliente segmentaciones-clientes"
try {
    poncho -s  segmentacion-cliente segmentaciones-clientes
} catch {
    Write-Error "Error executing 'poncho -s  segmentacion-cliente segmentaciones-clientes': $_"
}

Write-Host "Executing: poncho -s  tarea tareas"
try {
    poncho -s  tarea tareas
} catch {
    Write-Error "Error executing 'poncho -s  tarea tareas': $_"
}

Write-Host "Executing: poncho -s  tipo-cliente tipos-clientes"
try {
    poncho -s  tipo-cliente tipos-clientes
} catch {
    Write-Error "Error executing 'poncho -s  tipo-cliente tipos-clientes': $_"
}

Write-Host "Executing: poncho -s  tipo-producto tipos-productos"
try {
    poncho -s  tipo-producto tipos-productos
} catch {
    Write-Error "Error executing 'poncho -s  tipo-producto tipo-productos': $_"
}

Write-Host "Executing: poncho -s  tipos-empleados tipos-empleados"
try {
    poncho -s  tipo-empleado tipos-empleados
} catch {
    Write-Error "Error executing 'poncho -s  tipo-empleado tipo-empleados': $_"
}


# Run the second command: poncho -s  tipo-servicio tipos-servicios
Write-Host "Executing: poncho -s  tipo-servicio tipos-servicios"
try {
    poncho -s  tipo-servicio tipos-servicios
} catch {
    Write-Error "Error executing 'poncho -s  tipo-servicio tipos-servicios': $_"
}


Write-Host "Executing: poncho -s  trabajo trabajos"
try {
    poncho -s  trabajo trabajos
} catch {
    Write-Error "Error executing 'poncho -s  trabajo trabajos': $_"
}

Write-Host "Executing: poncho -s  zona zonas"
try {
    poncho -s  zona zonas
} catch {
    Write-Error "Error executing 'poncho -s  zona zonas': $_"
}


Write-Host "All commands executed."
