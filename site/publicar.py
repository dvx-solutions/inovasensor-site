"""Publica o site estático do Algeye em ../public.

Fonte: site/src (seções), site/css, site/js, site/vendor.
Os arquivos pesados (assets: vídeo do voo, fotos, fontes, logos) moram só em ../public/assets.

    cd site && python publicar.py
    # pré-visualizar: cd ../public && python -m http.server 5512
"""
import os, shutil, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(AQUI, "..", "public")

subprocess.run([sys.executable, os.path.join(AQUI, "build.py")], check=True, cwd=AQUI)
shutil.copy2(os.path.join(AQUI, "index.html"), os.path.join(PUB, "index.html"))
for d in ("css", "js", "vendor"):
    destino = os.path.join(PUB, d)
    if os.path.isdir(destino):
        shutil.rmtree(destino)
    shutil.copytree(os.path.join(AQUI, d), destino,
                    ignore=shutil.ignore_patterns("scrub-engine.js") if d == "vendor" else None)
print("publicado em", os.path.normpath(PUB))
