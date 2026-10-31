import json
import os
from comum import RAIZ

# Dados do Atlas do Desenvolvimento Humano (Censo 2010)
# Fonte: http://www.atlasbrasil.org.br/
# IDH: Índice de Desenvolvimento Humano (0 a 1)
# Gini: Índice de Gini (0 a 1, quanto maior, mais desigual)

dados = {
    "11": {"idh": 0.639, "gini": 0.505},
    "12": {"idh": 0.663, "gini": 0.569},
    "13": {"idh": 0.674, "gini": 0.581},
    "14": {"idh": 0.669, "gini": 0.593},
    "15": {"idh": 0.646, "gini": 0.545},
    "16": {"idh": 0.688, "gini": 0.531},
    "17": {"idh": 0.699, "gini": 0.543},
    "21": {"idh": 0.639, "gini": 0.535},
    "22": {"idh": 0.646, "gini": 0.540},
    "23": {"idh": 0.682, "gini": 0.541},
    "24": {"idh": 0.684, "gini": 0.531},
    "25": {"idh": 0.658, "gini": 0.549},
    "26": {"idh": 0.673, "gini": 0.531},
    "27": {"idh": 0.631, "gini": 0.546},
    "28": {"idh": 0.665, "gini": 0.524},
    "29": {"idh": 0.660, "gini": 0.546},
    "31": {"idh": 0.731, "gini": 0.507},
    "32": {"idh": 0.740, "gini": 0.506},
    "33": {"idh": 0.761, "gini": 0.513},
    "35": {"idh": 0.783, "gini": 0.500},
    "41": {"idh": 0.749, "gini": 0.473},
    "42": {"idh": 0.774, "gini": 0.453},
    "43": {"idh": 0.746, "gini": 0.497},
    "50": {"idh": 0.729, "gini": 0.506},
    "51": {"idh": 0.725, "gini": 0.497},
    "52": {"idh": 0.735, "gini": 0.496},
    "53": {"idh": 0.824, "gini": 0.515},
}

with open(os.path.join(RAIZ, "public", "idh-gini.json"), "w", encoding="utf-8") as f:
    json.dump(dados, f, ensure_ascii=False)

print(f"Gerado public/idh-gini.json com {len(dados)} UFs")