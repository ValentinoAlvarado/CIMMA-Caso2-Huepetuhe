"""Genera figuras y tablas para el Caso 2 (Sedimentos) del taller CIMMA.

Uso desde la carpeta del proyecto:
    python codigo/generar_graficas.py
Requisitos: pandas, matplotlib.
Los datos reproducen la tabla entregada en el taller; no son mediciones nuevas.
"""
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / "datos" / "sedimentos_SD01.csv"
OUT = ROOT / "figuras"
OUT.mkdir(exist_ok=True, parents=True)
df = pd.read_csv(CSV)

# 1. Curva de mercurio total
fig, ax = plt.subplots(figsize=(10, 5.6), constrained_layout=True)
ax.plot(df.anio, df.mercurio_total_mg_kg, marker="o", linewidth=2)
ax.set_title("Mercurio total en sedimento de fondo | SD-01")
ax.set_xlabel("Año de muestreo")
ax.set_ylabel("Mercurio total (mg/kg)")
ax.grid(True, alpha=0.3)
ax.annotate("3,80 mg/kg", (df.anio.iloc[-1], df.mercurio_total_mg_kg.iloc[-1]),
            xytext=(-75, -22), textcoords="offset points", arrowprops={"arrowstyle": "->"})
fig.savefig(OUT / "01_mercurio_total.png", dpi=220)
plt.close(fig)

# 2. Curva de metilmercurio
fig, ax = plt.subplots(figsize=(10, 5.6), constrained_layout=True)
ax.plot(df.anio, df.metilmercurio_ug_kg, marker="o", linewidth=2)
ax.set_title("Metilmercurio en sedimento de fondo | SD-01")
ax.set_xlabel("Año de muestreo")
ax.set_ylabel("Metilmercurio (µg/kg)")
ax.grid(True, alpha=0.3)
ax.annotate("9,5 µg/kg", (df.anio.iloc[-1], df.metilmercurio_ug_kg.iloc[-1]),
            xytext=(-72, -23), textcoords="offset points", arrowprops={"arrowstyle": "->"})
fig.savefig(OUT / "02_metilmercurio.png", dpi=220)
plt.close(fig)

# 3. Tendencia comparativa de As, Pb y Cd normalizada a 2017=100.
# La normalización permite comparar ritmos relativos sin mezclar escalas absolutas.
fig, ax = plt.subplots(figsize=(10, 5.6), constrained_layout=True)
for col, label in [
    ("arsenico_mg_kg", "Arsénico"),
    ("plomo_mg_kg", "Plomo"),
    ("cadmio_mg_kg", "Cadmio"),
]:
    ax.plot(df.anio, df[col] / df[col].iloc[0] * 100, marker="o", linewidth=2, label=label)
ax.set_title("Cambio relativo de otros metales (2017 = 100)")
ax.set_xlabel("Año de muestreo")
ax.set_ylabel("Índice relativo (%)")
ax.legend(frameon=False)
ax.grid(True, alpha=0.3)
fig.savefig(OUT / "03_otros_metales_indice.png", dpi=220)
plt.close(fig)

# 4. Materia orgánica
fig, ax = plt.subplots(figsize=(10, 5.6), constrained_layout=True)
ax.plot(df.anio, df.materia_organica_pct, marker="o", linewidth=2)
ax.set_title("Materia orgánica del sedimento | SD-01")
ax.set_xlabel("Año de muestreo")
ax.set_ylabel("Materia orgánica (%)")
ax.grid(True, alpha=0.3)
ax.annotate("1,8 %", (df.anio.iloc[-1], df.materia_organica_pct.iloc[-1]),
            xytext=(-45, 20), textcoords="offset points", arrowprops={"arrowstyle": "->"})
fig.savefig(OUT / "04_materia_organica.png", dpi=220)
plt.close(fig)

# 5. Grilla de resultados para diapositiva/resumen (todas las unidades quedan separadas).
fig, axes = plt.subplots(2, 2, figsize=(12, 8), constrained_layout=True)
ax = axes[0, 0]
ax.plot(df.anio, df.mercurio_total_mg_kg, marker="o")
ax.set_title("Mercurio total (mg/kg)")
ax.set_ylabel("mg/kg")
ax.grid(True, alpha=0.25)
ax = axes[0, 1]
ax.plot(df.anio, df.metilmercurio_ug_kg, marker="o")
ax.set_title("Metilmercurio (µg/kg)")
ax.set_ylabel("µg/kg")
ax.grid(True, alpha=0.25)
ax = axes[1, 0]
for col, label in [("arsenico_mg_kg", "Arsénico"), ("plomo_mg_kg", "Plomo"), ("cadmio_mg_kg", "Cadmio")]:
    ax.plot(df.anio, df[col] / df[col].iloc[0] * 100, marker="o", label=label)
ax.set_title("Otros metales: índice relativo (2017 = 100)")
ax.set_ylabel("Índice (%)")
ax.legend(frameon=False, fontsize=8)
ax.grid(True, alpha=0.25)
ax = axes[1, 1]
ax.plot(df.anio, df.materia_organica_pct, marker="o")
ax.set_title("Materia orgánica (%)")
ax.set_ylabel("%")
ax.grid(True, alpha=0.25)
for ax in axes.flat:
    ax.set_xlabel("Año")
    ax.set_xticks(df.anio)
    ax.tick_params(axis="x", rotation=35)
fig.suptitle("Caso 2 - Evolución temporal de los sedimentos (2017-2025)", fontsize=15)
fig.savefig(OUT / "05_panel_evolucion.png", dpi=220)
plt.close(fig)

# 6. Resumen cuantitativo reproducible
metrics = [
    ("Mercurio total", "mercurio_total_mg_kg", "mg/kg", "factor"),
    ("Metilmercurio", "metilmercurio_ug_kg", "µg/kg", "factor"),
    ("Arsénico", "arsenico_mg_kg", "mg/kg", "factor"),
    ("Plomo", "plomo_mg_kg", "mg/kg", "factor"),
    ("Cadmio", "cadmio_mg_kg", "mg/kg", "factor"),
    ("Materia orgánica", "materia_organica_pct", "%", "cambio_pct"),
]
rows = []
for name, col, unit, typ in metrics:
    start = float(df[col].iloc[0])
    end = float(df[col].iloc[-1])
    rows.append({
        "parametro": name,
        "valor_2017": start,
        "valor_2025": end,
        "unidad": unit,
        "cambio_absoluto": end - start,
        "factor_2025_vs_2017": end / start,
        "variacion_porcentual": (end - start) / start * 100,
    })
summary = pd.DataFrame(rows)
summary.to_csv(ROOT / "datos" / "resumen_cambios_calculado.csv", index=False, float_format="%.4f")

print("Gráficas generadas en:", OUT)
print("Resumen calculado en: datos/resumen_cambios_calculado.csv")
print(summary.to_string(index=False))
