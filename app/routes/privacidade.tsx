import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const Route = createFileRoute("/privacidade")({
  component: Privacidade,
});

const sections = [
  {
    id: "1",
    title: "1. Quem é o controlador dos dados",
    content: (
      <div className="space-y-3">
        <p>O FIEMS Conecta é operado por:</p>
        <ul className="list-none space-y-1">
          <li><span className="text-white font-medium">Razão social:</span> Inova Sensor LTDA</li>
          <li><span className="text-white font-medium">CNPJ:</span> 47.164.317/0001-27</li>
          <li><span className="text-white font-medium">Endereço:</span> Avenida Embaixador Abelardo Bueno, 1111</li>
          <li><span className="text-white font-medium">Contato:</span> ver seção 14</li>
        </ul>
        <p>
          O Aplicativo é disponibilizado em parceria com a instituição responsável pelos títulos
          financeiros nele exibidos (a "Instituição"). Dependendo do tratamento, a Instituição pode
          atuar como <span className="text-white font-medium">controladora</span> dos dados financeiros e o operador do Aplicativo como{" "}
          <span className="text-white font-medium">operador</span>, nos termos dos arts. 5º, VI e VII, da LGPD.
        </p>
      </div>
    ),
  },
  {
    id: "2",
    title: "2. Definições",
    content: (
      <ul className="space-y-2 list-disc list-inside">
        <li><span className="text-white font-medium">Dado pessoal:</span> informação relacionada a pessoa natural identificada ou identificável.</li>
        <li><span className="text-white font-medium">Titular:</span> você, a quem os dados pessoais se referem.</li>
        <li><span className="text-white font-medium">Tratamento:</span> toda operação realizada com dados pessoais (coleta, uso, armazenamento, compartilhamento, eliminação etc.).</li>
        <li><span className="text-white font-medium">Controlador / Operador:</span> conforme art. 5º da LGPD.</li>
      </ul>
    ),
  },
  {
    id: "3",
    title: "3. Quais dados coletamos",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-white font-semibold mb-3">3.1. Dados fornecidos por você</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-white font-semibold border-b border-white/10">Momento</th>
                  <th className="text-left p-3 text-white font-semibold border-b border-white/10">Dados</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-3 font-medium text-slate-300">Criação de conta</td>
                  <td className="p-3">Nome, sobrenome, e-mail, CPF e telefone (opcional)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 font-medium text-slate-300">Login</td>
                  <td className="p-3">E-mail e senha</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-300">Recuperação de senha</td>
                  <td className="p-3">E-mail</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">3.2. Dados financeiros e cadastrais</h4>
          <p className="mb-2">Para exibir e processar títulos, pagamentos e acordos, o Aplicativo trata dados como:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Títulos/boletos: valores, vencimentos, descontos, juros, multas e situação;</li>
            <li>Número de contrato e referências do título;</li>
            <li>Dados de acordos de negociação de dívida (valores, parcelas, descontos);</li>
            <li>Situação do título junto a órgãos de proteção ao crédito (ex.: SCPC), quando aplicável;</li>
            <li>Quando o título se refere a serviços educacionais: nome do aluno, RA, turma e CPF vinculados ao título.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">3.3. Dados de pagamento</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="text-white font-medium">PIX:</span> geramos e exibimos QR Code / código "copia e cola" para liquidação;</li>
            <li><span className="text-white font-medium">Cartão:</span> dados informados para pagamento são transmitidos ao processador de pagamento para concluir a transação.</li>
          </ul>
          <p className="mt-3">O Aplicativo <span className="text-white font-medium">não armazena</span> dados completos de cartão em seus servidores ou no dispositivo; eles são tratados pelo processador de pagamento.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">3.4. Dados técnicos e de uso</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Endereço IP (incluído no token de autenticação);</li>
            <li>Logs de uso e de erros do aplicativo, enviados ao nosso servidor de logs para diagnóstico e melhoria de estabilidade;</li>
            <li>Identificador do ambiente (tenant) e dados técnicos de sessão.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "4",
    title: "4. Como e por que usamos seus dados",
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-white/5">
              <th className="text-left p-3 text-white font-semibold border-b border-white/10">Finalidade</th>
              <th className="text-left p-3 text-white font-semibold border-b border-white/10">Base legal (LGPD, art. 7º)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Autenticar você e manter sua sessão segura", "Execução de contrato (inc. V)"],
              ["Exibir títulos, boletos, acordos e histórico financeiro", "Execução de contrato (inc. V)"],
              ["Processar pagamentos via PIX e cartão", "Execução de contrato (inc. V)"],
              ["Gerar e disponibilizar boletos e comprovantes", "Execução de contrato (inc. V)"],
              ["Diagnosticar erros e melhorar o aplicativo (logs)", "Legítimo interesse (inc. IX)"],
              ["Cumprir obrigações legais e regulatórias", "Obrigação legal (inc. II)"],
              ["Prevenir fraudes e garantir a segurança", "Legítimo interesse (inc. IX)"],
            ].map(([fin, base], i) => (
              <tr key={i} className={i < 6 ? "border-b border-white/5" : ""}>
                <td className="p-3">{fin}</td>
                <td className="p-3 text-slate-300">{base}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm">Não utilizamos seus dados para publicidade comportamental nem os vendemos a terceiros.</p>
      </div>
    ),
  },
  {
    id: "5",
    title: "5. Com quem compartilhamos",
    content: (
      <div className="space-y-3">
        <p>Compartilhamos dados apenas quando necessário para as finalidades acima, com:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><span className="text-white font-medium">Provedores de infraestrutura e API</span> que hospedam e processam os dados do Aplicativo;</li>
          <li><span className="text-white font-medium">Processadores de pagamento</span> (PIX e cartão), para liquidação das transações;</li>
          <li><span className="text-white font-medium">A Instituição</span> responsável pelos títulos, para gestão da relação financeira;</li>
          <li><span className="text-white font-medium">Autoridades públicas</span>, quando exigido por lei, ordem judicial ou regulação.</li>
        </ul>
        <p>Todos os operadores são obrigados contratualmente a tratar os dados conforme esta Política e a LGPD.</p>
      </div>
    ),
  },
  {
    id: "6",
    title: "6. Armazenamento no dispositivo e segurança",
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>Tokens de autenticação, dados de sessão e seleções de pagamento são armazenados <span className="text-white font-medium">localmente no seu dispositivo</span> (armazenamento criptografado MMKV);</li>
        <li>A comunicação com nossos servidores ocorre por canais cifrados (HTTPS/TLS);</li>
        <li>A senha é validada pelo servidor e <span className="text-white font-medium">não</span> é armazenada em texto puro no dispositivo;</li>
        <li>Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda ou alteração.</li>
        <li className="mt-2">Ao sair da conta (logout), os tokens e dados de sessão são removidos do dispositivo.</li>
      </ul>
    ),
  },
  {
    id: "7",
    title: "7. Permissões do dispositivo",
    content: (
      <div className="space-y-3">
        <p>O Aplicativo solicita as seguintes permissões, sempre com finalidade específica:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><span className="text-white font-medium">Acesso ao armazenamento (Android):</span> para salvar e compartilhar boletos e comprovantes de pagamento que você baixar;</li>
          <li><span className="text-white font-medium">Acesso à internet:</span> para comunicação com os servidores do Aplicativo.</li>
        </ul>
        <p>O Aplicativo <span className="text-white font-medium">não</span> acessa contatos, localização, câmera, microfone ou fotos.</p>
      </div>
    ),
  },
  {
    id: "8",
    title: "8. Retenção e eliminação",
    content: (
      <p>
        Mantemos os dados pessoais pelo tempo necessário ao cumprimento das finalidades desta
        Política e das obrigações legais e regulatórias aplicáveis (por exemplo, prazos fiscais e
        financeiros). Encerrado esse período, os dados são eliminados ou anonimizados, salvo
        hipóteses de guarda obrigatória previstas no art. 16 da LGPD.
      </p>
    ),
  },
  {
    id: "9",
    title: "9. Seus direitos (art. 18 da LGPD)",
    content: (
      <div className="space-y-3">
        <p>Você pode, a qualquer tempo, solicitar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos seus dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
          <li>Portabilidade dos dados;</li>
          <li>Informação sobre o compartilhamento dos seus dados;</li>
          <li>Revogação do consentimento, quando o tratamento se basear nele.</li>
        </ul>
        <p>Para exercer seus direitos, utilize os canais da seção 14.</p>
      </div>
    ),
  },
  {
    id: "10",
    title: "10. Dados de crianças e adolescentes",
    content: (
      <p>
        O Aplicativo é destinado à gestão financeira por usuários maiores de 18 anos ou
        responsáveis legais. Quando títulos se referirem a alunos menores de idade, o tratamento
        ocorre no interesse do titular responsável, observado o art. 14 da LGPD. Não coletamos
        intencionalmente dados de menores diretamente pelo Aplicativo.
      </p>
    ),
  },
  {
    id: "11",
    title: "11. Transferência internacional",
    content: (
      <p>
        Caso provedores de infraestrutura ou de pagamento processem dados fora do Brasil, isso
        ocorrerá apenas com garantias de proteção compatíveis com a LGPD (arts. 33 a 36).
      </p>
    ),
  },
  {
    id: "12",
    title: "12. Versão web e cookies",
    content: (
      <p>
        Na versão web do Aplicativo, podem ser utilizados armazenamento local e cookies estritamente
        necessários ao funcionamento (por exemplo, manutenção da sessão). Não utilizamos cookies de
        publicidade.
      </p>
    ),
  },
  {
    id: "13",
    title: "13. Alterações desta Política",
    content: (
      <p>
        Podemos atualizar esta Política periodicamente. A data da "Última atualização" no topo
        indica a versão vigente. Alterações relevantes serão comunicadas pelos canais do Aplicativo.
      </p>
    ),
  },
  {
    id: "14",
    title: "14. Contato e Encarregado (DPO)",
    content: (
      <div className="space-y-3">
        <p>Dúvidas, solicitações ou exercício de direitos:</p>
        <div className="glass rounded-xl p-5 border border-white/8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(225,62,107,0.12)] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#e13e6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">E-mail do Encarregado (DPO)</p>
              <a href="mailto:privacidade@inovasensor.com.br" className="text-[#e13e6b] hover:text-[#f06090] transition-colors font-medium">
                privacidade@inovasensor.com.br
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(16,185,129,0.12)] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">WhatsApp / Suporte</p>
              <a href="https://wa.me/556733899037" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                +55 67 3389-9037
              </a>
            </div>
          </div>
        </div>
        <p className="text-sm">Responderemos às solicitações nos prazos previstos na LGPD.</p>
      </div>
    ),
  },
];

function Privacidade() {
  return (
    <main className="min-h-screen" style={{ background: "#020c1b" }}>
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_50%_-5%,rgba(225,62,107,0.12),transparent)]" />
        <div className="max-w-4xl mx-auto relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar ao início
          </Link>

          <span className="badge badge-brand mb-4">Privacidade & LGPD</span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Política de Privacidade
          </h1>
          <p className="text-slate-400 text-lg mb-2">
            <span className="text-white font-semibold">FIEMS Conecta</span> — operado por Inova Sensor LTDA
          </p>
          <p className="text-slate-600 text-sm">
            Última atualização: 15 de junho de 2026
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-6 border border-white/8 text-slate-400 leading-relaxed">
            Esta Política de Privacidade descreve como o aplicativo <span className="text-white font-medium">FIEMS Conecta</span> coleta,
            utiliza, armazena e compartilha dados pessoais dos seus usuários, em conformidade com a{" "}
            <span className="text-white font-medium">Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD)</span>.
            Ao criar uma conta ou utilizar o Aplicativo, você declara estar ciente desta Política.
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {sections.map((s) => (
            <div
              key={s.id}
              className="glass rounded-2xl border border-white/8 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/6">
                <h2
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.title}
                </h2>
              </div>
              <div className="px-6 py-5 text-slate-400 text-sm leading-relaxed">
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
