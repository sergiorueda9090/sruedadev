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
    "ENT-01": ("meal", "53060"),   # Burek
    "ENT-02": ("meal", "52977"),   # Corba
    "ENT-03": ("meal", "52764"),   # Garides Saganaki
    "ENT-04": ("meal", "53043"),   # Fish fofos
    "PAR-01": ("meal", "52806"),   # Tandoori chicken
    "PAR-02": ("meal", "52805"),   # Lamb Biryani
    "PAR-03": ("meal", "52812"),   # Beef Brisket Pot Roast
    "PAR-04": ("meal", "52773"),   # Honey Teriyaki Salmon
    "HAM-01": ("meal", "53013"),   # Big Mac
    "HAM-02": ("meal", "53028"),   # Shawarma
    "HAM-03": ("meal", "52829"),   # Grilled Mac and Cheese Sandwich
    "PIZ-01": ("meal", "53014"),   # Pizza Express Margherita
    "PIZ-02": ("meal", "52982"),   # Spaghetti alla Carbonara
    "PIZ-03": ("meal", "52771"),   # Spicy Arrabiata Penne
    "POS-01": ("meal", "52776"),   # Chocolate Gateau
    "POS-02": ("meal", "52883"),   # Sticky Toffee Pudding
    "POS-03": ("meal", "52854"),   # Pancakes
    "BEB-01": ("drink", "12770"),  # Iced Coffee
    "BEB-02": ("drink", "13036"),  # Strawberry Lemonade
    "BEB-03": ("drink", "12698"),  # Lassi - Mango
    "BEB-04": ("drink", "12656"),  # Banana Strawberry Shake
    "BEB-05": ("drink", "12774"),  # Masala Chai
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
