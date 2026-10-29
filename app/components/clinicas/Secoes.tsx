import {Icon, type IconName} from './icons';

export const CTA = 'Quero a avaliação gratuita';

function BotaoCTA({pos}: {pos: string}) {
  return <a className="cl-btn cl-btn--primary" href="#avaliacao" data-cta="avaliacao" data-cta-pos={pos}>
    {CTA}<Icon name="seta" size={18} />
  </a>;
}

export function Inicio() {
  return <section id="inicio" className="cl-sec cl-inicio" aria-labelledby="inicio-titulo">
    <div className="cl-wrap cl-inicio__grid">
      <div className="cl-inicio__texto">
        <h1 id="inicio-titulo"><span>IA trabalhando na sua clínica.</span> <span>As pessoas mantêm o comando.</span></h1>
        <p className="cl-lead">A IA prepara o trabalho repetitivo da recepção. Quem fala com o paciente e decide continua sendo a sua equipe.</p>
        <div className="cl-inicio__acoes">
          <BotaoCTA pos="inicio" />
          <p className="cl-garantia">Gratuita e sem compromisso. Não pedimos dados de pacientes.</p>
        </div>
      </div>
      <figure className="cl-inicio__foto">
        <picture>
          <source media="(max-width: 760px)" srcSet="/clinicas-assets/recepcao-560.webp" />
          <img src="/clinicas-assets/recepcao-896.webp" width={896} height={1120} fetchPriority="high" decoding="async"
            alt="Recepcionista de clínica no balcão, olhando o celular com calma, notebook aberto ao lado." />
        </picture>
      </figure>
    </div>
  </section>;
}

const comEla = [
  'Receber e conversar com o paciente, no balcão e no WhatsApp',
  'Decidir encaixe, desconto e exceção',
  'Dar a palavra final no que sai em nome da clínica',
];
const porTras = [
  'Confirmação e lembrete da agenda',
  'Lista de quem sumiu, com a mensagem pronta',
  'Orçamento organizado e lembrete para quem não respondeu',
  'Resumo da semana, sem planilha',
];

export function Rotina() {
  return <section id="rotina" className="cl-sec cl-rotina" aria-labelledby="rotina-titulo">
    <div className="cl-wrap">
      <h2 id="rotina-titulo" className="cl-h2 rv">Uma recepcionista. Dez funções.</h2>
      <p className="cl-texto rv">Ela recebe quem chega, atende o telefone, responde o WhatsApp, marca, remarca e ainda tenta lembrar quem sumiu. Tudo com paciente esperando no balcão.</p>
      <div className="cl-rotina__lados">
        <div className="cl-rotina__lado cl-rotina__lado--ela rv">
          <h3>Continua com ela</h3>
          <ul>{comEla.map(t => <li key={t}><Icon name="check" size={18} />{t}</li>)}</ul>
        </div>
        <div className="cl-rotina__lado cl-rotina__lado--ia rv">
          <h3>A IA prepara por trás</h3>
          <ul>{porTras.map(t => <li key={t}><Icon name="check" size={18} />{t}</li>)}</ul>
        </div>
      </div>
      <p className="cl-rotina__fecho rv">Não é robô falando com paciente. É braço extra para o trabalho que se repete todo dia.</p>
    </div>
  </section>;
}

type Exemplo = {id: string; icone: IconName; titulo: string; texto: string};
const exemplos: Exemplo[] = [
  {id: 'agenda', icone: 'agenda', titulo: 'Agenda sem cadeira vazia', texto: 'Confirmação e lembrete na véspera e no dia. Quem desmarca libera a vaga para a lista de encaixe.'},
  {id: 'sumido', icone: 'volta', titulo: 'Paciente sumido de volta', texto: 'Lista de quem não vem há 6 ou 12 meses, com mensagem pronta para limpeza, manutenção ou revisão.'},
  {id: 'respostas', icone: 'conversa', titulo: 'Respostas prontas no WhatsApp', texto: 'Preço, convênio, endereço e preparo prontos. A recepcionista escolhe e manda com um clique.'},
  {id: 'orcamento', icone: 'orcamento', titulo: 'Orçamento que fecha', texto: 'Orçamento claro a partir das anotações do doutor, e acompanhamento de quem recebeu e não respondeu.'},
  {id: 'pos', icone: 'estrela', titulo: 'Pós-consulta sem esquecer ninguém', texto: 'Cuidados depois do procedimento, lembrete do retorno e pedido de avaliação no Google, prontos para a recepção enviar.'},
  {id: 'numeros', icone: 'numeros', titulo: 'Números da semana', texto: 'Consultas, faltas, orçamentos em aberto e faturamento num resumo simples, sem planilha.'},
];

const respostas = ['Valor da limpeza', 'Convênios aceitos', 'Endereço e estacionamento', 'Preparo do exame'];
const semana = [['Consultas', '41'], ['Faltas', '3'], ['Orçamentos abertos', '7']];

function Extra({id}: {id: string}) {
  if (id === 'respostas') return <div className="cl-demo" aria-label="Exemplo de respostas prontas">
    <span className="cl-demo__rotulo">Exemplo</span>
    <ul className="cl-chips">{respostas.map(r => <li key={r}>{r}</li>)}</ul>
  </div>;
  if (id === 'numeros') return <div className="cl-demo" aria-label="Exemplo de resumo da semana com dados fictícios">
    <span className="cl-demo__rotulo">Exemplo com dados fictícios</span>
    <dl className="cl-semana">{semana.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
  </div>;
  return null;
}

export function Exemplos() {
  return <section id="exemplos" className="cl-sec cl-exemplos" aria-labelledby="exemplos-titulo">
    <div className="cl-wrap">
      <h2 id="exemplos-titulo" className="cl-h2 rv">O que muda na rotina da clínica</h2>
      <p className="cl-texto rv">Seis exemplos do que a IA tira das costas da recepção. A avaliação mostra por onde começar na sua.</p>
      <ul className="cl-bento">
        {exemplos.map(e => <li key={e.id} className={`cl-bento__item cl-bento__item--${e.id} rv`}>
          <span className="cl-bento__icone"><Icon name={e.icone} size={24} /></span>
          <h3>{e.titulo}</h3>
          <p>{e.texto}</p>
          <Extra id={e.id} />
        </li>)}
      </ul>
    </div>
  </section>;
}

const passos = [
  ['Mapear a operação', 'Acompanhamos a rotina da recepção e listamos o que se repete, quanto pesa e o que dá para tirar das costas dela.'],
  ['Aplicar IA nos processos', 'Colocamos a IA para trabalhar no processo que mais pesa primeiro. Depois vem o próximo.'],
  ['Capacitar o time', 'Treinamos a equipe para usar no dia a dia e voltamos todo mês para ajustar o que for preciso.'],
];

export function Como() {
  return <section id="como" className="cl-sec cl-como" aria-labelledby="como-titulo">
    <div className="cl-wrap">
      <div className="cl-como__grid">
        <figure className="cl-como__foto rv">
          <picture>
            <source media="(max-width: 760px)" srcSet="/clinicas-assets/balcao-640.webp" />
            <img src="/clinicas-assets/balcao-1024.webp" width={1024} height={688} loading="lazy" decoding="async"
              alt="Balcão de recepção de clínica de fisioterapia com agenda, celular e notebook." />
          </picture>
        </figure>
        <div>
          <h2 id="como-titulo" className="cl-h2 rv">Mapear, aplicar, capacitar. E acompanhar todo mês.</h2>
          <ol className="cl-passos">
            {passos.map(([t, d]) => <li key={t} className="rv"><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
          <p className="cl-como__preco rv">Serviço mensal, com valor combinado depois da avaliação conforme o tamanho da operação. Você só decide depois de ver onde a IA entra.</p>
        </div>
      </div>
      <div className="cl-como__confianca">
        <div className="cl-prova rv">
          <h3>Quem já trabalha assim</h3>
          <p>O mesmo método já roda no dia a dia de agências de viagem que atendemos. Agora levamos para clínicas.</p>
          <p className="cl-prova__quem">Gustavo e Guilherme Bilonia, InovaSensor. Parque de Inovação Tecnológica de São José dos Campos.</p>
        </div>
        <div className="cl-nao rv">
          <h3>O que a gente não faz</h3>
          <ul>
            <li><Icon name="x" size={18} />Não coloca robô para conversar com o seu paciente.</li>
            <li><Icon name="x" size={18} />Não pede dados de pacientes na avaliação.</li>
            <li><Icon name="x" size={18} />Não tira o comando da sua equipe.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>;
}
