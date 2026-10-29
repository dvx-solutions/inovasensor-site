import "./base.css";

const CONTATO = "gustavo.henrique@devexsolucoes.com.br";

export default function Privacy() {
  return (
    <div className="mentoria-site">
      <main className="privacy-page">
        <a href="/">← Voltar ao site</a>
        <h1>Política de privacidade</h1>
        <p>
          Esta política explica como a InovaSensor trata os dados pessoais que você informa nos nossos formulários,
          incluindo os formulários de cadastro dos anúncios no Facebook e no Instagram e a avaliação deste site. Ela
          segue a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).
        </p>

        <h2>Quem cuida dos seus dados</h2>
        <p>
          A InovaSensor é a controladora dos dados. Para qualquer assunto de privacidade, fale com o responsável pelo
          tratamento, Gustavo Henrique Bilonia, pelo e-mail <a href={`mailto:${CONTATO}`}>{CONTATO}</a>.
        </p>

        <h2>Quais dados coletamos</h2>
        <p>No formulário de avaliação gratuita para clínicas, pedimos:</p>
        <ul>
          <li>nome;</li>
          <li>número de WhatsApp;</li>
          <li>cidade;</li>
          <li>tipo de clínica (por exemplo, odontológica, médica, estética ou fisioterapia);</li>
          <li>seu papel na clínica;</li>
          <li>número de profissionais que atendem;</li>
          <li>tamanho da recepção;</li>
          <li>a maior dor da operação hoje;</li>
          <li>prazo em que pretende começar.</li>
        </ul>
        <p>
          Na avaliação feita aqui no site, pedimos também empresa, e-mail, telefone e respostas sobre equipe, operação,
          uso de IA e investimento. Quando presentes, registramos os parâmetros da campanha que mostram de onde veio a
          visita.
        </p>
        <p>
          Não pedimos dados de pacientes nem dados de saúde. Não escreva nos campos de texto informações sobre pacientes,
          senhas ou documentos confidenciais.
        </p>

        <h2>Para que usamos</h2>
        <p>Usamos esses dados somente para:</p>
        <ul>
          <li>entrar em contato com você, pelo WhatsApp ou pelo telefone e e-mail informados, sobre o pedido que você fez;</li>
          <li>agendar e realizar a avaliação gratuita da operação da sua clínica;</li>
          <li>preparar uma proposta comercial que faça sentido para o porte e o momento da clínica.</li>
        </ul>
        <p>
          As respostas ajudam a organizar a conversa, mas nenhuma decisão é tomada só de forma automática: quem analisa
          e fala com você é uma pessoa do nosso time. Não vendemos, não alugamos e não publicamos os seus dados.
        </p>

        <h2>Base legal</h2>
        <p>
          Tratamos os dados para atender ao seu pedido de contato e de avaliação, o que corresponde a procedimentos
          preliminares de um possível contrato solicitados por você (art. 7º, V, da LGPD). O acompanhamento comercial
          desse mesmo pedido se apoia no nosso legítimo interesse (art. 7º, IX), sempre dentro do que você espera ao
          preencher o formulário. Você pode pedir a qualquer momento que não entremos mais em contato.
        </p>

        <h2>Com quem os dados são compartilhados</h2>
        <p>
          Apenas com os fornecedores necessários para o serviço funcionar: a Meta (Facebook e Instagram), que recebe o
          formulário de cadastro dos anúncios; o WhatsApp, usado no contato; e os provedores de hospedagem e
          infraestrutura deste site e do nosso sistema de atendimento. Esses fornecedores tratam os dados conforme as
          nossas instruções e as políticas próprias deles. Alguns podem armazenar dados fora do Brasil, com as garantias
          previstas na LGPD.
        </p>

        <h2>Por quanto tempo guardamos</h2>
        <p>
          Se você não se tornar cliente, guardamos os dados por até 12 meses após o último contato e depois os
          excluímos. Se você se tornar cliente, os dados passam a seguir o contrato e são mantidos pelo tempo exigido
          por lei para obrigações fiscais e contratuais. Você pode pedir a exclusão antes disso, a qualquer momento.
        </p>

        <h2>Seus direitos</h2>
        <p>Pela LGPD, você pode pedir:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou exclusão de dados desnecessários;</li>
          <li>portabilidade dos dados;</li>
          <li>informação sobre com quem compartilhamos os dados;</li>
          <li>oposição ao tratamento e fim do contato comercial.</li>
        </ul>
        <p>
          Envie o pedido para <a href={`mailto:${CONTATO}`}>{CONTATO}</a> informando o nome e o WhatsApp ou e-mail usados
          no cadastro. Respondemos em até 15 dias. Se não ficar satisfeito, você também pode reclamar à Autoridade
          Nacional de Proteção de Dados (ANPD).
        </p>

        <h2>Segurança</h2>
        <p>
          Os dados ficam em sistemas com acesso restrito ao time que faz o atendimento comercial, e o envio pelo site é
          feito por conexão criptografada. Durante o preenchimento da avaliação do site, parte das respostas pode ficar
          temporariamente no seu navegador para que você retome de onde parou; nome, e-mail e telefone não entram nesse
          rascunho.
        </p>

        <h2>Mudanças nesta política</h2>
        <p>
          Se esta política mudar, a nova versão será publicada nesta página com a data atualizada.
        </p>
        <p>Versão de 28 de outubro de 2026.</p>
      </main>
    </div>
  );
}
