import random, datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.chart import BarChart, PieChart, Reference
from openpyxl.chart.label import DataLabelList
from openpyxl.comments import Comment
from openpyxl.utils import get_column_letter as L

import sys
BLANK = "--blanco" in sys.argv
OUT = "/home/user/MiApp/plantillas-presupuesto/" + ("Mi-Presupuesto-2026.xlsx" if BLANK else "Plantilla-Presupuesto-EJEMPLO.xlsx")
YEAR = 2026
F = "Arial"
NAVY, TEAL, ORANGE, GREEN, RED = "1F3A5F", "1A8C7C", "E0782E", "4E9A4E", "C0392B"
LIGHT, INPUT, GRAYL = "EAF4F1", "FFF8E1", "F4F6F8"
MONEY = '"$"#,##0;[Red]-"$"#,##0;"-"'          # pesos colombianos
NATIVE = '#,##0.00;[Red]-#,##0.00;"-"'           # monto en la moneda de la cuenta
TRM0 = 4000
PCT = '0%;[Red]-0%;"-"'
thin = Side(style="thin", color="D0D7DE")
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
CFG = "'Configuración'"
MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
MCORTO = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
TIPOS = ["Ingresos","Gastos básicos","Suscripciones","Gastos personales","Ahorro e inversión","Deudas"]
TCOLOR = [NAVY, ORANGE, ORANGE, ORANGE, GREEN, RED]
NCAT = 20
GCOLS = ["F","I","L","O","R","U"]          # category column per group in Configuración

def fill(c): return PatternFill("solid", start_color=c, end_color=c)
def font(**k):
    k.setdefault("name", F); k.setdefault("size", 10); return Font(**k)
def cell(ws, ref, v=None, bold=False, color="222222", bg=None, size=10, fmt=None, al=None, border=False, italic=False):
    c = ws[ref]
    if v is not None: c.value = v
    c.font = font(bold=bold, color=color, size=size, italic=italic)
    if bg: c.fill = fill(bg)
    if fmt: c.number_format = fmt
    if al: c.alignment = al
    if border: c.border = BOX
    return c
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFTW = Alignment(horizontal="left", vertical="center", wrap_text=True)

def band(ws, title, desc, last_col, desc_from, title_end=None):
    for r in range(1, 5):
        ws.row_dimensions[r].height = 18
        for c in range(1, last_col + 1):
            ws.cell(r, c).fill = fill(NAVY)
    ws.merge_cells(f"B2:{title_end or L(desc_from-2)}3")
    cell(ws, "B2", title, bold=True, color="FFFFFF", size=18, al=Alignment(vertical="center"))
    ws.merge_cells(f"{L(desc_from)}2:{L(last_col)}3")
    cell(ws, f"{L(desc_from)}2", desc, color="DDE6F0", size=9, italic=True, al=LEFTW)
    ws.sheet_view.showGridLines = False

def header(ws, ref, text, bg=NAVY, color="FFFFFF"):
    cell(ws, ref, text, bold=True, color=color, bg=bg, al=CENTER, border=True)

wb = Workbook()

# ---------------------------------------------------------------- LÉEME
rd = wb.active; rd.title = "LÉEME"
rd.sheet_properties.tabColor = NAVY
band(rd, "Mi Presupuesto " + str(YEAR), "Plantilla para planear, registrar y entender tu dinero mes a mes.", 10, 6)
rd.column_dimensions["A"].width = 3; rd.column_dimensions["B"].width = 6
for c in "CDEFGHIJ": rd.column_dimensions[c].width = 14
rd.column_dimensions["C"].width = 20
pasos = [
    ("1", "Configuración", "Escribe el año, tus cuentas (banco, efectivo, billetera) con el saldo con el que empiezas el año, y tus categorías en cada grupo: ingresos, gastos básicos, suscripciones, gastos personales, ahorro/inversión y deudas. No repitas el mismo nombre de categoría en dos grupos."),
    ("2", "Presupuesto", "Planea cuánto esperas recibir y cuánto asignas a cada categoría, mes por mes. Elige de qué cuenta sale o entra el dinero. La fila 'Resultado mensual' debe quedar en $0: cada peso que entra tiene un trabajo (método base cero)."),
    ("3", "Registro", "Anota cada movimiento real: fecha, categoría, cuenta y monto en positivo (el tipo se llena solo). Si apartas ahorro, en 'Cuenta destino' pon la cuenta donde queda. Para mover dinero entre tus cuentas (retiro de cajero, pago de la tarjeta) deja la categoría vacía y llena cuenta y cuenta destino."),
    ("4", "Resumen Mensual", "Elige el mes en la celda amarilla y compara lo planeado con lo real. En rojo verás donde te pasaste."),
    ("5", "Metas de Ahorro", "Define tus metas (deben ser categorías del grupo Ahorro e inversión). Lo que registres en esa categoría suma a la meta automáticamente y verás cuánto apartar al mes."),
    ("6", "Balance de Cuentas", "Saldo actual de cada cuenta y lo planeado vs. lo real del mes elegido."),
    ("7", "Reporte Anual", "Tu año completo: ingresos, gastos, ahorro y tasa de ahorro por mes, con gráficos."),
]
r = 6
cell(rd, "B6", "Cómo usarla (7 pasos)", bold=True, size=13, color=NAVY); r = 8
for n, t, d in pasos:
    cell(rd, f"B{r}", n, bold=True, color="FFFFFF", bg=TEAL, size=12, al=CENTER)
    cell(rd, f"C{r}", t, bold=True, size=11, color=NAVY, al=Alignment(vertical="center"))
    rd.merge_cells(f"D{r}:J{r}")
    cell(rd, f"D{r}", d, al=LEFTW)
    rd.row_dimensions[r].height = 44
    r += 1
r += 1
cell(rd, f"B{r}", "Leyenda de colores", bold=True, size=13, color=NAVY); r += 1
leg = [(INPUT, "Celdas amarillas claras: aquí escribes tú."),
       ("FFFFFF", "Celdas blancas con texto negro: se calculan solas (no las borres)."),
       (LIGHT, "Celdas verdes claras: totales y resúmenes automáticos.")]
for bg, t in leg:
    cell(rd, f"B{r}", "", bg=bg, border=True)
    rd.merge_cells(f"C{r}:J{r}"); cell(rd, f"C{r}", t); r += 1
r += 1
cell(rd, f"B{r}", "¿Pagas con tarjeta de crédito?", bold=True, size=13, color=NAVY); r += 1
tdc = ["1. En Configuración agrega la tarjeta como una cuenta más (ej. 'Tarjeta de crédito'). Saldo inicial = lo que ya debes, en negativo.",
       "2. Cuando compras con la tarjeta, registra el gasto con su categoría normal (Restaurantes, Netflix...) y en Cuenta elige la tarjeta. Así el gasto cuenta en el mes en que lo hiciste.",
       "3. Cuando pagas la tarjeta: Cuenta = tu banco, Cuenta destino = la tarjeta, categoría vacía. Es una transferencia: no vuelve a contar como gasto (no se duplica).",
       "4. Si arrastras una deuda vieja de la tarjeta o pagas intereses, crea una categoría en Deudas (ej. 'Intereses tarjeta') para verla aparte."]
for t in tdc:
    rd.merge_cells(f"B{r}:J{r}"); cell(rd, f"B{r}", t, al=LEFTW); rd.row_dimensions[r].height = 30; r += 1
r += 1
cell(rd, f"B{r}", "Pesos y dólares", bold=True, size=13, color=NAVY); r += 1
mon = ["1. En Configuración cada cuenta tiene su moneda (COP o USD). Escribe la TRM del día en la celda verde de arriba.",
       "2. En Registro escribe el monto en la moneda de la cuenta: si pagas con la cuenta en dólares, pones 20 (USD), no los pesos.",
       "3. Presupuesto, resúmenes y reportes están en pesos: los dólares se convierten solos con la TRM.",
       "4. Cambio de dólares a pesos: es una transferencia (categoría vacía). Cuenta = la de dólares, destino = la de pesos, y en 'Monto recibido' los pesos que te llegaron de verdad."]
for t in mon:
    rd.merge_cells(f"B{r}:J{r}"); cell(rd, f"B{r}", t, al=LEFTW); rd.row_dimensions[r].height = 30; r += 1
r += 1
cell(rd, f"B{r}", "Transferencias entre tus cuentas", bold=True, size=13, color=NAVY); r += 1
rd.merge_cells(f"B{r}:J{r+1}")
cell(rd, f"B{r}", "Cuando mueves dinero de una cuenta tuya a otra (de la cuenta de ahorros a la principal, retiro de cajero, pago de la tarjeta, cambio de dólares) deja la CATEGORÍA VACÍA y llena Cuenta (de dónde sale) y Cuenta destino (a dónde llega). El tipo dirá 'Transferencia': mueve el saldo de las dos cuentas, pero no cuenta como ingreso ni gasto.", al=LEFTW)
rd.row_dimensions[r].height = 30; rd.row_dimensions[r+1].height = 30; r += 3
cell(rd, f"B{r}", "Cómo empezar hoy" if BLANK else "Datos de ejemplo", bold=True, size=13, color=NAVY); r += 1
rd.merge_cells(f"B{r}:J{r+1}")
cell(rd, f"B{r}", "Plantilla en blanco. Saldo inicial = lo que tienes en cada cuenta el día que empiezas (las deudas de tarjeta en negativo). Registra tus movimientos desde ese día. Para el año siguiente: haz una copia del archivo, cambia el año y usa como saldo inicial el 'Saldo actual' de Balance de Cuentas al 31 de diciembre; luego borra los movimientos del Registro." if BLANK else "La plantilla trae datos de ejemplo para que veas cómo se llena. Para empezar con lo tuyo: en 'Registro' selecciona las filas con movimientos y bórralas (tecla Supr), y reemplaza las categorías, cuentas, montos del 'Presupuesto' y metas por los tuyos. Las fórmulas se mantienen.", al=LEFTW)
rd.row_dimensions[r].height = 30; rd.row_dimensions[r+1].height = 30

# ---------------------------------------------------------------- CONFIGURACIÓN
cf = wb.create_sheet("Configuración"); cf.sheet_properties.tabColor = TEAL
band(cf, "Configuración", "Escribe aquí tus cuentas con su saldo al iniciar el año y las categorías de cada grupo. Cada cuenta lleva su moneda (COP o USD). La TRM convierte los dólares a pesos en los reportes: actualízala cuando quieras.", 22, 12, "C")
cell(cf, "F3", "Año", bold=True, color="FFFFFF", bg=ORANGE, al=CENTER)
cell(cf, "G3", YEAR, bold=True, color="0000FF", bg=INPUT, al=CENTER, size=12)
cf["G3"].comment = Comment("Año del presupuesto. Cámbialo y todas las pestañas filtran por ese año.", "Plantilla")
cell(cf, "I3", "TRM (pesos por 1 USD)", bold=True, color="FFFFFF", bg=GREEN, al=CENTER)
cell(cf, "J3", None if BLANK else TRM0, bold=True, color="0000FF", bg=INPUT, al=CENTER, size=12, fmt='"$"#,##0')
cf["J3"].comment = Comment("Valor de ejemplo. Escribe la TRM del día (Banco de la República) para convertir tus dólares a pesos en los reportes.", "Plantilla")
widths = {"A":2,"B":20,"C":9,"D":14,"E":2,"H":2,"K":2,"N":2,"Q":2,"T":2,"W":2}
for c, w in widths.items(): cf.column_dimensions[c].width = w
for g, col in enumerate(GCOLS):
    c2 = L(cf[col+"1"].column + 1)
    cf.column_dimensions[col].width = 22; cf.column_dimensions[c2].width = 9
    cf.merge_cells(f"{col}6:{c2}6"); header(cf, f"{col}6", TIPOS[g], TCOLOR[g])
    header(cf, f"{col}7", "Categoría", "DDE3EA", "222222"); header(cf, f"{c2}7", "Día de pago", "DDE3EA", "222222")
    for i in range(NCAT):
        cell(cf, f"{col}{8+i}", bg=INPUT, border=True)
        cell(cf, f"{c2}{8+i}", bg=INPUT, border=True, al=CENTER)
cf.merge_cells("B6:D6"); header(cf, "B6", "Cuentas", TEAL)
header(cf, "B7", "Nombre de cuenta", "DDE3EA", "222222"); header(cf, "C7", "Moneda", "DDE3EA", "222222"); header(cf, "D7", "Saldo inicial", "DDE3EA", "222222")
dv_cur = DataValidation(type="list", formula1='"COP,USD"', allow_blank=True); cf.add_data_validation(dv_cur); dv_cur.add("C8:C17")
for i in range(10):
    cell(cf, f"B{8+i}", bg=INPUT, border=True); cell(cf, f"C{8+i}", bg=INPUT, border=True, al=CENTER); cell(cf, f"D{8+i}", bg=INPUT, border=True, fmt=NATIVE)
cf.merge_cells("B20:D20"); header(cf, "B20", "Meses", TEAL)
for i, m in enumerate(MESES):
    cf.merge_cells(f"B{21+i}:D{21+i}"); cell(cf, f"B{21+i}", m, al=CENTER, border=True)

cuentas = [("Cuenta principal", "COP", 5000000), ("Cuenta de ahorros", "COP", 12000000), ("Efectivo", "COP", 300000),
           ("Cuenta en dólares", "USD", 1200), ("Tarjeta de crédito", "COP", 0)]
CUR = {n: c for n, c, _ in cuentas}
MIAS = None
if BLANK:
    import json, os
    _f = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mis_cuentas.json")
    MIAS = json.load(open(_f)) if os.path.exists(_f) else None
    cuentas = [tuple(c) for c in MIAS["cuentas"]] if MIAS else []
    if MIAS: cf["J3"].value = MIAS["trm"]
for i, (n, c, sv) in enumerate(cuentas):
    cf[f"B{8+i}"].value = n; cf[f"C{8+i}"].value = c; cf[f"D{8+i}"].value = sv
# categoria, dia, presupuesto mensual, cuenta
CATS = [
    [("Salario", 30, 6500000, "Cuenta principal"), ("Ingresos en dólares", None, 2000000, "Cuenta en dólares")],
    [("Mercado", None, 1200000, "Cuenta principal"), ("Arriendo", 5, 2000000, "Cuenta principal"),
     ("Transporte", None, 400000, "Efectivo"), ("Servicios e internet", 15, 450000, "Cuenta principal"),
     ("Medicina prepagada", 10, 350000, "Cuenta principal")],
    [("Netflix", 10, 45000, "Tarjeta de crédito"), ("Spotify", 12, 27000, "Tarjeta de crédito"),
     ("Gimnasio", 1, 120000, "Cuenta principal"), ("Software (en USD)", 20, 80000, "Cuenta en dólares")],
    [("Restaurantes", None, 500000, "Tarjeta de crédito"), ("Ropa", None, 300000, "Tarjeta de crédito"),
     ("Salidas y ocio", None, 300000, "Efectivo"), ("Cuidado personal", None, 200000, "Cuenta principal")],
    [("Fondo de emergencia", 30, 800000, "Cuenta principal"), ("Viaje", 30, 400000, "Cuenta principal"), ("Pensión voluntaria", 30, 500000, "Cuenta principal")],
    [("Préstamo personal", 5, 500000, "Cuenta principal"), ("Crédito del carro", 15, 328000, "Cuenta principal")],
]
PLAN = {}
if BLANK:
    CATS = [[] for _ in range(6)]
    for g_, lst_ in ((MIAS or {}).get("categorias") or {}).items():
        for name_, day_, acc_, plan_ in lst_:
            g_ = int(g_); CATS[g_].append((name_, day_, None, acc_))
            for mes_, monto_ in plan_.items(): PLAN[(g_, len(CATS[g_]) - 1, int(mes_) - 1)] = monto_
for g, lst in enumerate(CATS):
    col = GCOLS[g]; c2 = L(cf[col+"1"].column + 1)
    for i, (n, d, _, _) in enumerate(lst):
        cf[f"{col}{8+i}"].value = n
        if d: cf[f"{c2}{8+i}"].value = d
# helper (hidden): all categories + type
cell(cf, "X7", "Todas las categorías", bold=True); cell(cf, "Y7", "Tipo", bold=True)
for g, col in enumerate(GCOLS):
    for i in range(NCAT):
        rr = 8 + g*NCAT + i
        cf[f"X{rr}"] = f'=IF({col}{8+i}="","",{col}{8+i})'
        cf[f"Y{rr}"] = f'=IF(X{rr}="","","{TIPOS[g]}")'
cf.column_dimensions["X"].hidden = True; cf.column_dimensions["Y"].hidden = True
cf.freeze_panes = "A8"
ALLCAT = f"{CFG}!$X$8:$X${8+6*NCAT-1}"; ALLTIPO = f"{CFG}!$Y$8:$Y${8+6*NCAT-1}"
ACCTS = f"{CFG}!$B$8:$B$17"; MONTHS = f"{CFG}!$B$21:$B$32"; YR = f"{CFG}!$G$3"
ACUR = f"{CFG}!$C$8:$C$17"; TRM = f"{CFG}!$J$3"

# ---------------------------------------------------------------- PRESUPUESTO
pr = wb.create_sheet("Presupuesto"); pr.sheet_properties.tabColor = ORANGE
band(pr, "Planificador de Presupuesto", "Planea cada mes: cuánto entra y a dónde va cada peso. Todo en pesos colombianos (COP): lo que se paga en dólares, planéalo convertido. El resultado mensual debe quedar en $0. Las categorías vienen de Configuración.", 17, 9)
pr.column_dimensions["A"].width = 2; pr.column_dimensions["B"].width = 24
pr.column_dimensions["C"].width = 18; pr.column_dimensions["D"].width = 8
for i in range(12): pr.column_dimensions[L(5+i)].width = 11
pr.column_dimensions["Q"].width = 13
pr.merge_cells("B5:D5")
cell(pr, "B5", "Resultado mensual (debe quedar en $0)", bold=True, color="FFFFFF", bg=NAVY, al=Alignment(vertical="center"))
header(pr, "B7", "Categoría", "DDE3EA", "222222"); header(pr, "C7", "Cuenta", "DDE3EA", "222222"); header(pr, "D7", "Día de pago", "DDE3EA", "222222")
for i, m in enumerate(MESES): header(pr, f"{L(5+i)}7", m, LIGHT, NAVY)
header(pr, "Q7", "Total año", LIGHT, NAVY)
dv_acc = DataValidation(type="list", formula1=f"={ACCTS}", allow_blank=True); pr.add_data_validation(dv_acc)
TITLE = []  # title rows per group
for g in range(6):
    t = 9 + g*(NCAT+2); TITLE.append(t)
    col = GCOLS[g]; c2 = L(cf[col+"1"].column + 1)
    pr.merge_cells(f"B{t}:D{t}")
    cell(pr, f"B{t}", f"Total {TIPOS[g].lower()}", bold=True, color="FFFFFF", bg=TCOLOR[g], al=Alignment(vertical="center"))
    for j in range(13):
        cl = L(5+j)
        cell(pr, f"{cl}{t}", f"=SUM({cl}{t+1}:{cl}{t+NCAT})", bold=True, color="FFFFFF", bg=TCOLOR[g], fmt=MONEY)
    for i in range(NCAT):
        r = t + 1 + i
        cell(pr, f"B{r}", f'=IF({CFG}!{col}{8+i}="","",{CFG}!{col}{8+i})', border=True)
        cell(pr, f"C{r}", bg=INPUT, border=True); dv_acc.add(f"C{r}")
        cell(pr, f"D{r}", f'=IF({CFG}!{c2}{8+i}="","",{CFG}!{c2}{8+i})', border=True, al=CENTER)
        for j in range(12):
            cell(pr, f"{L(5+j)}{r}", bg=INPUT, border=True, fmt=MONEY)
        cell(pr, f"Q{r}", f"=SUM(E{r}:P{r})", bold=True, bg=LIGHT, border=True, fmt=MONEY)
    for i, (_, _, amt, acc) in enumerate(CATS[g]):
        r = t + 1 + i
        pr[f"C{r}"].value = acc
        for j in range(12):
            v = PLAN.get((g, i, j)) if BLANK else amt
            if v is not None: pr[f"{L(5+j)}{r}"].value = v
for j in range(13):
    cl = L(5+j)
    f_ = f"={cl}{TITLE[0]}-(" + "+".join(f"{cl}{TITLE[g]}" for g in range(1, 6)) + ")"
    cell(pr, f"{cl}5", f_, bold=True, color="FFFFFF", bg=NAVY, fmt=MONEY, al=CENTER)
pr.conditional_formatting.add("E5:Q5", CellIsRule(operator="notEqual", formula=["0"], fill=fill("F8D7D3"), font=Font(name=F, bold=True, color=RED)))
pr.conditional_formatting.add("E5:Q5", CellIsRule(operator="equal", formula=["0"], fill=fill("D4EDDA"), font=Font(name=F, bold=True, color="1E6B3A")))
pr.freeze_panes = "E8"
PLAST = TITLE[5] + NCAT

# ---------------------------------------------------------------- REGISTRO
rg = wb.create_sheet("Registro"); rg.sheet_properties.tabColor = TEAL
band(rg, "Registro de Movimientos", "Monto en positivo y en la moneda de la cuenta (pesos o dólares); el tipo, la moneda y el valor en pesos se llenan solos. Transferencia entre tus cuentas (retiro, pago de tarjeta, cambio de dólares): categoría vacía + cuenta destino.", 15, 9)
for c, w in {"A":2,"B":12,"C":22,"D":17,"E":19,"F":19,"G":28,"H":13,"I":8,"J":14,"K":14,"L":14,"M":6,"N":6}.items(): rg.column_dimensions[c].width = w
heads = ["Fecha", "Categoría", "Tipo (automático)", "Cuenta", "Cuenta destino (opcional)", "Descripción", "Monto", "Moneda", "Monto recibido (si cambias moneda)", "Valor en pesos", "Llega a destino", "Mes", "Año"]
for i, h in enumerate(heads): header(rg, f"{L(2+i)}5", h)
rg.row_dimensions[5].height = 42
rg["J5"].comment = Comment("Solo para transferencias entre cuentas de distinta moneda (ej. vendes 300 USD y te llegan 1.230.000 COP). Si la dejas vacía se usa la TRM de Configuración.", "Plantilla")
NREG = 1000; R0, R1 = 6, 6 + NREG - 1
dv_cat = DataValidation(type="list", formula1=f"={ALLCAT}", allow_blank=True, showErrorMessage=True,
                        errorTitle="Categoría no encontrada", error="Elige una categoría de la lista (se crean en Configuración).")
dv_acc2 = DataValidation(type="list", formula1=f"={ACCTS}", allow_blank=True)
dv_date = DataValidation(type="date", operator="greaterThan", formula1="36526", allow_blank=True,
                         showErrorMessage=True, errorTitle="Fecha", error="Escribe una fecha válida, por ejemplo 15/03/2026.")
for d in (dv_cat, dv_acc2, dv_date): rg.add_data_validation(d)
dv_cat.add(f"C{R0}:C{R1}"); dv_acc2.add(f"E{R0}:F{R1}"); dv_date.add(f"B{R0}:B{R1}")
for r in range(R0, R1 + 1):
    for c in "BCEFGHJ": rg[f"{c}{r}"].fill = fill(INPUT); rg[f"{c}{r}"].border = BOX; rg[f"{c}{r}"].font = font()
    rg[f"B{r}"].number_format = "dd/mm/yyyy"; rg[f"H{r}"].number_format = NATIVE; rg[f"J{r}"].number_format = NATIVE
    rg[f"D{r}"] = f'=IF(C{r}="",IF(AND(B{r}<>"",F{r}<>""),"Transferencia",""),IFERROR(INDEX({ALLTIPO},MATCH(C{r},{ALLCAT},0)),"Revisa categoría"))'
    rg[f"I{r}"] = f'=IF(E{r}="","",IFERROR(INDEX({ACUR},MATCH(E{r},{ACCTS},0)),"COP"))'
    rg[f"K{r}"] = f'=IF(H{r}="","",IF(I{r}="USD",H{r}*{TRM},H{r}))'
    rg[f"L{r}"] = (f'=IF(OR(F{r}="",H{r}=""),"",IF(J{r}<>"",J{r},IF(IFERROR(INDEX({ACUR},MATCH(F{r},{ACCTS},0)),"COP")=I{r},H{r},'
                   f'IFERROR(IF(I{r}="USD",H{r}*{TRM},H{r}/{TRM}),"Falta TRM"))))')
    rg[f"M{r}"] = f'=IF(B{r}="","",MONTH(B{r}))'
    rg[f"N{r}"] = f'=IF(B{r}="","",YEAR(B{r}))'
    for c in "DIKLMN": rg[f"{c}{r}"].font = font(color="555555"); rg[f"{c}{r}"].border = BOX
    rg[f"K{r}"].number_format = MONEY; rg[f"L{r}"].number_format = NATIVE
    for c in "IMN": rg[f"{c}{r}"].alignment = Alignment(horizontal="center")
rg.freeze_panes = "B6"; rg.auto_filter.ref = f"B5:N{R1}"

# example transactions Jan..Nov
random.seed(7)
tx = []
desc = {"Salario": "Pago de nómina", "Ingresos en dólares": "Pago cliente del exterior", "Mercado": "Mercado de la semana",
        "Arriendo": "Arriendo del mes", "Transporte": "Gasolina / transporte", "Servicios e internet": "Servicios públicos e internet",
        "Medicina prepagada": "Cuota mensual", "Software (en USD)": "Suscripción de software", "Netflix": "Suscripción", "Spotify": "Suscripción", "Gimnasio": "Mensualidad",
        "Restaurantes": "Comida fuera", "Ropa": "Compra de ropa", "Salidas y ocio": "Cine / salidas",
        "Cuidado personal": "Peluquería / farmacia", "Fondo de emergencia": "Transferencia a ahorro",
        "Viaje": "Ahorro para viaje", "Pensión voluntaria": "Aporte voluntario", "Préstamo personal": "Cuota mensual",
        "Crédito del carro": "Cuota mensual"}
for m in ([] if BLANK else range(1, 12)):
    for g, lst in enumerate(CATS):
        for (n, d, amt, acc) in lst:
            if n == "Mercado":
                for wk in (3, 10, 17, 24):
                    tx.append((datetime.date(YEAR, m, wk), n, acc, desc[n], round(amt/4*random.uniform(0.85, 1.2), -2)))
                continue
            if g in (0, 1, 2, 5) and n not in ("Transporte",):
                v = amt if g != 0 or n == "Salario" else round(amt*random.uniform(0.6, 1.4), -3)
            elif g == 4:
                v = amt if random.random() > 0.15 else round(amt*0.5, -3)
            else:
                v = round(amt*random.uniform(0.6, 1.35), -2)
            day = min(d or random.randint(2, 27), 28)
            if CUR.get(acc) == "USD": v = round(v / TRM0, 2)
            if g == 4: tx.append((datetime.date(YEAR, m, day), n, acc, desc[n], v, "Cuenta de ahorros"))
            else: tx.append((datetime.date(YEAR, m, day), n, acc, desc[n], v))
    tx.append((datetime.date(YEAR, m, 1), None, "Cuenta principal", "Retiro de efectivo del cajero", 700000, "Efectivo"))
    if m % 3 == 0:
        tx.append((datetime.date(YEAR, m, 20), None, "Cuenta en dólares", "Cambio de dólares a pesos", 1200, "Cuenta principal", round(1200 * random.uniform(3900, 4150), -3)))
    if m > 1:
        deuda = round(sum(t[4] for t in tx if t[2] == "Tarjeta de crédito" and t[1] and t[0].month == m - 1), 0)
        tx.append((datetime.date(YEAR, m, 6), None, "Cuenta principal", "Pago total de la tarjeta (mes anterior)", deuda, "Tarjeta de crédito"))
if BLANK: tx = []
tx.sort(key=lambda x: (x[0], x[2]))
for i, (dte, n, acc, ds, v, *dst) in enumerate(tx):
    r = R0 + i
    rg[f"B{r}"].value = dte; rg[f"C{r}"].value = n; rg[f"E{r}"].value = acc; rg[f"G{r}"].value = ds; rg[f"H{r}"].value = v
    if dst: rg[f"F{r}"].value = dst[0]
    if len(dst) > 1: rg[f"J{r}"].value = dst[1]
RG = lambda c: f"Registro!${c}${R0}:${c}${R1}"

# ---------------------------------------------------------------- RESUMEN MENSUAL
rs = wb.create_sheet("Resumen Mensual"); rs.sheet_properties.tabColor = NAVY
band(rs, "Resumen Mensual", "Elige el mes en la celda amarilla. Compara lo planeado contra lo real en cada grupo y categoría. Diferencia en rojo = te pasaste del presupuesto (o el ingreso fue menor).", 14, 8)
for c, w in {"A":2,"B":24,"C":14,"D":14,"E":14,"F":11,"G":3}.items(): rs.column_dimensions[c].width = w
for c in "HIJKLMN": rs.column_dimensions[c].width = 11
cell(rs, "B5", "Selecciona el mes", bold=True, color="FFFFFF", bg=NAVY, al=CENTER)
cell(rs, "C5", "Noviembre", bold=True, bg="FFE58F", al=CENTER, border=True)
dv_m = DataValidation(type="list", formula1=f"={MONTHS}"); rs.add_data_validation(dv_m); dv_m.add("C5")
cell(rs, "D5", f"=MATCH(C5,{MONTHS},0)", color="888888", fmt='"mes "0', al=CENTER)
cell(rs, "E5", f'="Año "&{YR}', color="888888", al=CENTER)
MES = "$D$5"
# group summary
header(rs, "B11", "Grupo"); header(rs, "C11", "Presupuestado"); header(rs, "D11", "Real"); header(rs, "E11", "Diferencia"); header(rs, "F11", "% usado")
for g in range(6):
    r = 12 + g; t = TITLE[g]
    cell(rs, f"B{r}", TIPOS[g], bold=True, color=TCOLOR[g], border=True)
    cell(rs, f"C{r}", f"=INDEX(Presupuesto!$E${t}:$P${t},{MES})", border=True, fmt=MONEY)
    cell(rs, f"D{r}", f'=SUMIFS({RG("K")},{RG("D")},B{r},{RG("M")},{MES},{RG("N")},{YR})', border=True, fmt=MONEY)
    diff = f"=D{r}-C{r}" if g == 0 else f"=C{r}-D{r}"
    cell(rs, f"E{r}", diff, bold=True, border=True, fmt=MONEY)
    cell(rs, f"F{r}", f'=IF(C{r}=0,"",D{r}/C{r})', border=True, fmt=PCT, al=CENTER)
# KPI cards
cards = [("B", "B", "Ingresos del mes", "=D12", NAVY),
         ("C", "D", "Gastos + deudas", "=D13+D14+D15+D17", ORANGE),
         ("E", "F", "Ahorro e inversión", "=D16", GREEN),
         ("H", "J", "Te queda libre", "=D12-SUM(D13:D17)", TEAL)]
for a, b, lab, fml, col in cards:
    if a != b: rs.merge_cells(f"{a}7:{b}7"); rs.merge_cells(f"{a}8:{b}9")
    else: rs.merge_cells(f"{a}8:{b}9")
    cell(rs, f"{a}7", lab, bold=True, color="FFFFFF", bg=col, al=CENTER)
    cell(rs, f"{a}8", fml, bold=True, size=15, color=col, bg=LIGHT, fmt=MONEY, al=CENTER)
    for rr in (8, 9):
        for cc in range(rs[a+"1"].column, rs[b+"1"].column + 1): rs.cell(rr, cc).fill = fill(LIGHT)
rs.conditional_formatting.add("E12:E17", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=F, bold=True, color=RED), fill=fill("FBE3E0")))
rs.conditional_formatting.add("H8", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=F, bold=True, size=15, color=RED)))
# detail per category
r = 20
cell(rs, "B19", "Detalle por categoría", bold=True, size=12, color=NAVY)
DETAIL_END = None
for g in range(6):
    t = TITLE[g]
    for j, h in enumerate([TIPOS[g], "Presupuestado", "Real", "Diferencia", "% usado"]):
        header(rs, f"{L(2+j)}{r}", h, TCOLOR[g])
    r += 1
    for i in range(NCAT):
        pr_r = t + 1 + i
        if i >= max(len(CATS[g]) + 3, 10 if BLANK else 6):
            # keep table shorter: still linked rows, but grouped (collapsible)
            rs.row_dimensions[r].outlineLevel = 1; rs.row_dimensions[r].hidden = True
        cell(rs, f"B{r}", f"=Presupuesto!B{pr_r}", border=True)
        cell(rs, f"C{r}", f'=IF(B{r}="","",INDEX(Presupuesto!$E${pr_r}:$P${pr_r},{MES}))', border=True, fmt=MONEY)
        cell(rs, f"D{r}", f'=IF(B{r}="","",SUMIFS({RG("K")},{RG("C")},B{r},{RG("M")},{MES},{RG("N")},{YR}))', border=True, fmt=MONEY)
        diff = f'=IF(B{r}="","",D{r}-C{r})' if g == 0 else f'=IF(B{r}="","",C{r}-D{r})'
        cell(rs, f"E{r}", diff, border=True, fmt=MONEY)
        cell(rs, f"F{r}", f'=IF(OR(B{r}="",N(C{r})=0),"",D{r}/C{r})', border=True, fmt=PCT, al=CENTER)
        r += 1
    r += 1
rs.conditional_formatting.add(f"E21:E{r}", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=F, color=RED, bold=True)))
cell(rs, f"B{r}", "Tip: las filas vacías de cada grupo están agrupadas; usa el botón [+] a la izquierda para mostrarlas si agregas más categorías.", italic=True, color="777777", size=9)
ch = BarChart(); ch.type = "bar"; ch.grouping = "clustered"; ch.title = "Presupuestado vs. real"
ch.add_data(Reference(rs, min_col=3, max_col=4, min_row=11, max_row=17), titles_from_data=True)
ch.set_categories(Reference(rs, min_col=2, min_row=12, max_row=17))
ch.y_axis.numFmt = '"$"#,##0'; ch.height = 7.5; ch.width = 15
ch.series[0].graphicalProperties.solidFill = "B8C4D2"; ch.series[1].graphicalProperties.solidFill = TEAL
ch.x_axis.scaling.orientation = "maxMin"; ch.x_axis.tickLblSkip = 1
rs.add_chart(ch, "H11")
rs.freeze_panes = "A6"

# ---------------------------------------------------------------- METAS DE AHORRO
mt = wb.create_sheet("Metas de Ahorro"); mt.sheet_properties.tabColor = GREEN
band(mt, "Metas de Ahorro", "Escribe tus metas: el nombre debe ser una categoría del grupo 'Ahorro e inversión'. Todo lo que registres en esa categoría suma a la meta y verás cuánto apartar cada mes para llegar a tiempo.", 12, 7)
for c, w in {"A":2,"B":22,"C":13,"D":13,"E":13,"F":13,"G":13,"H":13,"I":9,"J":24,"K":10,"L":15}.items(): mt.column_dimensions[c].width = w
heads = ["Meta", "Monto meta", "Ahorro inicial", "Fecha objetivo", "Aportado (registro)", "Ahorrado total", "Faltante", "Progreso", "", "Meses restantes", "Apartar al mes"]
for i, h in enumerate(heads): header(mt, f"{L(2+i)}11", h, GREEN)
mt.merge_cells("I11:J11")
dv_goal = DataValidation(type="list", formula1=f"={CFG}!$R$8:$R$27", allow_blank=True); mt.add_data_validation(dv_goal)
goals = [("Fondo de emergencia", 15000000, 3000000, datetime.date(2027, 12, 31)),
         ("Viaje", 6000000, 500000, datetime.date(2027, 7, 31)),
         ("Pensión voluntaria", 80000000, 10000000, datetime.date(2035, 12, 31))]
if BLANK: goals = []
NG = len(goals) or 10
G0, G1 = 12, 21
for r in range(G0, G1 + 1):
    for c in "BCDE": cell(mt, f"{c}{r}", bg=INPUT, border=True)
    dv_goal.add(f"B{r}")
    mt[f"C{r}"].number_format = mt[f"D{r}"].number_format = MONEY; mt[f"E{r}"].number_format = "dd/mm/yyyy"
    cell(mt, f"F{r}", f'=IF(B{r}="","",SUMIFS({RG("K")},{RG("C")},B{r}))', border=True, fmt=MONEY)
    cell(mt, f"G{r}", f'=IF(B{r}="","",N(D{r})+F{r})', bold=True, border=True, fmt=MONEY)
    cell(mt, f"H{r}", f'=IF(B{r}="","",MAX(0,N(C{r})-G{r}))', border=True, fmt=MONEY)
    cell(mt, f"I{r}", f'=IF(OR(B{r}="",N(C{r})=0),"",MIN(1,G{r}/C{r}))', bold=True, color=GREEN, border=True, fmt="0%", al=CENTER)
    cell(mt, f"J{r}", f'=IF(I{r}="","",REPT("█",ROUND(I{r}*15,0))&REPT("░",15-ROUND(I{r}*15,0)))', color=GREEN, border=True)
    cell(mt, f"K{r}", f'=IF(OR(B{r}="",E{r}=""),"",MAX(0,(YEAR(E{r})-YEAR(TODAY()))*12+MONTH(E{r})-MONTH(TODAY())))', border=True, al=CENTER)
    cell(mt, f"L{r}", f'=IF(K{r}="","",IF(K{r}=0,H{r},H{r}/K{r}))', bold=True, border=True, fmt=MONEY)
for i, (n, a, ini, d) in enumerate(goals):
    r = G0 + i; mt[f"B{r}"].value = n; mt[f"C{r}"].value = a; mt[f"D{r}"].value = ini; mt[f"E{r}"].value = d
kp = [("B", "C", "Total de mis metas", f"=SUM(C{G0}:C{G1})", NAVY),
      ("D", "E", "Ahorrado hasta hoy", f"=SUM(G{G0}:G{G1})", GREEN),
      ("F", "G", "Me falta", f"=SUM(H{G0}:H{G1})", ORANGE),
      ("H", "J", "Apartar cada mes", f"=SUM(L{G0}:L{G1})", TEAL)]
for a, b, lab, fml, col in kp:
    mt.merge_cells(f"{a}6:{b}6"); mt.merge_cells(f"{a}7:{b}8")
    cell(mt, f"{a}6", lab, bold=True, color="FFFFFF", bg=col, al=CENTER)
    cell(mt, f"{a}7", fml, bold=True, size=15, color=col, fmt=MONEY, al=CENTER)
    for rr in (7, 8):
        for cc in range(mt[a+"1"].column, mt[b+"1"].column + 1): mt.cell(rr, cc).fill = fill(LIGHT)
mt.merge_cells("K6:L6"); mt.merge_cells("K7:L8")
cell(mt, "K6", "Progreso general", bold=True, color="FFFFFF", bg=GREEN, al=CENTER)
cell(mt, "K7", f"=IF(B7=0,0,D7/B7)", bold=True, size=15, color=GREEN, fmt="0%", al=CENTER)
for rr in (7, 8):
    for cc in (11, 12): mt.cell(rr, cc).fill = fill(LIGHT)
ch = BarChart(); ch.type = "col"; ch.grouping = "percentStacked"; ch.overlap = 100
ch.title = "Progreso de cada meta"
ch.add_data(Reference(mt, min_col=7, max_col=8, min_row=11, max_row=G0 + NG - 1), titles_from_data=True)
ch.set_categories(Reference(mt, min_col=2, min_row=G0, max_row=G0 + NG - 1))
ch.series[0].graphicalProperties.solidFill = GREEN; ch.series[1].graphicalProperties.solidFill = "D5DEE7"
ch.y_axis.numFmt = "0%"; ch.height = 7.5; ch.width = 16
mt.add_chart(ch, "B24")
pc = PieChart(); pc.title = "Distribución de lo ahorrado"
pc.add_data(Reference(mt, min_col=7, min_row=11, max_row=G0 + NG - 1), titles_from_data=True)
pc.set_categories(Reference(mt, min_col=2, min_row=G0, max_row=G0 + NG - 1))
pc.dataLabels = DataLabelList(); pc.dataLabels.showPercent = True; pc.dataLabels.showVal = False; pc.dataLabels.showSerName = False; pc.dataLabels.showCatName = False; pc.dataLabels.showLegendKey = False
pc.height = 7.5; pc.width = 11
mt.add_chart(pc, "I24")
cell(mt, "B23", "Para que el gráfico muestre más metas, amplía su rango de datos (clic derecho > editar).", italic=True, size=9, color="777777")

# ---------------------------------------------------------------- BALANCE DE CUENTAS
bc = wb.create_sheet("Balance de Cuentas"); bc.sheet_properties.tabColor = TEAL
band(bc, "Balance de Cuentas", "Saldo actual de cada cuenta (saldo inicial + entradas - salidas del año). Una tarjeta de crédito en negativo = lo que debes en ella. Abajo: lo planeado vs. lo real del mes que elijas.", 12, 7)
for c, w in {"A":2,"B":22,"C":8,"D":14,"E":14,"F":14,"G":14,"H":15,"I":2,"J":14,"K":14,"L":14,"M":14,"N":14}.items(): bc.column_dimensions[c].width = w
cell(bc, "B5", "Selecciona el mes", bold=True, color="FFFFFF", bg=NAVY, al=CENTER)
cell(bc, "C5", "Noviembre", bold=True, bg="FFE58F", al=CENTER, border=True)
bc.merge_cells("C5:D5")
dv_m2 = DataValidation(type="list", formula1=f"={MONTHS}"); bc.add_data_validation(dv_m2); dv_m2.add("C5")
cell(bc, "E5", f"=MATCH(C5,{MONTHS},0)", color="888888", fmt='"mes "0', al=CENTER)
cell(bc, "F5", f'="TRM: $"&TEXT({TRM},"#,##0")', color="888888", al=CENTER)
MSEL = "$E$5"
bc.merge_cells("B7:H7"); header(bc, "B7", "Saldo de tus cuentas en el año (cada una en su moneda)", TEAL)
bc.merge_cells("J7:N7"); header(bc, "J7", "Mes elegido en pesos: planeado vs. real (sin transferencias)", NAVY)
for i, h in enumerate(["Cuenta", "Moneda", "Saldo inicial", "Entradas", "Salidas", "Saldo actual", "Saldo en pesos"]): header(bc, f"{L(2+i)}8", h, "DDE3EA", "222222")
for i, h in enumerate(["Entradas plan", "Entradas reales", "Salidas plan", "Salidas reales", "Diferencia neta"]): header(bc, f"{L(10+i)}8", h, "DDE3EA", "222222")
PI = f"INDEX(Presupuesto!$E${TITLE[0]+1}:$P${TITLE[0]+NCAT},0,{MSEL})"
PA = f"INDEX(Presupuesto!$E${TITLE[0]+1}:$P${PLAST},0,{MSEL})"
for i in range(10):
    r = 9 + i; cr = 8 + i
    cell(bc, f"B{r}", f'=IF({CFG}!B{cr}="","",{CFG}!B{cr})', bold=True, border=True)
    cell(bc, f"C{r}", f'=IF(B{r}="","",IF({CFG}!C{cr}="","COP",{CFG}!C{cr}))', border=True, al=CENTER)
    cell(bc, f"D{r}", f'=IF(B{r}="","",N({CFG}!D{cr}))', border=True, fmt=NATIVE)
    cell(bc, f"E{r}", f'=IF(B{r}="","",SUMIFS({RG("H")},{RG("E")},B{r},{RG("D")},"Ingresos",{RG("N")},{YR})+SUMIFS({RG("L")},{RG("F")},B{r},{RG("N")},{YR}))', border=True, fmt=NATIVE)
    cell(bc, f"F{r}", f'=IF(B{r}="","",SUMIFS({RG("H")},{RG("E")},B{r},{RG("N")},{YR})-SUMIFS({RG("H")},{RG("E")},B{r},{RG("D")},"Ingresos",{RG("N")},{YR}))', border=True, fmt=NATIVE)
    cell(bc, f"G{r}", f'=IF(B{r}="","",D{r}+E{r}-F{r})', bold=True, bg=LIGHT, border=True, fmt=NATIVE)
    cell(bc, f"H{r}", f'=IF(B{r}="","",IF(C{r}="USD",G{r}*{TRM},G{r}))', bold=True, bg=LIGHT, border=True, fmt=MONEY)
    cell(bc, f"J{r}", f'=IF(B{r}="","",SUMIFS({PI},Presupuesto!$C${TITLE[0]+1}:$C${TITLE[0]+NCAT},B{r}))', border=True, fmt=MONEY)
    cell(bc, f"K{r}", f'=IF(B{r}="","",SUMIFS({RG("K")},{RG("E")},B{r},{RG("D")},"Ingresos",{RG("M")},{MSEL},{RG("N")},{YR}))', border=True, fmt=MONEY)
    cell(bc, f"L{r}", f'=IF(B{r}="","",SUMIFS({PA},Presupuesto!$C${TITLE[0]+1}:$C${PLAST},B{r})-J{r})', border=True, fmt=MONEY)
    cell(bc, f"M{r}", f'=IF(B{r}="","",SUMIFS({RG("K")},{RG("E")},B{r},{RG("D")},"<>Transferencia",{RG("M")},{MSEL},{RG("N")},{YR})-K{r})', border=True, fmt=MONEY)
    cell(bc, f"N{r}", f'=IF(B{r}="","",(K{r}-M{r})-(J{r}-L{r}))', bold=True, border=True, fmt=MONEY)
cell(bc, "B19", "Total en pesos", bold=True, color="FFFFFF", bg=NAVY, border=True)
for c in "CDEFG": cell(bc, f"{c}19", "", bg=NAVY, border=True)
for c in "HJKLMN":
    cell(bc, f"{c}19", f"=SUM({c}9:{c}18)", bold=True, color="FFFFFF", bg=NAVY, border=True, fmt='"$"#,##0;-"$"#,##0;"-"')
bc.conditional_formatting.add("G9:H18", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=F, bold=True, color=RED)))
bc.conditional_formatting.add("N9:N18", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=F, bold=True, color=RED)))
notas = ["Diferencia neta = (entradas reales - salidas reales) - (entradas plan - salidas plan). Negativo = salió más dinero del planeado de esa cuenta.",
         "Tarjeta de crédito: regístrala como cuenta con saldo inicial = lo que debes, en negativo. Cada compra la hace más negativa; cada pago desde tu banco la acerca a $0.",
         "Transferencias entre tus cuentas (retiro de cajero, pago de tarjeta, cambio de dólares) mueven el saldo de ambas cuentas, pero no cuentan como ingreso ni gasto."]
for k, t in enumerate(notas): cell(bc, f"B{21+k}", t, italic=True, size=9, color="777777")
ch = BarChart(); ch.type = "col"; ch.title = "Saldo actual por cuenta (en pesos)"
ch.add_data(Reference(bc, min_col=8, min_row=8, max_row=8 + (len(cuentas) or 10)), titles_from_data=True)
ch.set_categories(Reference(bc, min_col=2, min_row=9, max_row=8 + (len(cuentas) or 10)))
ch.series[0].graphicalProperties.solidFill = TEAL; ch.legend = None
ch.y_axis.numFmt = '"$"#,##0'; ch.height = 7; ch.width = 18
bc.add_chart(ch, "B25")

# ---------------------------------------------------------------- REPORTE ANUAL
ra = wb.create_sheet("Reporte Anual"); ra.sheet_properties.tabColor = RED
band(ra, "Reporte Anual", "Tu año completo con lo REAL registrado. Se actualiza solo con lo que anotas en Registro.", 16, 8)
ra.column_dimensions["A"].width = 2; ra.column_dimensions["B"].width = 24
for i in range(12): ra.column_dimensions[L(3+i)].width = 10
ra.column_dimensions["O"].width = 12; ra.column_dimensions["P"].width = 12
def ra_head(r, title):
    header(ra, f"B{r}", title)
    for i, m in enumerate(MCORTO): header(ra, f"{L(3+i)}{r}", m)
    header(ra, f"O{r}", "Total"); header(ra, f"P{r}", "Promedio")
ra_head(6, "Real")
for g in range(6):
    r = 7 + g
    cell(ra, f"B{r}", TIPOS[g], bold=True, color=TCOLOR[g], border=True)
    for j in range(12):
        cell(ra, f"{L(3+j)}{r}", f'=SUMIFS({RG("K")},{RG("D")},$B{r},{RG("M")},{j+1},{RG("N")},{YR})', border=True, fmt=MONEY)
    cell(ra, f"O{r}", f"=SUM(C{r}:N{r})", bold=True, bg=LIGHT, border=True, fmt=MONEY)
    cell(ra, f"P{r}", f'=IF(COUNTIF(C{r}:N{r},">0")=0,0,O{r}/COUNTIF(C{r}:N{r},">0"))', bg=LIGHT, border=True, fmt=MONEY)
rows_extra = [("Total salidas", "=SUM({c}8:{c}12)"), ("Balance (entra - sale)", "={c}7-{c}13"),
              ("Tasa de ahorro", '=IF({c}7=0,"",{c}11/{c}7)')]
for k, (lab, f_) in enumerate(rows_extra):
    r = 13 + k
    cell(ra, f"B{r}", lab, bold=True, color="FFFFFF", bg=NAVY, border=True)
    for j in range(14):
        c = L(3+j)
        if k == 2 and j == 13:
            cell(ra, f"{c}{r}", "", bg=LIGHT, border=True); continue
        cell(ra, f"{c}{r}", f_.format(c=c), bold=True, bg=LIGHT, border=True, fmt=PCT if k == 2 else MONEY)
ra.conditional_formatting.add("C14:P14", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=F, bold=True, color=RED)))
ra_head(18, "Presupuestado")
for g in range(6):
    r = 19 + g; t = TITLE[g]
    cell(ra, f"B{r}", TIPOS[g], bold=True, color=TCOLOR[g], border=True)
    for j in range(13):
        cell(ra, f"{L(3+j)}{r}", f"=Presupuesto!{L(5+j)}{t}", border=True, fmt=MONEY, bg=LIGHT if j == 12 else None)
    cell(ra, f"P{r}", f"=O{r}/12", border=True, fmt=MONEY, bg=LIGHT)
ra_head(26, "Cumplimiento (real ÷ plan)")
for g in range(6):
    r = 27 + g
    cell(ra, f"B{r}", TIPOS[g], bold=True, color=TCOLOR[g], border=True)
    for j in range(13):
        c = L(3+j)
        cell(ra, f"{c}{r}", f'=IF({c}{19+g}=0,"",{c}{7+g}/{c}{19+g})', border=True, fmt=PCT, al=CENTER)
    cell(ra, f"P{r}", "", border=True)
ra.conditional_formatting.add("C28:O30", CellIsRule(operator="greaterThan", formula=["1.05"], font=Font(name=F, bold=True, color=RED), fill=fill("FBE3E0")))
ch = BarChart(); ch.type = "col"; ch.title = "Ingresos vs. salidas por mes"
ch.add_data(Reference(ra, min_col=2, max_col=14, min_row=7, max_row=7), from_rows=True, titles_from_data=True)
ch.add_data(Reference(ra, min_col=2, max_col=14, min_row=13, max_row=13), from_rows=True, titles_from_data=True)
ch.set_categories(Reference(ra, min_col=3, max_col=14, min_row=6, max_row=6))
ch.series[0].graphicalProperties.solidFill = NAVY; ch.series[1].graphicalProperties.solidFill = ORANGE
ch.y_axis.numFmt = '"$"#,##0'; ch.height = 8; ch.width = 20
ra.add_chart(ch, "B34")
pc = PieChart(); pc.title = "¿A dónde fue tu dinero este año?"
pc.add_data(Reference(ra, min_col=15, min_row=8, max_row=12))
pc.set_categories(Reference(ra, min_col=2, min_row=8, max_row=12))
pc.dataLabels = DataLabelList(); pc.dataLabels.showPercent = True; pc.dataLabels.showVal = False; pc.dataLabels.showSerName = False; pc.dataLabels.showCatName = False; pc.dataLabels.showLegendKey = False
pc.height = 8; pc.width = 12
ra.add_chart(pc, "L34")
r = 52
cell(ra, "B51", "Detalle por categoría (real)", bold=True, size=12, color=NAVY)
for g in range(6):
    t = TITLE[g]
    header(ra, f"B{r}", TIPOS[g], TCOLOR[g])
    for i, m in enumerate(MCORTO): header(ra, f"{L(3+i)}{r}", m, TCOLOR[g])
    header(ra, f"O{r}", "Total", TCOLOR[g]); header(ra, f"P{r}", "Promedio", TCOLOR[g])
    r += 1; first = r
    for i in range(NCAT):
        if i >= max(len(CATS[g]) + 3, 10 if BLANK else 6):
            ra.row_dimensions[r].outlineLevel = 1; ra.row_dimensions[r].hidden = True
        cell(ra, f"B{r}", f"=Presupuesto!B{t+1+i}", border=True)
        for j in range(12):
            cell(ra, f"{L(3+j)}{r}", f'=IF($B{r}="","",SUMIFS({RG("K")},{RG("C")},$B{r},{RG("M")},{j+1},{RG("N")},{YR}))', border=True, fmt=MONEY)
        cell(ra, f"O{r}", f'=IF($B{r}="","",SUM(C{r}:N{r}))', bold=True, bg=LIGHT, border=True, fmt=MONEY)
        cell(ra, f"P{r}", f'=IF($B{r}="","",O{r}/12)', bg=LIGHT, border=True, fmt=MONEY)
        r += 1
    cell(ra, f"B{r}", "Total", bold=True, color="FFFFFF", bg=NAVY, border=True)
    for j in range(14):
        c = L(3+j)
        cell(ra, f"{c}{r}", f"=SUM({c}{first}:{c}{r-1})", bold=True, color="FFFFFF", bg=NAVY, border=True, fmt=MONEY)
    r += 2
ra.freeze_panes = "C7"

# chart hygiene
for ws in wb.worksheets:
    for c in ws._charts:
        c.roundedCorners = False
        if c.legend is not None:
            c.legend.overlay = False; c.legend.position = "b"
        if c.title is not None and hasattr(c.title, "overlay"): c.title.overlay = False
        if hasattr(c, "x_axis") and not isinstance(c, PieChart):
            c.x_axis.delete = False; c.y_axis.delete = False
    ws.sheet_view.zoomScale = 100
for ws in wb.worksheets:
    for row in ws.iter_rows():
        for c in row:
            if c.font is None or c.font.name != F:
                c.font = Font(name=F, size=c.font.size or 10, bold=c.font.bold, color=c.font.color, italic=c.font.italic)
wb.active = 0
wb.save(OUT)
print("ok", len(tx), "tx")
