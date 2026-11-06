import os
import re
import json
import requests
from comum import RAIZ

# Configurações
# Para rodar no GitHub Actions, ele puxa das variáveis de ambiente.
# Para rodar localmente, descomente e preencha as duas linhas abaixo:
# API_KEY = "AIzaSyCnszizaJEbpznbJOiVpfU1AKNJQhU2o0w"
# BLOG_ID = "2795541267460103925"

API_KEY = "AIzaSyCnszizaJEbpznbJOiVpfU1AKNJQhU2o0w"
BLOG_ID = "2795541267460103925"

SAIDA = os.path.join(RAIZ, "public", "artigos_historicos.json")

def extrair_ano(labels):
    # Procura etiquetas no formato ano-1822 ou ano-ac-0044
    for label in labels:
        match = re.match(r"ano-(ac-)?(\d+)", label, re.IGNORECASE)
        if match:
            is_ac = match.group(1)
            num = int(match.group(2))
            return -num if is_ac else num
    return None

def main():
    if not API_KEY or not BLOG_ID:
        print("Erro: Faltam as credenciais (GOOGLE_API_KEY ou BLOGGER_BLOG_ID).")
        return

    url = f"https://www.googleapis.com/blogger/v3/blogs/{BLOG_ID}/posts?key={API_KEY}&maxResults=500"
    print("Buscando artigos no Blogger...")
    
    try:
        resposta = requests.get(url, timeout=30)
        
        # Se o Blogger disser que nada mudou (304), paramos sem erro
        if resposta.status_code == 304:
            print("Nenhuma alteração detectada no Blogger desde a última atualização.")
            return
            
        resposta.raise_for_status()
        dados = resposta.json()
        
    except Exception as e:
        print(f"Erro ao acessar a API do Blogger: {e}")
        return

    artigos = []
    itens = dados.get("items", [])

    for item in itens:
        labels = item.get("labels", [])
        
        # Só inclui se tiver a etiqueta 'publicar-no-site'
        if "publicar-no-site" not in labels:
            continue
            
        ano_historico = extrair_ano(labels)
        if ano_historico is None:
            print(f"Artigo ignorado (sem ano válido): {item.get('title')}")
            continue

        artigos.append({
            "id": item.get("id"),
            "ano": ano_historico,
            "titulo": item.get("title"),
            "conteudo": item.get("content"),
            "dataPublicacao": item.get("published"),
            "url": item.get("url")
        })

    # Ordena pelo ano histórico (do mais antigo para o mais recente)
    artigos.sort(key=lambda x: x["ano"])

    resultado = {
        "total": len(artigos),
        "artigos": artigos
    }

    with open(SAIDA, "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)

    print(f"Sucesso! Gerado {SAIDA} com {len(artigos)} artigos.")

if __name__ == "__main__":
    main()