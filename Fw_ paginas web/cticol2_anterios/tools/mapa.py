#!/usr/bin/env python3
"""Genera datos/mapa.json (contorno de Colombia y países vecinos en SVG).

Fuente: Natural Earth 1:50m (dominio público) empaquetado en world-atlas@2.0.2:
  curl -sL -o countries-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
  python3 tools/mapa.py countries-50m.json

Solo hace falta ejecutarlo una vez; build.py proyecta las ciudades con los mismos parámetros.
"""
import json, math, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
# Ventana geográfica (lon/lat) y proyección equirectangular con corrección por coseno.
LON_MIN, LON_MAX, LAT_MIN, LAT_MAX = -80.2, -66.0, -4.6, 13.2
ANCHO = 600
COS = math.cos(math.radians(4.3))
ESCALA = ANCHO / ((LON_MAX - LON_MIN) * COS)
ALTO = round((LAT_MAX - LAT_MIN) * ESCALA)
VECINOS = {'Venezuela', 'Ecuador', 'Peru', 'Brazil', 'Panama'}


def proyectar(lon, lat):
    return ((lon - LON_MIN) * COS * ESCALA, (LAT_MAX - lat) * ESCALA)


def main(ruta):
    topo = json.loads(Path(ruta).read_text())
    sx, sy = topo['transform']['scale']
    tx, ty = topo['transform']['translate']
    arcos = []
    for arco in topo['arcs']:
        x = y = 0
        pts = []
        for dx, dy in arco:
            x += dx; y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcos.append(pts)

    def anillo(indices):
        pts = []
        for i in indices:
            a = arcos[i] if i >= 0 else arcos[~i][::-1]
            pts.extend(a if not pts else a[1:])
        return pts

    def trazo(geom, umbral=0.6):
        polis = geom['arcs'] if geom['type'] == 'MultiPolygon' else [geom['arcs']]
        partes = []
        for poli in polis:
            for ring in poli:
                pts = [proyectar(lon, lat) for lon, lat in anillo(ring)]
                # Simplificación ligera: descarta puntos a menos de `umbral` px del anterior.
                limpio = [pts[0]]
                for p in pts[1:]:
                    if math.dist(p, limpio[-1]) >= umbral:
                        limpio.append(p)
                if len(limpio) < 4:
                    continue
                partes.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in limpio) + 'Z')
        return ''.join(partes)

    col, vec = '', ''
    for g in topo['objects']['countries']['geometries']:
        nombre = g.get('properties', {}).get('name')
        if nombre == 'Colombia':
            col = trazo(g)
        elif nombre in VECINOS:
            vec += trazo(g, 2.5)
    salida = {
        'fuente': 'Natural Earth 1:50m (dominio público), vía world-atlas@2.0.2',
        'ancho': ANCHO, 'alto': ALTO,
        'proyeccion': {'lonMin': LON_MIN, 'latMax': LAT_MAX, 'cos': COS, 'escala': ESCALA},
        'colombia': col, 'vecinos': vec,
    }
    (RAIZ / 'datos' / 'mapa.json').write_text(json.dumps(salida, ensure_ascii=False))
    print('datos/mapa.json', ANCHO, ALTO, len(col), len(vec))


if __name__ == '__main__':
    main(sys.argv[1])
