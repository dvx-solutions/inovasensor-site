# Voo da abertura no Higgsfield: plano de execução

Abertura do site Algeye: satélite → represa → água. Este documento deixa tudo pronto para gerar o voo **sem decisões pendentes de direção**. Nada foi gerado e nenhum crédito foi gasto ao escrever este plano. Também não houve consulta de custo (`get_cost`).

Fontes que este plano segue: `BRIEF.md` (seções 3 e 7), skill `scroll-world` (SKILL.md, prompts.md, pipeline.md, scrub-engine.js, index-template.html), skill `algeye-post` (Imagens no Higgsfield, Identidade visual, princípios visuais), `algeye-produto-validado.md` e o esquema dos modelos conferido no catálogo do Higgsfield em 06/10/2026 (`models_explore get`, consulta sem custo).

Regra de texto deste arquivo: sem travessão. Os prompts estão em inglês porque os modelos respondem melhor assim. Todo texto visível no site fica em PT-BR.

---

## 0. Decisões tomadas (e o porquê)

| Decisão | Escolha | Motivo |
|---|---|---|
| Direção de arte | Fotorrealismo documental, luz de manhã | Princípio da marca: "vida primeiro, dado depois", luz natural de manhã, precisão silenciosa. Diorama de argila destoaria do tom Sábio + Cuidador. |
| Arquitetura de câmera | **B adaptada: descida contínua.** São 3 dive-ins + 2 conectores, e a câmera **nunca sobe nem recua** | A skill avisa que a arquitetura B recua a câmera em cada emenda, o que vira "rebobinar" no fotorrealismo. Aqui os conectores **continuam descendo** (órbita → nuvens → represa → superfície → dentro d'água). A velocidade fica no mesmo sentido dos dois lados de cada emenda, e o defeito some. |
| Modelo da corrente | Um só modelo por corrente: `seedance_2_0_mini` 720p no rascunho e `seedance_2_0` `mode std` 1080p no final | Regra da skill: nunca misturar modelos dentro da corrente. O rascunho é a prévia completa; o final é renderizado inteiro de novo (não se emenda clipe do rascunho com clipe do final). |
| Duração | **5 s em todos os clipes** (dive-ins e conectores) | São exatamente os valores medidos no BRIEF (5 e 45 créditos por clipe de 5 s), sem extrapolar. Com dive-ins de 8 s o total chegaria a 90% do saldo (ver seção 5). 5 s a 24 fps dão 120 quadros por clipe, sobra para uma rolagem de herói. |
| Mobile | Corrente nativa **9:16** separada, como a skill exige; o recorte de 16:9 não vale como versão mobile | A skill proíbe entregar o recorte central como versão mobile sem aprovação explícita. O custo extra (~2×) está na tabela da seção 5. |
| Imagens-chave | `gpt_image_2_5`, um preâmbulo idêntico byte a byte nas 6 imagens | Coesão do mundo (regra da skill). |
| Áudio | `generate_audio: false` em todo clipe | O padrão do modelo é `true`. O vídeo vai mudo no site. |

---

## (a) Direção de arte do voo

**Ideia em uma linha:** um olhar calmo que desce do espaço até dentro da água, de manhã cedo, com cuidado e sem drama.

- **Luz:** manhã cedo, sol baixo e morno, sombras suaves e levantadas, uma névoa leve nos braços da represa. Nada de pôr do sol laranja (proibido na marca), nada de tempestade, nada de escuridão: a preocupação vem por contraste, nunca por breu.
- **Paleta (manual de marca):** verdes de mata atlântica viva; água em verde-petróleo `#0E5C4A` e `#2F8A7A`; realces em areia `#D8CCB4` e menta `#BFF0DC`; sombras em grafite `#0A100F`. **Proibidos:** azul saturado, "planeta azul/espaço genérico", neon, verde-limão, roxo, laranja de pôr do sol.
  - Órbita sem cara de "espaço genérico": a Terra ocupa 2/3 do quadro com terra verde e areia; o oceano, quando aparece, fica no horizonte em petróleo-grafite dessaturado; a borda da atmosfera vem em menta e branco; o espaço é só uma faixa estreita de grafite, sem estrelas.
- **Represa GENÉRICA e não identificável:** forma inventada, com braços dendríticos entre morros de mata. Sem cidade, estrada, ponte, barco, placa, estrutura reconhecível ou litoral real. A barragem é um muro curto de concreto liso, sem casa de força e sem marcação. Nenhuma geografia que permita deduzir estado ou região (regra 1).
- **Sem texto na imagem:** sem letras, números, logos, bandeiras ou placas.
- **Sem sinal que pareça dado real:** nada de manchas coloridas que lembrem mapa de calor ou produto de satélite, sem grade, sem contorno, sem interface, sem marcador. A superfície da represa aparece saudável e bonita (vida primeiro). A sugestão de algas aparece **só na cena subaquática**, como partículas verdes suspensas iluminadas pela luz, numa represa fictícia, e não como floração associada a um reservatório identificável (regras 7 e 8).
- **Satélite:** genérico, pequeno, grafite e metal claro, uma asa de painel, sem logo e sem marcação. Não pode lembrar uma missão real (regra 2: nenhum satélite nomeado ou reconhecível). O satélite é ferramenta, não herói: ele **passa e sai de quadro**.
- **Sem pessoas, sem peixe morto, sem lixo, sem bolhas de poluição** (regra 10).
- **Espaço para o texto das batidas:** no 16:9, o terço esquerdo fica calmo e mais escuro (os `[data-beat]` ficam à esquerda); no 9:16, os 40% de baixo ficam calmos.
- **Aviso obrigatório no site, visível durante todo o voo:** `Imagem ilustrativa gerada por IA` (regra 8 e BRIEF §7). No rodapé, o shell já diz "Imagens marcadas como ilustrativas foram geradas por IA"; isso não substitui o rótulo no herói.

---

## (b) As 3 cenas: prompts exatos das imagens-chave

**Montagem do prompt (sempre nesta ordem, separada por uma linha em branco):**

```
PREÂMBULO (idêntico byte a byte nas 6 imagens)

SUBJECT_<cena>

FRAME_16x9   ou   FRAME_9x16
```

Para não haver diferença invisível (espaço no fim da linha, quebra de linha diferente), grave cada bloco num arquivo em `.voo-work/prompts/` e monte o prompt por concatenação. Cada bloco abaixo é **uma linha só**.

### PREÂMBULO (copiar exatamente)

```
Photorealistic cinematic still, documentary realism, quiet and attentive mood, a sense of responsibility without drama. Early morning natural light, low warm sun, soft lifted shadows, gentle haze. Cohesive palette: living Atlantic forest greens, water in deep teal-green #0E5C4A and #2F8A7A, warm sand highlights #D8CCB4, soft mint highlights #BFF0DC, shadows in graphite #0A100F. A fictional, generic, non-identifiable place: no recognizable coastline, landmark, city, town, road, bridge, boat, building or real-world geography. Absolutely no text, no letters, no numbers, no logos, no signage, no flags, no markings, no map overlays, no grid lines, no user interface, no colored patches that resemble a heat map or a satellite data product. No saturated blue, no sunset orange, no neon, no people, no pollution, no dead fish, no storm, no darkness.
```

### SUBJECT_orbita

```
Subject: view from low Earth orbit in early morning. A small generic Earth-observation satellite with a single solar panel wing, matte graphite and pale metal, with no markings and no logos, drifts in the upper right foreground, softly lit by the low sun. Far below, the curved Earth fills the lower two thirds of the frame: an unrecognizable fictional landmass of deep forest greens and sand-toned plains, a meandering river catching the light, a few small inland reservoirs as dark teal-green shapes, scattered white cumulus clouds casting soft shadows. One small reservoir sits near the center of the frame under a soft gap in the clouds. A thin pale mint and white atmospheric glow along the horizon; above it only a narrow band of deep graphite space with no visible stars. Calm, precise, quiet.
```

### SUBJECT_represa

```
Subject: straight-down aerial view from high altitude of one entire fictional reservoir seen whole, its dendritic arms reaching into forested valleys of a gently hilly landscape. The water is calm, deep teal-green, with soft sky reflections and thin morning mist lying in the arms. Margins of living Atlantic forest, small sandy banks in warm sand tones, rolling green hills all around. At one end, a short plain concrete dam wall with no structures, no markings and no roads. The whole reservoir fits inside the frame with forest around it. Healthy and beautiful, seen with care.
```

### SUBJECT_agua

```
Subject: just beneath the calm surface of the reservoir, looking slightly upward and forward into clear green-tinted fresh water. Soft shafts of morning sunlight fall through the water; the silvery underside of the surface ripples gently above. Fine suspended particles, tiny green microalgae specks and delicate filaments float in the water column, lit like dust in a sunbeam, a little denser toward the soft green depths. No fish, no rooted plants, no visible bottom, no debris. Serene, luminous and slightly mysterious, never dark or murky.
```

### FRAME_16x9 (desktop)

```
Wide 16:9 landscape frame. The main subject is centered slightly right of center; the left third of the frame is calm, uncluttered and slightly darker, leaving room for overlaid headline text. Nothing essential at the far edges.
```

### FRAME_9x16 (mobile)

```
Tall 9:16 vertical portrait frame. The main subject is centered in the upper middle of the frame; the lower 40% is calm and uncluttered, leaving room for overlaid text. Nothing essential at the far edges.
```

### Parâmetros das 6 imagens (`generate_image`)

| ID local | Prompt | aspect_ratio | medias | folder_id |
|---|---|---|---|---|
| `S1` órbita 16:9 | PREÂMBULO + SUBJECT_orbita + FRAME_16x9 | `16:9` | nenhuma | 01 Cenas `0300a82f-338b-4cc5-b1dc-0a169333726c` |
| `S2` represa 16:9 | PREÂMBULO + SUBJECT_represa + FRAME_16x9 | `16:9` | nenhuma | 01 Cenas |
| `S3` água 16:9 | PREÂMBULO + SUBJECT_agua + FRAME_16x9 | `16:9` | nenhuma | 01 Cenas |
| `S1m` órbita 9:16 | PREÂMBULO + SUBJECT_orbita + FRAME_9x16 | `9:16` | `[{value: <job_id S1 aprovado>, role: "image_references"}]` | 01 Cenas |
| `S2m` represa 9:16 | PREÂMBULO + SUBJECT_represa + FRAME_9x16 | `9:16` | `[{value: <job_id S2 aprovado>, role: "image_references"}]` | 01 Cenas |
| `S3m` água 9:16 | PREÂMBULO + SUBJECT_agua + FRAME_9x16 | `9:16` | `[{value: <job_id S3 aprovado>, role: "image_references"}]` | 01 Cenas |

- `model: "gpt_image_2_5"`, `count: 1`. Os demais parâmetros ficam nos **mesmos valores da medição do BRIEF** (0,25 crédito). Se alguém quiser `quality: "high"` ou `resolution: "2k"`, o custo muda e precisa ser conferido com `get_cost` **antes** e aprovado pelo Bil. As imagens viram `start_image` de vídeo de 720p/1080p, então a resolução padrão basta.
- A referência no 9:16 é a mesma cena recomposta, para que a represa do celular seja a **mesma** represa do desktop. Não passe imagem de referência entre cenas diferentes: isso clona a composição.
- A segunda leva (9:16) só sai depois que as três 16:9 forem aprovadas.

---

## (c) Clipes da corrente: 3 dive-ins + 2 conectores

### Ordem e emendas

```
D1 órbita ──► C1 órbita→represa ──► D2 represa ──► C2 represa→água ──► D3 água
```

| Clipe | start_image | end_image | duração | Movimento |
|---|---|---|---|---|
| **D1** órbita | imagem-chave `S1` (job_id) | nenhuma | 5 s | o satélite passa e sai de quadro; a câmera inclina e começa a descer |
| **C1** órbita→represa | **último quadro real de D1** (media_id do upload) | **primeiro quadro real de D2** (media_id) | 5 s | descida através da névoa e de uma abertura nas nuvens até a represa inteira vista de cima |
| **D2** represa | imagem-chave `S2` (job_id) | nenhuma | 5 s | descida reta até perto da superfície |
| **C2** represa→água | **último quadro real de D2** | **primeiro quadro real de D3** | 5 s | a câmera rompe a superfície e entra na água |
| **D3** água | imagem-chave `S3` (job_id) | nenhuma | 5 s | deslizar lento para a frente entre partículas suspensas |

**A lei da emenda (skill, passo 5):** as pontas dos conectores são **quadros extraídos dos vídeos renderizados**, nunca as imagens-chave. Cada geração renderiza um pouco diferente. Um conector que termina na imagem-chave não coincide com o quadro 0 do dive seguinte, e o resultado é um "pulo" visível. Com quadros reais dos dois lados: `D1.fim == C1.início`, `C1.fim ≈ D2.início`, e assim por diante. O Seedance chega perto da `end_image`, mas nem sempre no pixel; o crossfade curto do motor cobre o resto.

**Cada corrente usa os próprios quadros.** O rascunho 720p, o final 16:9 1080p e o final 9:16 1080p são três correntes independentes. Os conectores do final usam quadros extraídos **dos dive-ins finais**, nunca do rascunho, e os do 9:16 usam quadros dos dive-ins 9:16.

### Cauda de estilo (idêntica em todos os clipes)

```
Photorealistic, documentary realism, early morning natural light. Palette of living forest greens, deep teal-green water #0E5C4A, warm sand highlights #D8CCB4, soft mint highlights #BFF0DC, graphite shadows #0A100F. No saturated blue, no sunset orange, no neon. A fictional, non-identifiable place. Smooth, graceful slow motion, subtle parallax. No text, no captions, no logos, no people.
```

### Prompts exatos (16:9). Cada prompt é o bloco + uma linha em branco + a CAUDA.

**D1 · órbita (dive-in)**
```
Single continuous cinematic camera move, no cuts. Begin in low Earth orbit exactly as the first frame. The small satellite glides slowly across and out of frame to the upper right while the camera tilts gently down toward the Earth and begins a slow, steady descent toward the small reservoir near the center of the frame, the clouds below drifting softly apart. The camera never rises and never pulls back. In the final second, settle into a slow, steady downward glide toward that reservoir.
```

**C1 · órbita → represa (conector)**
```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady downward glide. The camera descends through thin morning haze and a soft gap in the white clouds, the forested landscape growing larger below, and arrives high above one whole reservoir looking straight down, matching the final frame. The camera never rises and never pulls back. Seamless, flowing aerial descent.
```

**D2 · represa (dive-in)**
```
Single continuous cinematic camera move, no cuts. Begin high above the whole reservoir looking straight down, exactly as the first frame. Continue a slow, steady downward glide toward the calm water near the center of the reservoir; the forested arms slide outward past the edges of the frame, the morning mist thins, sunlight glints softly on the surface. The camera never rises and never pulls back. In the final second, settle into a slow, steady downward glide just above the calm water, the frame filled with deep teal-green water and soft reflections.
```

**C2 · represa → água (conector)**
```
Single continuous cinematic camera move, no cuts. Continue the same slow, steady downward glide toward the calm water surface. The camera gently breaks through the surface with a soft ripple and enters the clear green-tinted water, slowly tilting from looking down to looking forward as soft shafts of morning light appear and fine suspended green particles drift past the lens, arriving at the underwater view of the final frame. The camera never rises and never pulls back.
```

**D3 · água (dive-in)**
```
Single continuous cinematic camera move, no cuts. Begin just beneath the calm surface exactly as the first frame. Continue a slow, steady forward glide through the clear green-tinted water at the same depth. Soft shafts of morning light sway gently; fine suspended particles, tiny green microalgae specks and delicate filaments drift slowly past the lens with subtle parallax, a little denser ahead. The camera never rises, never turns around and never pulls back. In the final second, settle into a slow, steady forward drift.
```

### Variação 9:16 (corrente mobile)

O mesmo prompt de cada clipe, com esta frase **no início** (skill §6b), mais a CAUDA:

```
Vertical 9:16 portrait composition, the subject centered in the upper middle with calm space below for text.
```

No 9:16, D1/D2/D3 partem de `S1m`/`S2m`/`S3m`, e C1/C2 usam quadros extraídos dos D1m/D2m/D3m.

### Filtro de conteúdo (NSFW falso positivo)

Os prompts já evitam palavras que costumam disparar o filtro do Seedance ("pool", "swim", "waterfall", "bed"). Se um clipe voltar `nsfw`: (1) gerar de novo, porque muitas vezes passa na 2ª ou 3ª tentativa; (2) acrescentar "empty, calm natural landscape, no people, no figures"; (3) só para **um** conector teimoso, gerar no `kling3_0` com as mesmas pontas (exceção da skill; o caráter da imagem muda um pouco, e esse uso exige aprovação do Bil porque o custo não foi medido); (4) último recurso: conector `null`, e o motor faz a transição direta entre os dive-ins.

### Extração de quadros (ffmpeg)

O ffmpeg não está no PATH desta máquina. Use o binário do `imageio_ffmpeg` (já instalado, com libx264, libwebp, unsharp e psnr). O ffprobe não existe; as informações do vídeo saem do próprio ffmpeg (`-i`).

```bash
# Git Bash. Pasta de trabalho dentro do projeto (fora do que vai para o ar).
FF="/c/Users/albil/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
SITE="C:/Users/albil/AppData/Roaming/Claude/scratch-workspaces/78e25b4e-fe34-4e5f-bc00-e4774c8edd8b/5f0d0ee6-bc1b-41db-b7fe-cc192ce9e28f/scratch-2026-09-30-18b95f/algeye-site"
W="$SITE/.voo-work"          # subpastas: prompts/ stills/ draft/ final16/ final9/ frames/
mkdir -p "$W"/{prompts,stills,draft,final16,final9,frames}

# baixar um resultado (URL vinda do jobs_wait; as URLs expiram, baixe na hora)
curl -fsSL "<result_url>" -o "$W/final16/d1.mp4"

# conferir resolução, duração e fps (sem ffprobe)
"$FF" -hide_banner -i "$W/final16/d1.mp4" 2>&1 | grep -E "Duration|Video:"

# quadros de borda de cada dive-in (CORRENTE = draft | final16 | final9)
for n in d1 d2 d3; do
  "$FF" -v error -y -ss 0 -i "$W/$CORRENTE/$n.mp4" -frames:v 1 "$W/frames/${CORRENTE}_${n}_first.png"
  "$FF" -v error -y -sseof -0.15 -i "$W/$CORRENTE/$n.mp4" -frames:v 1 "$W/frames/${CORRENTE}_${n}_last.png"
done
# C1: start = ${CORRENTE}_d1_last.png  end = ${CORRENTE}_d2_first.png
# C2: start = ${CORRENTE}_d2_last.png  end = ${CORRENTE}_d3_first.png

# conferência objetiva da emenda: comparar o quadro final do conector com o quadro 0 do dive seguinte
"$FF" -v error -sseof -0.05 -i "$W/$CORRENTE/c1.mp4" -frames:v 1 -y "$W/frames/${CORRENTE}_c1_last.png"
"$FF" -hide_banner -i "$W/frames/${CORRENTE}_c1_last.png" -i "$W/frames/${CORRENTE}_d2_first.png" -lavfi psnr -f null - 2>&1 | grep PSNR
# Calibragem da skill: emenda boa costuma dar 18 a 25 dB só pelo cintilar de detalhe.
# O que reprova é COMPOSIÇÃO diferente (abra os dois PNGs com Read e compare a olho).
```

---

## (d) Execução pelas ferramentas MCP do Higgsfield (ordem certa)

**Antes de tudo:**
1. Bil aprova este plano e o orçamento da seção 5. Cada fase com custo (F1, F2, F4, F5) começa só com o "vai" dele para aquela fase.
2. `balance`: conferir o saldo (BRIEF: 868,5). Se estiver menor que o total previsto + 10%, parar e avisar.
3. Opcional, recomendado: `get_cost: true` com os parâmetros exatos de **um** clipe de cada tier, para confirmar 5 e 45 antes de gastar. Quem roda essa consulta é o executor, não este plano.
4. Ferramentas de schema diferido: carregar com `ToolSearch` → `select:` + `generate_image`, `generate_video`, `jobs_wait`, `media_upload`, `media_confirm`, `balance`, `show_generation_by_ids`.

**Regras de chamada que valem para todas as fases:**
- `medias[].value` é **job_id** (de geração anterior) ou **media_id** (de upload). Nunca URL.
- Vídeo: `generate_audio: false` sempre. Não usar `use_unlim` (deixe omitido; se a resposta trouxer `unlim_choice`, pergunte ao Bil).
- Com timeout de transporte, **não reenviar**: aguarde o resultado do job original com `jobs_wait` (a ferramenta avisa que o envio pode ter acontecido).
- Guardar num registro (`.voo-work/jobs.json`) cada job_id, media_id, prompt usado e custo lido do `balance` antes e depois de cada fase.
- No máximo 5 ou 6 gerações simultâneas (a skill observou erros transitórios acima disso).

### F1 · Imagens-chave 16:9 (pasta 01 Cenas) · 0,75 crédito

```json
{ "model": "gpt_image_2_5", "prompt": "<PREÂMBULO>\n\n<SUBJECT_orbita>\n\n<FRAME_16x9>",
  "aspect_ratio": "16:9", "count": 1, "folder_id": "0300a82f-338b-4cc5-b1dc-0a169333726c" }
```
Repetir para represa e água (três chamadas `generate_image`, ou uma `generate_image_batch`). `jobs_wait` até terminar; baixar os PNGs para `.voo-work/stills/`.

**Conferir antes de seguir (abrir os PNGs):**
- As três parecem **um só mundo**: mesma luz de manhã, mesma paleta, mesma temperatura.
- Sem texto, número, logo ou marcação, nem no satélite.
- Represa inventada: sem cidade, estrada, ponte, barco ou construção reconhecível; nada que lembre um reservatório real.
- Sem azul saturado, laranja ou neon; órbita sem cara de "planeta azul".
- Superfície da represa saudável, sem mancha que pareça dado.
- Terço esquerdo calmo para o texto.
- Reprovou: gerar **só aquela** de novo (0,25 cada). Não altere o preâmbulo para uma cena só: se o preâmbulo mudar, as três saem de novo.

### F2 · Imagens-chave 9:16 (pasta 01 Cenas) · 0,75 crédito

Mesma coisa, com `FRAME_9x16`, `aspect_ratio: "9:16"` e `medias: [{ "value": "<job_id da 16:9 aprovada>", "role": "image_references" }]`. Conferir que é a **mesma** represa e que os 40% de baixo estão calmos.

### F3 · Rascunho da corrente 16:9 (pasta 02 Rascunho) · 25 créditos

**F3a, dive-ins (paralelo, 3 chamadas):**
```json
{ "model": "seedance_2_0_mini", "resolution": "720p", "aspect_ratio": "16:9", "duration": 5,
  "generate_audio": false, "prompt": "<D1>\n\n<CAUDA>",
  "medias": [{ "value": "<job_id S1>", "role": "start_image" }],
  "folder_id": "766dc08b-45fb-4c0a-810f-231b298c6218" }
```
(D2 com `S2`, D3 com `S3`.) O `seedance_2_0_mini` não tem `mode`; não passe esse parâmetro.

**Conferir em cada dive-in (baixar para `.voo-work/draft/d1.mp4` etc.):**
- O quadro 0 é a imagem-chave (mesma composição).
- O movimento obedece: desce ou avança, **nunca sobe nem recua**.
- O **último quadro** parece um quadro de descida calma (sem borrão lateral, sem órbita pela metade). Se não parecer, gere de novo **antes** de fazer o conector: um quadro de emenda ruim estraga tudo o que vem depois.
- Não apareceu texto, logo, pessoa ou estrutura reconhecível; a represa continua genérica.

**F3b, extração e upload dos quadros de borda:**
1. Rodar a extração (seção c) com `CORRENTE=draft`, gerando `draft_d1_last.png`, `draft_d2_first.png`, `draft_d2_last.png` e `draft_d3_first.png`.
2. `media_upload` com `files: [{filename:"draft_d1_last.png"}, {filename:"draft_d2_first.png"}, {filename:"draft_d2_last.png"}, {filename:"draft_d3_first.png"}]`. A resposta traz `upload_url` + `media_id` de cada arquivo.
3. Para cada arquivo: `curl -fsS -X PUT -H "Content-Type: image/png" --upload-file "$W/frames/draft_d1_last.png" "<upload_url>"`. É preciso HTTP 200 em todos.
4. `media_confirm` com `{ "type": "image", "media_ids": [ ...os 4... ] }`.

**F3c, conectores (paralelo, 2 chamadas):**
```json
{ "model": "seedance_2_0_mini", "resolution": "720p", "aspect_ratio": "16:9", "duration": 5,
  "generate_audio": false, "prompt": "<C1>\n\n<CAUDA>",
  "medias": [{ "value": "<media_id draft_d1_last>",  "role": "start_image" },
             { "value": "<media_id draft_d2_first>", "role": "end_image" }],
  "folder_id": "766dc08b-45fb-4c0a-810f-231b298c6218" }
```
(C2: `draft_d2_last` → `draft_d3_first`.)

**Conferir:** o quadro 0 do conector é igual ao último do dive anterior, e o último quadro do conector tem a composição do quadro 0 do dive seguinte (PSNR + olho). Depois, **plugar o rascunho no site** (seção g, com os mesmos nomes de arquivo), rodar `python build.py --only voo` e o QA da seção g.7. É aqui que se aprova **a jornada inteira**: ritmo, emendas, texto das batidas por cima. O Bil aprova o rascunho antes de F5.

### F4 · Rascunho da corrente 9:16 (pasta 02 Rascunho) · 25 créditos

Igual a F3, com `aspect_ratio: "9:16"`, prompts com a frase de retrato no início, `start_image` = `S1m/S2m/S3m` e quadros extraídos dos dive-ins 9:16 do rascunho (`CORRENTE=draft9`). Conferir com `videoWidth < videoHeight` (o ffmpeg `-i` mostra `720x1280`, por exemplo).

### F5 · Final desktop 16:9 (pasta 03 Final desktop) · 225 créditos

Corrente inteira **de novo** no modelo final (os clipes do rascunho não entram):
```json
{ "model": "seedance_2_0", "mode": "std", "resolution": "1080p", "aspect_ratio": "16:9", "duration": 5,
  "generate_audio": false, "prompt": "<D1>\n\n<CAUDA>",
  "medias": [{ "value": "<job_id S1>", "role": "start_image" }],
  "folder_id": "853b6eeb-1750-4ef7-807e-a0e89ab71e2b" }
```
Ordem: D1, D2 e D3 em paralelo → conferir cada último quadro → extrair quadros (`CORRENTE=final16`) → `media_upload` + PUT + `media_confirm` → C1 e C2 em paralelo com os **novos** media_ids → conferir as emendas. Opcional, sem custo de crédito: `bitrate_mode: "high"` melhora a fonte para a recodificação, mas antes confirme com `get_cost` que não muda o preço.

### F6 · Final mobile 9:16 (pasta 04 Final mobile) · 225 créditos

Igual a F5, com `aspect_ratio: "9:16"`, `S1m/S2m/S3m`, quadros da própria corrente 9:16 (`CORRENTE=final9`) e `folder_id: "a6cb2fb0-2776-45ed-b257-a5196fad56ea"`. A corrente 9:16 tem que sair **completa**: misturar um 9:16 nativo com vizinhos recortados de 16:9 dá pulo nas duas emendas.

### F7 · Encode, posters e plug (sem custo)

Ver a seção g. Depois do QA, registrar no `jobs.json` o gasto real de cada fase (`balance` antes e depois).

---

## (e) Custo (valores medidos no BRIEF: imagem 0,25 · clipe 5 s mini 720p = 5 · clipe 5 s seedance_2_0 1080p = 45)

### Plano recomendado (todos os clipes de 5 s)

| Fase | Itens | Conta | Créditos |
|---|---|---|---|
| Imagens-chave | 3 × 16:9 + 3 × 9:16 | 6 × 0,25 | 1,5 |
| Rascunho desktop (16:9, 720p) | 3 dive-ins + 2 conectores | 5 × 5 | 25 |
| Rascunho mobile (9:16, 720p) | 3 + 2 | 5 × 5 | 25 |
| **Final desktop** (16:9, 1080p) | 3 + 2 | 5 × 45 | **225** |
| **Final mobile** (9:16, 1080p) | 3 + 2 | 5 × 45 | **225** |
| **Subtotal sem novas tentativas** | | | **501,5** |
| Reserva para novas tentativas (~15% do vídeo, regra da skill) + 6 imagens extras | 0,15 × 500 + 6 × 0,25 | | 76,5 |
| **Total com reserva** | | | **578** |
| Saldo no BRIEF | | | 868,5 |
| **Sobra** | | | **290,5** (o plano usa 66,5% do saldo) |

- Fica abaixo do limite de alerta de 70% do saldo da skill.
- **Mínimo absoluto** (sem rascunho mobile e sem nenhuma nova tentativa): 1,5 + 25 + 450 = **476,5** (55%).
- **Só desktop** (mobile adiado, com reserva): 1,5 + 25 + 225 + 37,5 = **289**. Nesse caso o celular recebe o fallback (seção g.6). Usar o recorte 16:9 como "mobile" só com aprovação explícita do Bil.
- Uma nova tentativa de clipe final custa 45. Até 1 por corrente final (2 no total) cabem na reserva, junto com algumas do rascunho.

### Alternativa NÃO recomendada (dive-ins de 8 s, conectores de 5 s)

Aqui a conta é extrapolação linear por segundo (1 crédito/s no mini; 9 créditos/s no 1080p) e **precisa de `get_cost`** antes de qualquer decisão: rascunho 2 × 34 = 68; finais 2 × (3 × 72 + 2 × 45) = 612; com imagens e reserva de 15% ≈ **783,5** (90% do saldo). A vantagem visual (mais quadros) não paga o risco: a rolagem do herói é curta (seção g.4).

---

## (f) Checklist de compliance antes de publicar

Ninguém publica sem a aprovação explícita do Bil. Recomenda-se uma revisão independente de dois auditores (um criativo, um de compliance) sobre o vídeo final, quadro a quadro nas emendas.

**Imagem e vídeo**
- [ ] Represa fictícia, sem possibilidade de reconhecer um reservatório real (contorno, barragem, morros, cidade). Nada que lembre o reservatório do cliente sob NDA, nem a Guarapiranga (regras 1 e 7).
- [ ] Nenhum texto, número, logo, bandeira, placa ou marcação em nenhum quadro de nenhum clipe (conferir os quadros 0, meio e fim de cada um).
- [ ] O satélite é genérico, sem logo e sem semelhança com missão real; nenhum texto do site nomeia satélite, índice, banda, resolução ou limiar (regra 2).
- [ ] Nada parece dado real: sem manchas que imitem mapa de calor, sem grade, sem contorno, sem interface (regras 7 e 8).
- [ ] As partículas verdes ficam só na cena subaquática da represa fictícia; nenhum reservatório identificável associado a floração.
- [ ] Sem pessoas, peixe morto, lixo, tempestade ou escuridão; sem azul saturado, laranja de pôr do sol ou neon; órbita sem cara de "planeta azul" (identidade visual).
- [ ] Sem data, hora, escala ou intervalo implícito entre as cenas (regra 9).

**Página**
- [ ] O rótulo **"Imagem ilustrativa gerada por IA"** fica visível durante todo o voo, em desktop e mobile, com contraste AA (regra 8, BRIEF §6).
- [ ] O texto das batidas (`[data-beat]`) segue as 14 regras: sem "tempo real", "sensor", "contínuo", "diário", "antes de acontecer", prazos, acurácia, "protege/garante/previne", travessão. O vídeo **não insinua** que o produto vê a água por dentro: a descida é narrativa ("entra na água") e não descreve o método.
- [ ] Um limite do produto continua visível em algum ponto da página (nuvem, frequência, complemento à coleta).
- [ ] Nada no vídeo ou nos metadados (nomes de arquivo, `alt`, comentários) cita cliente, região, satélite ou índice. Os nomes de arquivo são neutros (`d1-orbita.mp4`...).
- [ ] `prefers-reduced-motion`: sem vídeo, e a página continua completa.
- [ ] Sem JS, com a CDN fora ou com falha no fetch: a ilustração ou o poster aparecem, os textos das batidas são legíveis, nada fica em branco.
- [ ] Peso: total dos clipes desktop ≤ ~25 MB e mobile ≤ ~12 MB. Com Save-Data ou 2g/3g, não baixar vídeo.
- [ ] Altura da página dentro da meta (≤ 13.000 px no mobile, ≤ 10.000 px no desktop), medida com Playwright.
- [ ] Console sem erros; `video.seekable.end(0) > 0` (blob funcionando); nenhum overflow horizontal em 390 px.
- [ ] Quando o site for para Instagram ou LinkedIn em forma de vídeo, ligar o rótulo de IA da plataforma (regra 5 da skill algeye-post).

---

## (g) Como plugar no site

### g.1 Arquivos em `assets/voo/`

```
assets/voo/
  d1-orbita.mp4        d1-orbita-m.mp4        orbita.webp     orbita-m.webp
  c1-orbita-represa.mp4 c1-orbita-represa-m.mp4
  d2-represa.mp4       d2-represa-m.mp4       represa.webp    represa-m.webp
  c2-represa-agua.mp4  c2-represa-agua-m.mp4
  d3-agua.mp4          d3-agua-m.mp4          agua.webp       agua-m.webp
```

O **poster** de cada cena é o **quadro 0 do dive-in renderizado**, não a imagem-chave. Assim o poster coincide com o primeiro quadro do vídeo e não há "flash" quando o clipe pinta. No rascunho, use os mesmos nomes; os finais sobrescrevem depois.

### g.2 Encode (skill, passo 6 e §6b)

```bash
D="$SITE/assets/voo"; mkdir -p "$D"
enc()  { "$FF" -v error -y -i "$1" -an -vf "unsharp=5:5:0.8:5:5:0.0" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2"; ls -l "$2"; }
encm() { "$FF" -v error -y -i "$1" -an -vf "scale=720:-2,unsharp=5:5:0.6:5:5:0.0" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$2"; ls -l "$2"; }

# desktop: resolução nativa (1080p), nunca reduzir
enc "$W/final16/d1.mp4" "$D/d1-orbita.mp4";   enc "$W/final16/c1.mp4" "$D/c1-orbita-represa.mp4"
enc "$W/final16/d2.mp4" "$D/d2-represa.mp4";  enc "$W/final16/c2.mp4" "$D/c2-represa-agua.mp4"
enc "$W/final16/d3.mp4" "$D/d3-agua.mp4"
# mobile: corrente 9:16 nativa, 720 de largura, GOP 4
encm "$W/final9/d1.mp4" "$D/d1-orbita-m.mp4";  encm "$W/final9/c1.mp4" "$D/c1-orbita-represa-m.mp4"
encm "$W/final9/d2.mp4" "$D/d2-represa-m.mp4"; encm "$W/final9/c2.mp4" "$D/c2-represa-agua-m.mp4"
encm "$W/final9/d3.mp4" "$D/d3-agua-m.mp4"

# posters = quadro 0 de cada dive-in (desktop 1920 de largura, mobile 1080 de largura)
for p in "d1 orbita" "d2 represa" "d3 agua"; do set -- $p
  "$FF" -v error -y -ss 0 -i "$W/final16/$1.mp4" -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 82 "$D/$2.webp"
  "$FF" -v error -y -ss 0 -i "$W/final9/$1.mp4"  -frames:v 1 -vf "scale=1080:-2" -c:v libwebp -quality 80 "$D/$2-m.webp"
done
```
Se o total desktop passar de ~25 MB, suba o `crf` para 22 (nunca reduza a resolução). Se o mobile engasgar num aparelho fraco, use `-g 2`.

### g.3 Contrato com a seção `#voo` (o dono da seção implementa; este plano não edita arquivos de seção)

O motor `vendor/scrub-engine.js` foi feito para ocupar **a página inteira**: estágio `position:fixed`, trilha própria que dá altura de rolagem, barra no topo, nav, legenda, rota e dica, e a conta parte de `window.scrollY` a partir de 0. Para rodar **dentro de `#voo-stage`** sem editar o motor:

1. `#voo` é a **primeira seção** e `#voo-stage` começa em **y = 0 do documento**. O nav do shell é fixo e não ocupa espaço. No modo vídeo, `.sec--voo` fica com `padding-block: 0`. O código abaixo confere isso e desiste se não bater.
2. No modo vídeo, `#voo-stage` fica **no fluxo normal** (não absoluto). A trilha do motor (`.sw-track`) passa a dar a altura da rolagem do herói, e o pin do ScrollTrigger da ilustração (se houver) **não é criado**.
3. Os textos `[data-beat="orbita|represa|agua"]` continuam fora do motor, numa camada sticky/fixa **acima** do estágio (z-index ≥ 20). Eles se posicionam pelo progresso, que o código abaixo publica no evento `voo:progress` (`detail.p` de 0 a 1 e `detail.beat`).
4. Um elemento `.voo__ia` com o texto "Imagem ilustrativa gerada por IA", visível no modo vídeo.
5. A camada de ilustração atual é o **fallback** e só é escondida quando o vídeo monta com sucesso.

### g.4 Ritmo e altura

Pesos de rolagem (em alturas de tela), escolhidos para caber na meta de altura:

| Segmento | D1 órbita | C1 | D2 represa | C2 | D3 água | Total |
|---|---|---|---|---|---|---|
| peso (vh) | 0,7 (linger 0,3) | 0,4 | 0,6 (linger 0,35) | 0,4 | 0,5 (linger 0,2) | **2,6** |
| faixa de progresso | 0 a 0,269 | 0,269 a 0,423 | 0,423 a 0,654 | 0,654 a 0,808 | 0,808 a 1 | |

Altura do herói em modo vídeo = (2,6 + 1) × altura da tela ≈ **3.240 px no desktop (900)** e **≈ 3.040 px no celular (844)**. Se a ilustração atual usar outra altura, ajuste os pesos **proporcionalmente** para o vídeo ocupar a **mesma** altura, para que o total da página não mude, e meça com Playwright. Batidas sugeridas: `orbita` visível de 0 a 0,22 (já na chegada, com título e CTA dentro da primeira tela), `represa` de 0,45 a 0,63 e `agua` de 0,82 a 1.

### g.5 CSS (vai em `css/sections/voo.css`, escopado)

```css
/* Modo vídeo do voo: o motor scroll-world roda dentro de #voo-stage. */
.sec--voo.voo--video { padding-block: 0; }
.sec--voo.voo--video #voo-stage {
  position: relative; inset: auto; height: auto; overflow: visible;
  --sw-bg: var(--ink-2); --sw-ink: var(--white); --sw-accent: var(--agua-2);
}
/* o cromo do motor não é usado: nav, legenda, rota, dica e barra são do site */
.sec--voo.voo--video :is(.sw-sky, .sw-scrollbar, .sw-topbar, .sw-copylayer, .sw-route, .sw-hint) { display: none !important; }
/* o estágio fica preso no herói, não fixo na página inteira */
.sec--voo.voo--video .sw-stage { position: sticky; top: 0; inset: auto; width: 100%; background: var(--ink-2); z-index: 1; }
.sec--voo.voo--video .voo__illus { display: none; }   /* nome da camada de ilustração atual */
.sec--voo .voo__ia { display: none; }
.sec--voo.voo--video .voo__ia {
  display: block; position: sticky; bottom: 12px; z-index: 30; margin: 0 var(--gutter);
  font-family: var(--f-mono); font-size: var(--fs-mono); letter-spacing: .08em; color: var(--musgo);
}
```
(A posição exata do `.voo__ia` fica com o dono da seção. O requisito é ficar visível no voo inteiro e não cobrir o CTA.)

### g.6 JS (acrescentar em `js/sections/voo.js`; o resto da seção continua igual)

```js
/* ---- Voo em vídeo (scroll-world). Cai para a ilustração em qualquer falha. ---- */
const VOO_BASE = new URL('../../assets/voo/', import.meta.url).href;   // funciona em index.html e em preview/
const VOO_ENGINE = new URL('../../vendor/scrub-engine.js', import.meta.url).href;
const A = (f) => VOO_BASE + f;
const VOO_W = { d1: 0.7, c1: 0.4, d2: 0.6, c2: 0.4, d3: 0.5 };       // seção g.4
const VOO_TOTAL = Object.values(VOO_W).reduce((a, b) => a + b, 0);    // 2,6
const VOO_BANDS = (() => { let o = 0; const b = {};                     // faixas de progresso por segmento
  for (const [k, w] of Object.entries(VOO_W)) { b[k] = [o / VOO_TOTAL, (o + w) / VOO_TOTAL]; o += w; } return b; })();

function vooCanPlay() {
  if (window.ALG && window.ALG.reduced) return false;                   // movimento reduzido: fica a ilustração
  const c = navigator.connection;
  if (c && (c.saveData || /2g|3g/.test(c.effectiveType || ''))) return false;
  return true;
}
function vooLoadScript(src) {
  return new Promise((ok, ko) => {
    if (window.mountScrollWorld) return ok();
    const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s);
  });
}

export async function mountVooVideo(section) {
  const stage = section.querySelector('#voo-stage');
  if (!stage || !vooCanPlay()) return false;
  try {
    const head = await fetch(A('d1-orbita.mp4'), { method: 'HEAD' });
    if (!head.ok) return false;                                         // vídeo ainda não publicado: ilustração
    await vooLoadScript(VOO_ENGINE);
  } catch (e) { return false; }

  section.classList.add('voo--video');                                 // padding 0 + estágio no fluxo (CSS g.5)
  if (Math.round(stage.getBoundingClientRect().top + window.scrollY) !== 0) {
    console.warn('[voo] #voo-stage precisa começar no topo do documento; mantendo a ilustração.');
    section.classList.remove('voo--video'); return false;
  }

  window.mountScrollWorld(stage, {
    nav: false, atmosphere: false, hint: ' ', crossfade: 0.1,
    sections: [
      { id: 'orbita',  label: 'Órbita',  scroll: VOO_W.d1, linger: 0.3,  accent: '#39D0A8',
        still: A('orbita.webp'),  stillMobile: A('orbita-m.webp'),  clip: A('d1-orbita.mp4'),  clipMobile: A('d1-orbita-m.mp4') },
      { id: 'represa', label: 'Represa', scroll: VOO_W.d2, linger: 0.35, accent: '#39D0A8',
        still: A('represa.webp'), stillMobile: A('represa-m.webp'), clip: A('d2-represa.mp4'), clipMobile: A('d2-represa-m.mp4') },
      { id: 'agua',    label: 'Água',    scroll: VOO_W.d3, linger: 0.2,  accent: '#3FB58E',
        still: A('agua.webp'),    stillMobile: A('agua-m.webp'),    clip: A('d3-agua.mp4'),    clipMobile: A('d3-agua-m.mp4') },
    ],
    connScroll: 0.4,                                                    // == VOO_W.c1 == VOO_W.c2
    connectors:       [A('c1-orbita-represa.mp4'),   A('c2-represa-agua.mp4')],
    connectorsMobile: [A('c1-orbita-represa-m.mp4'), A('c2-represa-agua-m.mp4')],
  });
  stage.setAttribute('aria-hidden', 'true');                           // visual decorativo; o texto está nas batidas

  // Estágio sticky com a altura da tela e trilha recuada uma tela: herói = (2,6 + 1) telas,
  // e o estágio solta exatamente quando o último dive-in termina.
  const swStage = stage.querySelector('.sw-stage');
  const track = stage.querySelector('.sw-track');
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  let fitW = 0;
  const fit = () => {                                                   // mesma regra do motor: no toque, só muda com a largura
    if (coarse && window.innerWidth === fitW) return;
    fitW = window.innerWidth;
    swStage.style.height = window.innerHeight + 'px';
    track.style.marginTop = (-window.innerHeight) + 'px';
    if (window.ALG && window.ALG.ScrollTrigger) window.ALG.ScrollTrigger.refresh();
  };
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', () => { fitW = 0; fit(); });

  // Progresso para as batidas [data-beat] (mesma conta do motor: scrollY / (total * altura da tela)).
  let q = false;
  const emit = () => {
    q = false;
    const p = Math.min(1, Math.max(0, window.scrollY / (VOO_TOTAL * window.innerHeight)));
    const beat = p < VOO_BANDS.c1[1] ? 'orbita' : p < VOO_BANDS.c2[1] ? 'represa' : 'agua';
    section.dispatchEvent(new CustomEvent('voo:progress', { detail: { p, beat, bands: VOO_BANDS } }));
  };
  window.addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(emit); } }, { passive: true });
  emit();
  return true;
}

// Uso no init da seção:
//   const video = await mountVooVideo(section);
//   if (!video) initIlustracao(section);            // fallback: a camada leve de hoje, com o pin dela
//   section.addEventListener('voo:progress', (e) => posicionarBatidas(e.detail.p));
```

O que o motor já resolve, e por que não reimplementar: carrega cada clipe como **Blob** (sempre navegável, mesmo em servidor sem byte-range, como o `python -m http.server`); **lazy-load** (só baixa clipes a até 1,6 tela do trecho atual); crossfade nas emendas; **no celular** (toque ou ≤ 860 px) serve `clipMobile`/`connectorsMobile`/`stillMobile`, agrupa os seeks para não travar, mantém o poster até o primeiro quadro pintar e "acorda" os vídeos no primeiro toque (correção do iOS); sob `prefers-reduced-motion` ele não carregaria vídeo, mas aqui nem montamos.

Observações de integração:
- O motor injeta `html,body{background;overflow-x:hidden}` dentro de `@layer sw`. O `base.css` (fora de layer) vence no `body`. No `html`, o `overflow-x:hidden` propaga para a viewport e não quebra o `position: sticky`.
- O Lenis rola a janela de verdade (`window.scrollTo`), então o listener de `scroll` do motor e o `voo:progress` recebem cada quadro.
- **Fallback, em camadas:** sem vídeo publicado, sem rede boa, com movimento reduzido ou com falha no script → a ilustração atual. Clipe com falha no fetch → o motor mantém o poster (imagem estática com leve zoom) daquela cena. Sem JS → o HTML da seção mostra a ilustração estática ou um poster com as batidas em fluxo normal (responsabilidade da seção).

### g.7 QA depois de plugar (rascunho e final)

1. `cd "$SITE" && python build.py --only voo` → `http://127.0.0.1:5512/preview/voo.html`; depois `python build.py` → `http://127.0.0.1:5512/index.html`.
2. `node C:/dvxsite/tools/shoot.js http://127.0.0.1:5512/index.html "$SITE/.shots/voo-video" --section voo --full`. Abrir os PNGs, **mobile primeiro**.
3. Script Playwright temporário **no scratchpad** (`require('C:/dvxsite/tools/node_modules/playwright')`, `channel: 'msedge'`), em 390×844 e 1440×900:
   - rolar até as fronteiras 0,269 · 0,423 · 0,654 · 0,808 (× 2,6 × altura da tela), ±0,01, com screenshot antes e depois de cada emenda; a composição tem que ser a mesma;
   - conferir `document.querySelectorAll('#voo-stage video')` com `seekable.end(0) > 0` e `currentTime` acompanhando a rolagem;
   - no 390: `videoWidth < videoHeight` (o `-m.mp4` 9:16 está sendo servido);
   - medir `document.documentElement.scrollHeight` contra a meta;
   - rodar com `reducedMotion: 'reduce'` e confirmar que nenhum `.mp4` é baixado;
   - console sem erros e `scrollWidth <= innerWidth`.
4. Conferir o rótulo "Imagem ilustrativa gerada por IA" nos screenshots das três batidas.
5. Depois da aprovação final do Bil: apagar `.voo-work/` (brutos, quadros, rascunhos locais) e `assets/voo/` de rascunho que tenha sobrado. Os originais continuam no projeto do Higgsfield.

---

## Resumo de uma tela

1. F1/F2: 6 imagens `gpt_image_2_5` (1,5) → conferir coesão e compliance.
2. F3/F4: rascunho mini 720p, 16:9 e 9:16 (50) → dive-ins → quadros reais → upload → conectores → plugar → Bil aprova a jornada.
3. F5/F6: final `seedance_2_0` std 1080p, 16:9 e 9:16 (450) → mesma ordem, quadros das próprias renderizações finais.
4. F7: encode, posters do quadro 0, `assets/voo/`, `mountVooVideo()`, QA, checklist (f), aprovação do Bil.

Total previsto: **501,5 créditos**; **578** com reserva, de 868,5 disponíveis.
