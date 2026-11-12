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
    "FAV-01": ("meal", "53010"),   # Lamb Tzatziki Burgers
    "FAV-02": ("meal", "53548"),   # Baked Yuca Fries
    "FAV-03": ("meal", "53547"),   # Cuban Sandwich
    "FAV-04": ("meal", "52960"),   # Salmon Avocado Salad
    "ENT-01": ("meal", "52903"),   # French Onion Soup
    "ENT-02": ("meal", "52922"),   # Prawn & Fennel Bisque
    "ENT-03": ("meal", "53491"),   # Shopska Salad
    "ENT-04": ("meal", "52962"),   # Salmon Eggs Eggs Benedict
    "CAS-01": ("meal", "53014"),   # Pizza Express Margherita
    "CAS-02": ("meal", "53064"),   # Fettuccine Alfredo
    "CAS-03": ("meal", "52935"),   # Steak Diane
    "CAS-04": ("meal", "52823"),   # Salmon Prawn Risotto
    "CAS-05": ("meal", "52920"),   # Chicken Marengo
    "CAS-06": ("meal", "52844"),   # Lasagne
    "POS-01": ("meal", "52860"),   # Chocolate Raspberry Brownies
    "POS-02": ("meal", "52909"),   # Tarte Tatin
    "POS-03": ("meal", "53550"),   # Strawberry tart
    "POS-04": ("meal", "52855"),   # Banana Pancakes
    "POS-05": ("meal", "52892"),   # Treacle Tart
    "POS-06": ("meal", "52767"),   # Bakewell tart
    "BEB-01": ("drink", "12714"),  # Kiwi Papaya Smoothie
    "BEB-02": ("drink", "12716"),  # Mango Orange Smoothie
    "BEB-03": ("drink", "12786"),  # Thai Iced Tea
    "BEB-04": ("drink", "12704"),  # Limeade
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
