"""Descarga fotos e ingredientes de prueba desde TheMealDB / TheCocktailDB.

⚠ SOLO PARA MAQUETA DE PRUEBA. Estas fotos NO son del restaurante: deben
reemplazarse por fotografías reales del cliente antes de publicar.

Guarda:
  data/fuentes/<ref>.json   respuesta original de la API (trazabilidad)
  img/productos/<ref>.jpg   fotografía
  data/fuentes/resumen.json nombre original, ingredientes y URL de cada foto

Uso: python3 tools/descargar_fuentes.py
"""
import json
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MEAL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i={}"
DRINK = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={}"

# ref -> (fuente, id)
PRODUCTOS = {
    "HAM-01": ("meal", "53099"),   # Aussie Burgers
    "HAM-02": ("meal", "53013"),   # Big Mac
    "HAM-03": ("meal", "53010"),   # Lamb Tzatziki Burgers
    "HAM-04": ("meal", "53085"),   # 15-minute chicken & halloumi burgers
    "HAM-05": ("meal", "53257"),   # kofta burgers
    "HAM-06": ("meal", "53016"),   # Chick-Fil-A Sandwich
    "SAN-01": ("meal", "53547"),   # Cuban Sandwich
    "SAN-02": ("meal", "53319"),   # Chivito sandwich
    "SAN-03": ("meal", "53091"),   # Falafel Pita Sandwich with Tahini Sauce
    "ACO-01": ("meal", "53548"),   # Baked Yuca Fries
    "ACO-02": ("meal", "53557"),   # Extra crispy chicken wings
    "ACO-03": ("meal", "52831"),   # Chicken Karaage
    "ACO-04": ("meal", "53555"),   # Classic Potato Salad
    "POS-01": ("meal", "52860"),   # Chocolate Raspberry Brownies
    "POS-02": ("meal", "52858"),   # New York cheesecake
    "POS-03": ("meal", "52861"),   # Peanut Butter Cheesecake
    "BEB-01": ("drink", "12654"),  # Banana Milk Shake
    "BEB-02": ("drink", "12674"),  # Fruit Shake
    "BEB-03": ("drink", "12704"),  # Limeade
    "BEB-04": ("drink", "12618"),  # Orangeade
    "BEB-05": ("drink", "12770"),  # Iced Coffee
    "BEB-06": ("drink", "12734"),  # Chocolate Drink
}


def obtener(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "catalogo-maqueta/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main() -> None:
    resumen = {}
    for ref, (fuente, ident) in PRODUCTOS.items():
        datos = obtener((MEAL if fuente == "meal" else DRINK).format(ident))
        item = (datos.get("meals") or datos.get("drinks"))[0]
        (RAIZ / "data" / "fuentes" / f"{ref}.json").write_text(
            json.dumps(item, ensure_ascii=False, indent=2), encoding="utf-8")

        nombre = item.get("strMeal") or item.get("strDrink")
        foto = item.get("strMealThumb") or item.get("strDrinkThumb")
        ingredientes = []
        for i in range(1, 21):
            ing = (item.get(f"strIngredient{i}") or "").strip()
            med = (item.get(f"strMeasure{i}") or "").strip()
            if ing:
                ingredientes.append({"ingrediente": ing, "medida": med})

        destino = RAIZ / "img" / "productos" / f"{ref.lower()}.jpg"
        if not destino.exists():
            urllib.request.urlretrieve(urllib.parse.quote(foto, safe=":/"), destino)
        resumen[ref] = {"fuente": fuente, "id": ident, "nombre_original": nombre,
                        "foto_url": foto, "ingredientes": ingredientes}
        print(f"{ref}  {nombre}  ({len(ingredientes)} ingredientes)")

    (RAIZ / "data" / "fuentes" / "resumen.json").write_text(
        json.dumps(resumen, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
