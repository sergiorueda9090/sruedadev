"""Datos que entrega el negocio: plantilla para llenar en Excel e importación al catálogo.

    python3 tools/datos_negocio.py plantilla   # crea datos-del-negocio/productos.csv y negocio.csv (no sobrescribe)
    python3 tools/datos_negocio.py importar    # lee los CSV llenos y genera js/fichas.js

- Los CSV usan ";" y UTF-8 con BOM: se abren directo en Excel en español.
- La plantilla sale pre-llenada con lo que ya está confirmado (medidas, motor, cilindraje, edad…).
- Una celda vacía NO borra nada: simplemente no se publica ese dato.
- js/fichas.js se carga después de js/datos.js en todas las páginas y aplica los datos encima.
  Así js/datos.js (fotos, colores, descripciones) no se toca.
"""
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CARPETA = RAIZ / "datos-del-negocio"
CSV_PRODUCTOS = CARPETA / "productos.csv"
CSV_NEGOCIO = CARPETA / "negocio.csv"
SALIDA = RAIZ / "js" / "fichas.js"

# columna del CSV -> (destino, ayuda). destino: "p.<campo>" en el producto o "s.<campo>" en specs
COLUMNAS = [
    ("ref_actual", None, "No cambiar: clave con la que está hoy en el catálogo"),
    ("producto", None, "Solo de referencia (no se importa)"),
    ("ref_definitiva", "p.ref", "Referencia comercial real; vacío = se queda la actual"),
    ("precio_cop", "p.precio", "Precio al público en pesos, solo números (ej. 1250000)"),
    ("disponible", "p.disponible", "si / no"),
    ("marca", "p.marca", ""),
    ("edad_desde", "s.edad", "Años (número)"),
    ("edad_hasta", "s.edad", "Años (número)"),
    ("bateria", "s.bateria", "Ej. 12 V 7 Ah"),
    ("velocidad", "s.velocidad", "Ej. 3 a 5 km/h"),
    ("autonomia", "s.autonomia", "Ej. 1 a 2 horas"),
    ("tiempo_carga", "s.carga", "Ej. 8 a 10 horas"),
    ("motor", "s.motor", "Ej. 2 tiempos / 4 tiempos / eléctrico 2 × 35 W"),
    ("cilindraje", "s.cilindraje", "Ej. 50 cc"),
    ("arranque", "s.arranque", "Ej. halado / eléctrico"),
    ("transmision", "s.transmision", "Ej. automática"),
    ("largo_cm", "s.dimensiones", "Número"),
    ("ancho_cm", "s.dimensiones", "Número"),
    ("alto_cm", "s.dimensiones", "Número"),
    ("peso_max_kg", "s.pesoMax", "Número"),
    ("ocupantes", "s.ocupantes", "Número"),
    ("garantia", "p.garantia", "Solo si hay documento que la respalde. Ej. 3 meses en motor y batería"),
]

# negocio.csv: campo -> ayuda (el nombre y el logo de la empresa se cambian aparte, en js/datos.js)
NEGOCIO = [
    ("telefono", "Teléfono fijo o adicional (el WhatsApp ya está configurado)"),
    ("correo", "Correo de contacto"),
    ("direccion", "Dirección del local o bodega, si atienden público"),
    ("horario", "Ej. Lunes a sábado, 9 a. m. a 6 p. m."),
    ("ciudad", "Ciudad principal"),
    ("instagram", "@usuario real"),
    ("facebook", "Enlace de la página"),
    ("sitioWeb", "Dominio donde se publicará la tienda, con https:// (ej. https://www.mitienda.com)"),
    ("cobertura", "Ej. Envíos a toda Colombia"),
    ("envios", "Cómo y en cuánto tiempo entregan. Ej. Transportadora, 2 a 5 días hábiles; en Bogotá entrega propia"),
    ("pagos", "Formas de pago separadas por coma. Ej. Transferencia, Nequi, tarjeta de crédito, contraentrega"),
    ("garantiaGeneral", "Política general de garantía, si existe por escrito"),
]


def datos_actuales() -> dict:
    js = "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.REVISTA))"
    out = subprocess.run(["node", "-e", js, str(RAIZ / "js" / "datos.js")], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def numero(t: str):
    m = re.search(r"\d+(?:[.,]\d+)?", t or "")
    return m.group(0).replace(",", ".") if m else ""


def plantilla(forzar: bool) -> None:
    if CSV_PRODUCTOS.exists() and not forzar:
        sys.exit(f"Ya existe {CSV_PRODUCTOS.relative_to(RAIZ)}: no se sobrescribe (usa --forzar si de verdad quieres empezar de cero).")
    D = datos_actuales()
    CARPETA.mkdir(exist_ok=True)
    with CSV_PRODUCTOS.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow([c for c, _, _ in COLUMNAS])
        w.writerow([a for _, _, a in COLUMNAS])  # fila de ayuda: el importador la ignora
        for p in D["productos"]:
            s = p.get("specs") or {}
            edad = re.match(r"(\d+)\s*a\s*(\d+)", s.get("edad") or "")
            dim = re.findall(r"\d+(?:[.,]\d+)?", s.get("dimensiones") or "")
            fila = {
                "ref_actual": p["ref"], "producto": p["nombre"], "ref_definitiva": "",
                "precio_cop": p["precio"] if isinstance(p.get("precio"), (int, float)) else "",
                "disponible": "no" if p.get("disponible") is False else "si",
                "marca": p.get("marca") or "",
                "edad_desde": edad.group(1) if edad else "", "edad_hasta": edad.group(2) if edad else "",
                "bateria": s.get("bateria", ""), "velocidad": s.get("velocidad", ""), "autonomia": s.get("autonomia", ""),
                "tiempo_carga": s.get("carga", ""), "motor": s.get("motor", ""), "cilindraje": s.get("cilindraje", ""),
                "arranque": s.get("arranque", ""), "transmision": s.get("transmision", ""),
                "largo_cm": dim[0] if len(dim) == 3 else "", "ancho_cm": dim[1] if len(dim) == 3 else "", "alto_cm": dim[2] if len(dim) == 3 else "",
                "peso_max_kg": numero(s.get("pesoMax", "")), "ocupantes": numero(s.get("ocupantes", "")),
                "garantia": p.get("garantia") or "",
            }
            w.writerow([fila[c] for c, _, _ in COLUMNAS])
    if not CSV_NEGOCIO.exists() or forzar:
        N = D["negocio"]
        with CSV_NEGOCIO.open("w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f, delimiter=";")
            w.writerow(["campo", "valor", "ayuda"])
            for campo, ayuda in NEGOCIO:
                v = N.get(campo) or ""
                if isinstance(v, list):
                    v = ", ".join(v)
                if campo == "ciudad" and "prueba" in str(v).lower():
                    v = ""
                if campo == "instagram" and "demo" in str(v).lower():
                    v = ""
                if campo == "cobertura" and "prueba" in str(v).lower():
                    v = ""
                w.writerow([campo, v, ayuda])
    print(f"Plantillas listas en {CARPETA.relative_to(RAIZ)}/: productos.csv ({len(D['productos'])} productos) y negocio.csv")
    print("Llénalas en Excel, guárdalas como CSV (delimitado por punto y coma) y ejecuta: python3 tools/datos_negocio.py importar")


def leer_csv(ruta: Path) -> list[dict]:
    with ruta.open(encoding="utf-8-sig", newline="") as f:
        muestra = f.read(2048)
        f.seek(0)
        sep = ";" if muestra.count(";") >= muestra.count(",") else ","
        return list(csv.DictReader(f, delimiter=sep))


def importar() -> None:
    if not CSV_PRODUCTOS.exists():
        sys.exit("No existe datos-del-negocio/productos.csv. Primero: python3 tools/datos_negocio.py plantilla")
    D = datos_actuales()
    refs = {p["ref"] for p in D["productos"]}
    ajustes, avisos, nuevas_refs = {}, [], set()
    filas = leer_csv(CSV_PRODUCTOS)
    for i, f in enumerate(filas, start=2):
        f = {k.strip(): (v or "").strip() for k, v in f.items() if k}
        ref = f.get("ref_actual", "")
        if not ref or f.get("producto", "").startswith("Solo de referencia"):
            continue  # fila de ayuda o vacía
        if ref not in refs:
            avisos.append(f"fila {i}: la referencia {ref} no existe en el catálogo (no se importa)")
            continue
        a, s = {}, {}
        if f.get("ref_definitiva") and f["ref_definitiva"] != ref:
            if f["ref_definitiva"] in refs or f["ref_definitiva"] in nuevas_refs:
                avisos.append(f"fila {i}: la referencia {f['ref_definitiva']} ya está en uso")
            else:
                a["ref"] = f["ref_definitiva"]
                nuevas_refs.add(f["ref_definitiva"])
        if f.get("precio_cop"):
            n = re.sub(r"[^\d]", "", f["precio_cop"])
            if n:
                a["precio"] = int(n)
            else:
                avisos.append(f"fila {i} ({ref}): precio no es un número")
        if f.get("disponible"):
            a["disponible"] = f["disponible"].lower() not in ("no", "n", "agotado", "0", "false")
        if f.get("marca"):
            a["marca"] = f["marca"]
        if f.get("garantia"):
            a["garantia"] = f["garantia"]
        d, h = numero(f.get("edad_desde", "")), numero(f.get("edad_hasta", ""))
        if d and h:
            s["edad"] = f"{d} a {h} años"
        elif d or h:
            avisos.append(f"fila {i} ({ref}): la edad necesita 'desde' y 'hasta'")
        for col, destino in (("bateria", "bateria"), ("velocidad", "velocidad"), ("autonomia", "autonomia"),
                             ("tiempo_carga", "carga"), ("motor", "motor"), ("cilindraje", "cilindraje"),
                             ("arranque", "arranque"), ("transmision", "transmision")):
            if f.get(col):
                s[destino] = f[col]
        if f.get("cilindraje") and not re.search(r"cc", f["cilindraje"], re.I) and numero(f["cilindraje"]):
            s["cilindraje"] = f"{numero(f['cilindraje'])} cc"
        dims = [numero(f.get(c, "")) for c in ("largo_cm", "ancho_cm", "alto_cm")]
        if all(dims):
            s["dimensiones"] = " × ".join(dims) + " cm"
        elif any(dims):
            avisos.append(f"fila {i} ({ref}): faltan medidas (se necesitan largo, ancho y alto)")
        if numero(f.get("peso_max_kg", "")):
            s["pesoMax"] = f"{numero(f['peso_max_kg'])} kg"
        if numero(f.get("ocupantes", "")):
            s["ocupantes"] = numero(f["ocupantes"])
        if s:
            a["specs"] = s
        if a:
            ajustes[ref] = a

    negocio = {}
    if CSV_NEGOCIO.exists():
        for f in leer_csv(CSV_NEGOCIO):
            campo, valor = (f.get("campo") or "").strip(), (f.get("valor") or "").strip()
            if campo in dict(NEGOCIO) and valor:
                negocio[campo] = [x.strip() for x in valor.split(",") if x.strip()] if campo == "pagos" else valor

    SALIDA.write_text(
        "/* GENERADO por tools/datos_negocio.py desde datos-del-negocio/*.csv. No editar a mano:\n"
        "   cambia los CSV y vuelve a ejecutar  python3 tools/datos_negocio.py importar  */\n"
        "(function () {\n"
        "  const D = window.REVISTA;\n"
        "  if (!D) return;\n"
        f"  const NEGOCIO = {json.dumps(negocio, ensure_ascii=False, indent=2)};\n"
        f"  const PRODUCTOS = {json.dumps(ajustes, ensure_ascii=False, indent=2)};\n"
        "  Object.assign(D.negocio, NEGOCIO);\n"
        "  D.productos.forEach((p) => {\n"
        "    const a = PRODUCTOS[p.ref];\n"
        "    if (!a) return;\n"
        "    const { specs, ...resto } = a;\n"
        "    p.specs = Object.assign(p.specs || {}, specs || {});\n"
        "    Object.assign(p, resto);\n"
        "  });\n"
        "})();\n",
        encoding="utf-8",
    )
    con = lambda k: sum(1 for a in ajustes.values() if k in a or k in a.get("specs", {}))
    print(f"js/fichas.js generado: {len(ajustes)} productos con datos nuevos, {len(negocio)} datos del negocio.")
    print(f"  precios: {con('precio')}/{len(refs)} · edades: {con('edad')}/{len(refs)} · medidas: {con('dimensiones')}/{len(refs)} · referencias cambiadas: {con('ref')}")
    for a in avisos:
        print("  ⚠", a)
    print("Después de importar: bash tools/generar_pdf.sh (para actualizar la revista en PDF).")


if __name__ == "__main__":
    orden = sys.argv[1] if len(sys.argv) > 1 else ""
    if orden == "plantilla":
        plantilla("--forzar" in sys.argv)
    elif orden == "importar":
        importar()
    else:
        sys.exit(__doc__)
