#!/usr/bin/env bash
# Regenera todas las fotografías de las tres demos (requiere internet y Pillow).
# Uso: bash tools/descargar_todo.sh   (desde la carpeta eventos/)
set -euo pipefail
cd "$(dirname "$0")/.."
f() { python3 tools/fotos.py usar "$@"; }

# Villa Jardín
P=villa-jardin
f photo-1759490821541-f78bb13a752d --proyecto $P --slot hero --ratio 3:2 --anchos 960,1600,2400 --foco 0.5,0.6 --alt "Casa de campo con escalinata entre jardines y sillas de madera dispuestas para una ceremonia al aire libre"
f photo-1762216444731-802dcf3da009 --proyecto $P --slot concepto --ratio 4:5 --anchos 640,1100 --alt "Jardín amplio con árboles altos y, al fondo, sillas para una ceremonia"
f photo-1764593821339-6be7cb85e7f6 --proyecto $P --slot ev-matrimonio --ratio 4:5 --anchos 560,900 --alt "Invitados sentados en sillas de madera durante una ceremonia bajo los árboles"
f photo-1759124650342-b283fa8461fa --proyecto $P --slot ev-quince --ratio 4:5 --anchos 560,900 --alt "Mesa redonda con mantel marfil y centro de flores de colores sobre el césped"
f photo-1660511057210-f7fba78d2741 --proyecto $P --slot ev-bautizo --ratio 4:5 --anchos 560,900 --alt "Centro de mesa de rosas blancas entre velas y copas"
f photo-1478146059778-26028b07395a --proyecto $P --slot ev-cumple --ratio 4:5 --anchos 560,900 --alt "Mesa de postres con torta, velas y flores"
f photo-1707333512379-8f70ad28dca4 --proyecto $P --slot ev-empresa --ratio 4:5 --anchos 560,900 --alt "Mesas con manteles blancos y candelabros en un jardín al atardecer"
f photo-1781268520671-6b59d4c6d83b --proyecto $P --slot g-columna --ratio 2:3 --anchos 600,1000 --alt "Columna de flores blancas junto a una cerca de madera"
f photo-1469371670807-013ccf25f16a --proyecto $P --slot g-pasillo --ratio 2:3 --anchos 600,1000 --alt "Pasillo de ceremonia flanqueado por arreglos de rosas y sillas doradas"
f photo-1515934751635-c81c6bc9a2d8 --proyecto $P --slot g-anillos --ratio 1:1 --anchos 600,1000 --alt "Argollas de matrimonio sobre un ramo de peonías"
f photo-1550005809-91ad75fb315f --proyecto $P --slot g-ramo --ratio 2:3 --anchos 600,1000 --foco 0.45,0.5 --alt "Novia sosteniendo un ramo de flores pálidas junto al novio"
f photo-1792545409769-252a09d39fd7 --proyecto $P --slot g-cortinas --ratio 3:2 --anchos 800,1300 --alt "Telas blancas y follaje colgando de una estructura en el jardín"
f photo-1679526758968-23952a1bece9 --proyecto $P --slot g-ceremonia --ratio 3:2 --anchos 800,1300 --alt "Sillas blancas y grandes arreglos florales en un patio preparado para una ceremonia"
f photo-1737682599438-319b61711b5f --proyecto $P --slot g-mesa --ratio 2:3 --anchos 600,1000 --alt "Mesa larga con camino de flores rosadas y sillas blancas"
f photo-1641996250159-9d2bbfb483fa --proyecto $P --slot exp-pergola --ratio 4:5 --anchos 600,1000 --alt "Pérgola cubierta de follaje con esferas de vidrio colgantes sobre las mesas"
f photo-1632316962873-47ee3d309f02 --proyecto $P --slot exp-recepcion --ratio 4:5 --anchos 600,1000 --alt "Recepción al aire libre con mesas redondas, flores y sillas blancas"
f photo-1522673607200-164d1b6ce486 --proyecto $P --slot exp-sillas --ratio 4:5 --anchos 600,1000 --alt "Dos sillas decoradas con flores sobre el césped"
f photo-1759954644836-a57275881ded --proyecto $P --slot cierre --ratio 3:2 --anchos 960,1600,2400 --alt "Arco blanco y filas de sillas sobre el césped de un jardín"

# Finca La Cruz
P=finca-la-cruz
f photo-1665607437981-973dcd6a22bb --proyecto $P --slot hero --ratio 4:5 --anchos 640,1000,1400 --alt "Mesas largas de madera con flores y sillas blancas bajo una pérgola"
f photo-1758810409666-b091b8682bc1 --proyecto $P --slot hero-baile --ratio 1:1 --anchos 480,800 --alt "Invitadas bailando al aire libre durante una celebración"
f photo-1680695779444-24fc71296e66 --proyecto $P --slot intro --ratio 3:2 --anchos 800,1400 --alt "Mesas preparadas con flores entre la vegetación"
f photo-1768767289640-6a79085a9895 --proyecto $P --slot social-cumple --ratio 4:5 --anchos 560,900 --alt "Familia celebrando un cumpleaños infantil con globos y tortas"
f photo-1527529482837-4698179dc6ce --proyecto $P --slot social-brindis --ratio 4:5 --anchos 560,900 --alt "Invitados brindando en una mesa decorada con luces"
f photo-1612599542558-f3022089fb38 --proyecto $P --slot social-boda --ratio 4:5 --anchos 560,900 --alt "Recién casados celebrando con sus invitados en un jardín"
f photo-1681657687044-9bde75edb38e --proyecto $P --slot social-cena --ratio 4:5 --anchos 560,900 --alt "Amigos conversando alrededor de una mesa con comida"
f photo-1515187029135-18ee286d815b --proyecto $P --slot emp-taller --ratio 3:2 --anchos 800,1300 --alt "Grupo de personas conversando durante un taller de trabajo"
f photo-1503428593586-e225b39bddfe --proyecto $P --slot emp-notas --ratio 4:5 --anchos 560,900 --alt "Asistentes tomando notas durante una charla"
f photo-1779361525614-2daa01ed2607 --proyecto $P --slot m-luces --ratio 3:2 --anchos 800,1300 --alt "Casa con guirnaldas de luces y mesa servida en el patio"
f photo-1513507544439-d2cd3d79b274 --proyecto $P --slot m-bosque --ratio 3:2 --anchos 800,1300 --alt "Mesa con mantel blanco y sillas de madera en medio de un bosque"
f photo-1707333514312-39cf7658479c --proyecto $P --slot m-pergola --ratio 4:5 --anchos 600,1000 --alt "Pérgola iluminada con luces cálidas sobre mesas de banquete"
f photo-1511795409834-ef04bbd61622 --proyecto $P --slot m-rustica --ratio 4:5 --anchos 600,1000 --alt "Mesa de madera con flores, copas y platos"
f photo-1783818412534-370b60b8a1d8 --proyecto $P --slot m-copas --ratio 4:5 --anchos 600,1000 --alt "Mesa con copas ámbar y sillas de rejilla"
f photo-1555244162-803834f70033 --proyecto $P --slot m-buffet --ratio 3:2 --anchos 800,1300 --alt "Bandejas de comida en un servicio de buffet"
f photo-1790858312214-38d8ff197906 --proyecto $P --slot m-casa --ratio 3:2 --anchos 800,1300 --alt "Personas descansando en el césped frente a una casa con luces colgantes"
f photo-1561593367-66c79c2294e6 --proyecto $P --slot cierre --ratio 3:2 --anchos 960,1600 --alt "Mesa larga con flores y copas en una celebración nocturna"

# Alquieventos
P=alquieventos
f photo-1775476793931-cb484f197760 --proyecto $P --slot hero --ratio 3:2 --anchos 960,1600,2400 --alt "Carpa de banquete con mesas redondas, manteles y sillas de madera"
p() { f "$1" --proyecto $P --slot "$2" --ratio 4:3 --anchos 480,800 --foco "${4:-0.5,0.5}" --alt "$3"; }
p photo-1695393386569-cf141ff2c552 p-carpa-mastiles "Carpa blanca de mástiles instalada sobre césped" 0.5,0.55
p photo-1785858037852-f60925488591 p-carpa-estrella "Carpa tipo estrella sobre una colina"
p photo-1768179123386-a86a85f1c35c p-carpa-campo "Carpa blanca de techo alto montada en un campo con árboles" 0.5,0.6
p photo-1464366400600-7168b8af9bc3 p-carpa-banquete "Interior de una carpa con mesas vestidas para banquete"
p photo-1712764995305-75422fbe0ecc p-mesa-redonda "Mesas redondas con mantel en un jardín" 0.5,0.65
p photo-1769812343322-f4a6e73c8aa7 p-mesa-imperial "Mesa imperial de madera con camino de flores blancas"
p photo-1762765684665-6b6855bb6fe6 p-mesa-banquete "Mesas rectangulares largas con manteles blancos en un salón"
p photo-1737111820333-ac17f9196bfe p-silla-crossback "Fila de sillas de madera con respaldo en cruz"
p photo-1784450441669-2d536cf3c395 p-silla-tiffany "Sillas transparentes alrededor de una mesa decorada"
p photo-1782567530577-98d75b4bcb88 p-silla-plegable "Filas de sillas plegables sobre césped frente a una tarima" 0.5,0.65
p photo-1777282889677-19fe13252abf p-silla-apilable "Sillas apilables de estructura metálica"
p photo-1675171155224-e70a5eeb27c3 p-tarima-techo "Tarima con techo de estructura metálica al aire libre" 0.6,0.5
p photo-1759306221569-028a35bc8c66 p-tarima-truss "Montaje con estructura de luces, tarima y filas de mesas"
p photo-1766393195987-912865cbb81b p-lounge "Sala lounge con sofás blancos y cojines en un evento al aire libre"
p photo-1769812343786-c8cdbd73f3cd p-chester "Sofás capitoné verdes con arreglos de flores blancas"
p photo-1751040956411-5ba34e6d8237 p-sillones "Par de sillones capitoné blancos junto a una chimenea"
f photo-1519167758481-83f550bb49b3 --proyecto $P --slot g-salon --ratio 3:2 --anchos 800,1300 --alt "Salón con mesas redondas y sillas doradas"
f photo-1511578314322-379afb476865 --proyecto $P --slot g-auditorio --ratio 3:2 --anchos 800,1300 --alt "Salón para conferencias con mesas redondas y pantallas"
f photo-1790306816602-03b308f14a31 --proyecto $P --slot g-campo --ratio 3:2 --anchos 800,1300 --alt "Tarima y carpas blancas en un campo durante un evento"
f photo-1779637770150-f1ad3a80a635 --proyecto $P --slot g-lago --ratio 3:2 --anchos 800,1300 --alt "Carpa blanca junto a un lago, rodeada de árboles"
f photo-1769812343580-6f1547a2b076 --proyecto $P --slot g-negro --ratio 3:2 --anchos 800,1300 --alt "Mesas negras con flores blancas y sillas de rejilla"
f photo-1762765685319-fdaf8d22085d --proyecto $P --slot g-banquete --ratio 3:2 --anchos 800,1300 --alt "Salón con mesas largas y sillas doradas"
