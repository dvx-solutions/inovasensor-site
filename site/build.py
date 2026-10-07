"""Monta index.html a partir de src/shell.html + src/sections/*.html.

  python build.py              -> index.html (todas as seções) + resumo do que vai para publicação
  python build.py --only hero  -> preview/hero.html (só a seção com id "hero")
  python build.py --list       -> imprime só os arquivos publicáveis (index.html, css/, js/, vendor/, assets/ usados)
  python build.py --dist       -> copia esses arquivos para dist/ (pasta pronta para hospedar)

JS das seções: a primeira (voo) entra como <script type="module">; as demais vão para o JSON
#alg-sections e o core.js importa cada uma quando a seção se aproxima (carga inicial leve).
"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLISH_DIRS = ("css", "js", "vendor", "assets")


def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()


def sections():
    d = os.path.join(ROOT, "src", "sections")
    out = []
    for name in sorted(os.listdir(d)):
        m = re.match(r"(\d+)-([a-z0-9-]+)\.html$", name)
        if m:
            out.append((m.group(2), os.path.join("src", "sections", name)))
    return out


def build(only=None, prefix=""):
    shell = read("src/shell.html")
    secs = [s for s in sections() if only is None or s[0] == only]
    if only and not secs:
        sys.exit(f"secao '{only}' nao encontrada em src/sections/")
    html, css, js, lazy = [], [], [], {}
    for i, (sid, path) in enumerate(secs):
        html.append(f"<!-- ===== {sid} ===== -->\n" + read(path).strip() + "\n")
        if os.path.exists(os.path.join(ROOT, "css", "sections", sid + ".css")):
            css.append(f'<link rel="stylesheet" href="{prefix}css/sections/{sid}.css">')
        if os.path.exists(os.path.join(ROOT, "js", "sections", sid + ".js")):
            if i == 0:
                js.append(f'<script type="module" src="{prefix}js/sections/{sid}.js"></script>')
            else:
                lazy[sid] = f"{prefix}js/sections/{sid}.js"
    js.append('<script type="application/json" id="alg-sections">' + json.dumps(lazy) + "</script>")
    page = (shell.replace("<!--SECTIONS-->", "\n".join(html))
                 .replace("<!--SECTION_CSS-->", "\n  ".join(css))
                 .replace("<!--SECTION_JS-->", "\n  ".join(js)))
    if prefix:  # preview/ fica um nível abaixo: corrige caminhos relativos do shell e das seções
        page = re.sub(r'(src|href|srcset|content)="(?!https?:|#|data:|mailto:|tel:|\.\./)(assets/|css/|js/|vendor/)',
                      lambda m: f'{m.group(1)}="../{m.group(2)}', page)
        page = re.sub(r'(,\s*)(assets/)', r'\1../\2', page)  # srcset com várias entradas
    return page


def write_atomic(rel, text):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + f".tmp{os.getpid()}"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, p)
    print("ok ->", rel)


def publish_set():
    """Arquivos que a página publicada usa: index.html + css/js/vendor/assets referenciados.

    Um arquivo de assets/ ou vendor/ conta como usado quando o caminho, o nome ou o radical
    (sem extensão e sem o sufixo -m das versões de celular) aparece entre aspas no HTML, CSS ou JS
    publicados: o voo monta nomes como 'd1-orbita' + sfx + '.mp4'."""
    files = ["index.html"]
    for d in ("css", "js"):
        for base, _, names in os.walk(os.path.join(ROOT, d)):
            files += [os.path.relpath(os.path.join(base, n), ROOT).replace("\\", "/") for n in names
                      if n.endswith((".css", ".js")) and ".tmp" not in n]
    text = "\n".join(read(f) for f in files)
    used, unused = [], []
    for d in ("vendor", "assets"):
        for base, _, names in os.walk(os.path.join(ROOT, d)):
            for n in sorted(names):
                rel = os.path.relpath(os.path.join(base, n), ROOT).replace("\\", "/")
                stem = re.sub(r"-m$", "", os.path.splitext(n)[0])
                hit = (rel in text or n in text or re.search(r"""['"`]%s['"`]""" % re.escape(stem), text))
                (used if hit else unused).append(rel)
    return sorted(files) + used, unused


if __name__ == "__main__":
    if "--only" in sys.argv:
        sid = sys.argv[sys.argv.index("--only") + 1]
        write_atomic(f"preview/{sid}.html", build(sid, prefix="../"))
        sys.exit(0)
    write_atomic("index.html", build())
    pub, unused = publish_set()
    if "--list" in sys.argv:
        print("\n".join(pub))
    elif "--dist" in sys.argv:
        out = os.path.join(ROOT, "dist")
        shutil.rmtree(out, ignore_errors=True)
        for rel in pub:
            dst = os.path.join(out, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(ROOT, rel), dst)
        print(f"dist/ -> {len(pub)} arquivos")
    else:
        size = sum(os.path.getsize(os.path.join(ROOT, f)) for f in pub)
        print(f"publicar: {len(pub)} arquivos, {size / 1048576:.1f} MB (python build.py --list)")
    if unused:
        print("fora da publicacao (nao referenciados):", ", ".join(unused))
