#!/usr/bin/env python3
"""Optimiza las fotografías y regenera la galería de index.html.

Uso (desde la carpeta tresmarias/):
    python3 tools/imagenes.py

Requiere Pillow (pip install pillow). Lee los originales de _originales/,
escribe WebP en assets/images/<carpeta>/<id>-<ancho>.webp, actualiza
assets/images/inventario.json y reemplaza el bloque de la galería en
index.html (entre <!-- galeria:inicio --> y <!-- galeria:fin -->).

También reescribe src/srcset/width/height de las demás <img> de index.html
con las variantes que existan en disco (el atributo sizes se respeta).

Para cambiar o añadir una foto: copia el original a _originales/, edita la
lista FOTOS y vuelve a ejecutar el script.
"""
import html
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / '_originales'
SALIDA = RAIZ / 'assets' / 'images'
ANCHOS = (400, 640, 960, 1280)
# Fotos que se usan a pantalla completa: también se generan a 1920 px.
PANORAMICAS = {'hero-frailejon', 'laguna-valle'}

# tipo:
#   'ilustrativa' -> foto de referencia de una cabaña cualquiera; NO es Las Tres Marías.
#   'referencia'  -> paisaje de páramo real cuyo lugar exacto no está confirmado.
#   'propia'      -> foto real de la propiedad o del lugar (aún no hay ninguna).
# fuente: procedencia conocida. Ninguna foto recibida trae autor ni licencia.
FOTOS = [
    # --- La cabaña (ilustrativas) ---
    ('fachada-1', 'fachada_exterior_1.jpeg', 'cabin', 'cabana', 'ilustrativa',
     'Cabaña de dos pisos con fachada oscura, balcón y sendero de piedra sobre el césped, rodeada de árboles',
     'Fachada con balcón'),
    ('fachada-2', 'fachada_exterior_2.jpeg', 'cabin', 'cabana', 'ilustrativa',
     'Cabaña de madera elevada con pérgola y escalera, en un claro del bosque al atardecer',
     'Cabaña entre árboles'),
    ('fachada-3', 'fachada_exterior_3.jpeg', 'cabin', 'cabana', 'ilustrativa',
     'Cabaña de techo a dos aguas con gran ventanal de vidrio, helechos y una guirnalda de luces',
     'Ventanal a dos aguas'),
    ('terraza', 'balcon_3.jpeg', 'cabin', 'exteriores', 'ilustrativa',
     'Terraza de madera con hamaca, mesa para dos y vista a montañas verdes',
     'Terraza con hamaca'),
    # --- Habitaciones ---
    ('habitacion-principal', 'habitacion_principal.jpeg', 'bedrooms', 'habitaciones', 'ilustrativa',
     'Habitación de madera con cama doble, cobijas tejidas, tapete claro y ventanal',
     'Habitación principal'),
    ('habitacion-familiar', 'habitacion_familiar.jpeg', 'bedrooms', 'habitaciones', 'ilustrativa',
     'Habitación de madera con dos camas sencillas, mesa de noche con lámpara y una butaca',
     'Habitación con dos camas'),
    # --- Baños ---
    ('bano-1', 'baño_1.jpeg', 'bathrooms', 'banos', 'ilustrativa',
     'Baño con muros de piedra oscura, ducha de vidrio, lavamanos de piedra y repisas de madera',
     'Baño en piedra'),
    ('bano-2', 'bano_2.jpeg', 'bathrooms', 'banos', 'ilustrativa',
     'Baño con techo de madera, espejo redondo, mueble de lavamanos y ducha de vidrio',
     'Baño con techo de madera'),
    # --- Sala, cocina y comedor ---
    ('sala-1', 'sala.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Sala con sofá en L frente a una chimenea de piedra y ventanales hacia las montañas',
     'Sala con chimenea'),
    ('sala-2', 'comedor_2.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Sala de doble altura con chimenea encendida, sofá claro y ventanales hacia un bosque de pinos',
     'Sala de doble altura'),
    ('cocina-1', 'cocina_1.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Cocina sencilla de madera clara con nevera, lavaplatos y cafetera',
     'Cocina sencilla'),
    ('cocina-2', 'cocina_2.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Cocina de madera con barra, lámparas colgantes y ventana al bosque',
     'Cocina con barra'),
    ('cocina-3', 'cocina_3.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Cocina abierta de madera con comedor, butacos y nevera de acero',
     'Cocina abierta'),
    ('comedor-1', 'comedor.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Comedor junto a la ventana con mesa de madera puesta y un sofá con cojines',
     'Comedor junto a la ventana'),
    ('comedor-2', 'comedor_3.jpeg', 'interiors', 'sala-cocina', 'ilustrativa',
     'Comedor de madera para seis personas con lámpara colgante y ventanales',
     'Comedor para compartir'),
    # --- Paisajes ---
    ('hero-frailejon', 'Frailejones1.jpeg', 'hero', 'lagunas-paramo', 'referencia',
     'Frailejón en flor junto a una laguna de páramo que refleja las nubes y las montañas',
     'Frailejón junto a la laguna'),
    ('laguna-valle', 'Lagunas8.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna oscura al pie de montañas rocosas cubiertas de vegetación de páramo',
     'Laguna entre roca'),
    ('lagunas-aerea', 'Lagunas-aerea.jpeg', 'landscapes', 'paisajes', 'referencia',
     'Vista aérea de dos lagunas sobre una cumbre de páramo, con cordilleras al fondo',
     'Lagunas desde el aire'),
    ('via-montana', 'paisaje1.jpeg', 'landscapes', 'paisajes', 'referencia',
     'Carretera que serpentea por una montaña verde bajo nubes densas, con antenas en la cima',
     'Carretera entre nubes'),
    ('llanura-frailejones', 'picacho1.jpeg', 'landscapes', 'paisajes', 'referencia',
     'Llanura cubierta de frailejones con dos pequeñas lagunas y montañas bajo cielo azul',
     'Llanura de frailejones'),
    ('valle-verde', 'Caminatas12.jpeg', 'landscapes', 'paisajes', 'referencia',
     'Potreros verdes en una ladera de montaña con nubes bajas sobre el valle',
     'Ladera verde'),
    ('valle-niebla', 'Caminatas8.jpeg', 'landscapes', 'paisajes', 'referencia',
     'Valle verde con arbustos dispersos y la niebla cubriendo la parte alta de la montaña',
     'Niebla sobre el valle'),
    ('crestas', 'Caminatas5.jpeg', 'landscapes', 'paisajes', 'referencia',
     'Montañas de roca gris sobre un pajonal con frailejones; dos caminantes se ven pequeños',
     'Crestas de roca'),
    ('laguna-isla', 'Lagunas11.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna azul intenso con pequeñas islas rocosas y montañas bajo cielo despejado',
     'Laguna con islotes'),
    ('laguna-arbol', 'Lagunas12.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Árbol solitario de ramas retorcidas frente a una laguna que refleja el cielo',
     'Árbol junto a la laguna'),
    ('laguna-pequena', 'Lagunas13.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Pequeña laguna clara en el fondo de un valle de páramo entre nubes',
     'Laguna en el valle'),
    ('laguna-reflejo', 'Lagunas2.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna turquesa que refleja nubes, rodeada de pajonal dorado y frailejones',
     'Reflejo turquesa'),
    ('laguna-flor', 'Lagunas3.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejón con flores en primer plano frente a una laguna entre montañas',
     'Flores de frailejón'),
    ('laguna-ramificada', 'Lagunas4.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna de forma irregular con islotes vista desde lo alto, entre montañas',
     'Laguna con brazos'),
    ('laguna-roca', 'Lagunas5.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna alargada entre colinas rocosas bajo nubes y cielo azul',
     'Laguna entre colinas'),
    ('laguna-turquesa', 'Lagunas6.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna de agua oscura y turquesa encajonada entre laderas, vista desde una roca',
     'Laguna encajonada'),
    ('laguna-gris', 'Lagunas7.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna en día nublado con frailejones en la orilla rocosa',
     'Día gris en la laguna'),
    ('laguna-canon', 'Lagunas9.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna pequeña entre paredes de roca y montañas áridas',
     'Laguna entre paredes'),
    ('laguna-niebla', 'Lagunas10.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna oscura entre rocas cubiertas de musgo con niebla sobre las laderas',
     'Laguna en la niebla'),
    ('frailejones-laguna', 'Frailejones10.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejón en primer plano y laguna azul entre rocas al fondo',
     'Frailejón y laguna azul'),
    ('frailejon-azul', 'Frailejones11.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Silueta de un frailejón en una luz azul y fría, con una laguna y nubes al fondo',
     'Luz fría del páramo'),
    ('frailejon-rocio', 'Frailejones12', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejón cubierto de rocío sobre una roca, con pequeñas lagunas detrás',
     'Rocío en las hojas'),
    ('frailejones-turquesa', 'Frailejones2.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejones junto a una laguna turquesa con montañas rocosas',
     'Frailejones en la orilla'),
    ('frailejon-flores', 'Frailejones3.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejón con varias flores en primer plano y montañas entre nubes',
     'Frailejón florecido'),
    ('frailejones-campo', 'Frailejones4.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Grupo de frailejones florecidos frente a una laguna y montañas oscuras',
     'Campo de frailejones'),
    ('laguna-verde', 'Frailejones5.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Laguna verde rodeada de frailejones amarillos y montañas rocosas',
     'Laguna verde'),
    ('frailejones-ladera', 'Frailejones6.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejones altos en una ladera empinada con niebla',
     'Ladera con niebla'),
    ('frailejones-pradera', 'Frailejones7.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejones de tronco alto en una pradera junto a una laguna',
     'Frailejones de tronco alto'),
    ('flores-amarillas', 'Frailejones8.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Arbusto de flores amarillas y frailejones junto a una laguna bajo la niebla',
     'Flores amarillas'),
    ('frailejones-orilla', 'Frailejones9.jpeg', 'landscapes', 'lagunas-paramo', 'referencia',
     'Frailejones sobre rocas en la orilla de una laguna en un día nublado',
     'Orilla con frailejones'),
    # --- Actividades ---
    ('grupo-lagunas', 'Caminatas1.jpeg', 'activities', 'actividades', 'referencia',
     'Grupo de caminantes con chaquetas de colores posando entre dos lagunas de páramo',
     'Grupo entre lagunas'),
    ('caminante-laguna', 'Caminatas10.jpeg', 'activities', 'actividades', 'referencia',
     'Caminantes con morral bajando por el pajonal hacia una laguna entre rocas',
     'Bajando a la laguna'),
    ('caminantes-cascada', 'Caminatas11.jpeg', 'activities', 'actividades', 'referencia',
     'Grupo de caminantes en un sendero de páramo con una cascada al fondo',
     'Sendero con cascada'),
    ('caminantes-planicie', 'Caminatas13.jpeg', 'activities', 'actividades', 'referencia',
     'Fila de caminantes cruzando una planicie de páramo bajo un cielo azul',
     'Cruzando la planicie'),
    ('caminante-frailejones', 'Caminatas14.jpeg', 'activities', 'actividades', 'referencia',
     'Caminante con morral rojo y sombrero entre frailejones, frente a crestas rocosas',
     'Entre frailejones'),
    ('cumbre-nubes', 'Caminatas2.jpeg', 'activities', 'actividades', 'referencia',
     'Personas celebrando en una cumbre por encima de un mar de nubes',
     'Sobre las nubes'),
    ('brazos-abiertos', 'Caminatas3.jpeg', 'activities', 'actividades', 'referencia',
     'Persona con los brazos abiertos sobre una roca rodeada de niebla y frailejones',
     'Brazos abiertos'),
    ('caminante-bosque', 'Caminatas4.jpeg', 'activities', 'actividades', 'referencia',
     'Caminante con morral azul en un sendero entre arbustos, mirando montañas con nubes',
     'Sendero entre arbustos'),
    ('caminantes-orilla', 'Caminatas6.jpeg', 'activities', 'actividades', 'referencia',
     'Caminantes por la orilla de una laguna gris en un día nublado',
     'Por la orilla'),
    ('descanso-rocas', 'Caminatas7.jpeg', 'activities', 'actividades', 'referencia',
     'Caminantes descansando al pie de dos grandes rocas redondeadas entre la niebla',
     'Descanso entre rocas'),
    ('cima-rocosa', 'Caminatas9.jpeg', 'activities', 'actividades', 'referencia',
     'Tres caminantes subiendo una cima rocosa envuelta en niebla',
     'Subiendo la cima'),
]

# Fotos recibidas que no se publican, y por qué (queda en el inventario).
EXCLUIDAS = {
    'balcon_1.jpeg': 'Muestra montañas nevadas alpinas: daría una idea falsa del lugar.',
    'balcon_2.jpeg': 'Muestra un jacuzzi; no está confirmado que la cabaña lo tenga.',
}

ETIQUETA = {
    'ilustrativa': 'Foto ilustrativa, no es la cabaña',
    'referencia': 'Paisaje de referencia, lugar por confirmar',
    'propia': '',
}


def optimizar(origen, carpeta, ident):
    im = ImageOps.exif_transpose(Image.open(origen)).convert('RGB')
    destino = SALIDA / carpeta
    destino.mkdir(parents=True, exist_ok=True)
    anchos = ANCHOS + ((1600, 1920) if ident in PANORAMICAS else ())
    hechos = []
    for ancho in anchos:
        w = min(ancho, im.width)
        if hechos and w <= hechos[-1][1]:
            continue
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(destino / f'{ident}-{ancho}.webp', 'WEBP', quality=78, method=6)
        hechos.append((ancho, w, h))
    return im.width, im.height, hechos


def hero_movil():
    """Recorte vertical (9:16) del hero para pantallas angostas: menos peso y mejor encuadre."""
    im = ImageOps.exif_transpose(Image.open(ORIG / 'Frailejones1.jpeg')).convert('RGB')
    w = round(im.height * 9 / 16)
    x0 = round((im.width - w) * 0.62)  # mismo encuadre que object-position: 62% en el CSS
    recorte = im.crop((x0, 0, x0 + w, im.height))
    for ancho in (480, 768):
        h = round(recorte.height * ancho / recorte.width)
        recorte.resize((ancho, h), Image.LANCZOS).save(SALIDA / 'hero' / f'hero-frailejon-movil-{ancho}.webp', 'WEBP', quality=74, method=6)


def variantes(src):
    """Variantes en disco de una imagen 'assets/images/<carpeta>/<id>-<ancho>.webp' -> [(ruta, w, h)]."""
    m = re.match(r'assets/images/([\w-]+)/([\w-]+?)-(\d+)\.webp$', src)
    if not m:
        return []
    carpeta, ident = m.group(1), m.group(2)
    salida = []
    for f in SALIDA.joinpath(carpeta).glob(f'{ident}-*.webp'):
        if not re.fullmatch(re.escape(ident) + r'-\d+\.webp', f.name):
            continue
        with Image.open(f) as im:
            salida.append((f'assets/images/{carpeta}/{f.name}', im.width, im.height))
    return sorted(salida, key=lambda x: x[1])


def actualizar_srcsets(texto):
    """Reescribe src, srcset, width y height de cada <img> local con todas las variantes existentes.
    El hero (fetchpriority) y las imágenes sin srcset se dejan como están."""
    def cambiar(m):
        tag = m.group(0)
        if 'fetchpriority' in tag or 'srcset=' not in tag:
            return tag
        src = re.search(r'\ssrc="([^"]+)"', tag).group(1)
        vs = variantes(src)
        if not vs:
            return tag
        base = next((v for v in vs if v[1] >= 600), vs[-1])
        tag = re.sub(r'\ssrc="[^"]+"', f' src="{base[0]}"', tag)
        tag = re.sub(r'\ssrcset="[^"]+"', ' srcset="' + ', '.join(f'{r} {w}w' for r, w, _ in vs) + '"', tag)
        tag = re.sub(r'\swidth="\d+"', f' width="{base[1]}"', tag)
        tag = re.sub(r'\sheight="\d+"', f' height="{base[2]}"', tag)
        return tag
    texto = re.sub(r'<img\b[^>]*>', cambiar, texto, flags=re.S)

    # data-full (foto ampliada del visor) -> la variante más grande que exista.
    def ampliada(m):
        vs = variantes(m.group(1))
        return f'data-full="{vs[-1][0]}"' if vs else m.group(0)
    return re.sub(r'data-full="([^"]+)"', ampliada, texto)


def og_image():
    im = ImageOps.exif_transpose(Image.open(ORIG / 'Frailejones1.jpeg')).convert('RGB')
    ImageOps.fit(im, (1200, 630), centering=(0.5, 0.55)).save(SALIDA / 'og-tres-marias.jpg', quality=82)


def figura(f):
    ident, _, carpeta, cat, tipo, alt, titulo, hechos = f
    base = f'assets/images/{carpeta}/{ident}'
    srcset = ', '.join(f'{base}-{a}.webp {w}w' for a, w, _ in hechos)
    a0, w0, h0 = next((x for x in hechos if x[0] == 640), hechos[-1])
    full = f'{base}-{hechos[-1][0]}.webp'
    etiqueta = ETIQUETA[tipo]
    return (
        f'          <figure class="g-item" data-cat="{cat}">\n'
        f'            <button type="button" class="g-open" data-full="{full}" data-tipo="{tipo}" '
        f'aria-label="Ampliar: {html.escape(titulo)}">\n'
        f'              <img src="{base}-{a0}.webp" srcset="{srcset}" sizes="(min-width: 1400px) 420px, (min-width: 1200px) 370px, (min-width: 576px) 46vw, 92vw" '
        f'width="{w0}" height="{h0}" alt="{html.escape(alt)}" loading="lazy" decoding="async">\n'
        f'            </button>\n'
        f'            <figcaption>{html.escape(titulo)}'
        + (f' <span class="photo-note">{etiqueta}</span>' if etiqueta else '')
        + '</figcaption>\n'
        f'          </figure>'
    )


def main():
    filas, inventario = [], []
    for ident, archivo, carpeta, cat, tipo, alt, titulo in FOTOS:
        w, h, hechos = optimizar(ORIG / archivo, carpeta, ident)
        filas.append((ident, archivo, carpeta, cat, tipo, alt, titulo, hechos))
        inventario.append({
            'id': ident, 'original': archivo, 'archivos': [f'assets/images/{carpeta}/{ident}-{a}.webp' for a, _, _ in hechos],
            'categoria': cat, 'tipo': tipo, 'alt': alt, 'tamano_original': f'{w}x{h}',
            'fuente': 'Recibida del cliente sin autor ni licencia', 'licencia': 'Por verificar antes de publicar',
        })
    for archivo, motivo in EXCLUIDAS.items():
        inventario.append({'original': archivo, 'excluida': motivo})
    og_image()
    hero_movil()
    (SALIDA / 'inventario.json').write_text(json.dumps(inventario, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    index = RAIZ / 'index.html'
    if index.exists():
        texto = index.read_text(encoding='utf-8')
        bloque = '\n'.join(figura(f) for f in filas)
        texto = re.sub(r'(<!-- galeria:inicio -->).*?(\s*<!-- galeria:fin -->)',
                       lambda m: m.group(1) + '\n' + bloque + m.group(2), texto, flags=re.S)
        index.write_text(actualizar_srcsets(texto), encoding='utf-8')
    print(f'{len(filas)} fotos optimizadas; {len(EXCLUIDAS)} excluidas.')


if __name__ == '__main__':
    main()
