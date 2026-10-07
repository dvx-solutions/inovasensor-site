# Algeye: site novo · estado em 07/10/2026

## Pronto
- 7 seções aprovadas pelos supervisores (nota mínima 8) e pelo CMO (rodada 2: 8 a 9 em todos os eixos).
- Abertura em vídeo (satélite → represa → água) gerada no Higgsfield, plugada e aprovada pelo verificador e pelo CMO (abertura 9, primeira tela 9, compliance de IA 9, fluidez 8).
- Régua estrita respeitada: sem prazo, sem CASAL/SABESP/Guarapiranga, sem satélite/índice/resolução, demos com "dados fictícios", vídeo com "Imagem ilustrativa gerada por IA".
- Alturas (07/10, depois do gesto e da réplica): 12.115 px no celular e 8.716 px no desktop, sem erros de console.
- Voo com navegação por gesto (um gesto = uma cena, trava durante a viagem, ~11 s de filme), aprovado por verificador e CMO.
- Painel virou réplica interativa do app (Suas represas → mapa, camadas, 24 passagens, alertas, coletas, relatórios em HTML, Entenda), com dados e represas fictícias; aprovada (fidelidade 9, coerência 9, compliance 9).

## Para decidir antes de publicar
1. **E-mail que recebe as avaliações:** confirmado pelo Bil (07/10): gustavo.henrique@devexsolucoes.com.br.
2. **ANA 188/2024 (pesquisado em 07/10, texto oficial):** a resolução trata do automonitoramento do USO da água (volumes captados; volume, DBO e fósforo total do efluente lançado) por usuários regularizados em rios federais. Não obriga ninguém a monitorar algas ou cianobactérias em reservatório. A menção já tinha saído do site na revisão do CMO; recomendação: manter fora.
3. **"Retorno em até dois dias úteis"** e a nota de privacidade (política LGPD própria do Algeye ainda não existe).
4. **Voo:** feito (navegação por gesto, ~11 s de filme). Falta só conferir à mão num Android médio e no Edge com a barra de rolagem visível.
5. **Publicação:** o site é estático (`python build.py` gera `index.html`). O site atual fica no repo `dvx-solutions/inovasensor-site` (TanStack). Falta decidir se este substitui aquele e onde hospedar.

## Voo no Higgsfield
- Projeto "Algeye · Site · Voo satélite → represa → água": imagens em 01 Cenas, clipes finais em 03 (desktop) e 04 (mobile).
- Gasto: 868,5 → 327 créditos (6 imagens + 12 clipes 1080p; 4 tentativas de conector órbita→represa foram rejeitadas porque o modelo ignorava o quadro inicial).
- O conector órbita→represa é sintético (zoom contínuo, `.voo-work/zoom_connector.py`), com emenda exata nas duas pontas.
- Registro de jobs: `.voo-work/jobs.json`. Brutos e quadros em `.voo-work/` (212 MB). Podem ser apagados depois da sua aprovação; os originais ficam no Higgsfield.
