<template>
    <div class="privacy-policy-container">
      <h1>Política de Privacidade</h1>
      <div class="content">
        <section>
          <h2>1. Introdução</h2>
          <p>Nós valorizamos a sua privacidade e estamos comprometidos em proteger suas informações pessoais. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações.</p>
        </section>
        <section>
          <h2>2. Coleta de Informações</h2>
          <p>Coletamos as seguintes informações pessoais dos usuários:</p>
          <ul>
            <li>Nome</li>
            <li>Email</li>
            <li>Senha (armazenada de forma criptografada)</li>
            <li>CPF</li>
            <li>Telefone</li>
          </ul>
          <p>As informações de pagamento são processadas através de uma API segura, o Stripe, e não armazenamos os dados de pagamento em nossos servidores.</p>
        </section>
        <section>
          <h2>3. Uso das Informações</h2>
          <p>Usamos suas informações pessoais para:</p>
          <ul>
            <li>Gerenciar seu cadastro e acesso à nossa plataforma</li>
            <li>Processar e confirmar suas reservas</li>
            <li>Entrar em contato com você em caso de necessidade</li>
          </ul>
        </section>
        <section>
          <h2>4. Compartilhamento de Informações</h2>
          <p>Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar seus pagamentos ou conforme exigido por lei.</p>
        </section>
        <section>
          <h2>5. Segurança das Informações</h2>
          <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
        </section>
        <section>
          <h2>6. Direitos dos Usuários</h2>
          <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais armazenadas em nossa plataforma. Para exercer esses direitos, entre em contato conosco.</p>
        </section>
        <section>
          <h2>7. Contato</h2>
          <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do email: suporte@exemplo.com</p>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PrivacyPolicy'
  };
  </script>
  
  <style scoped>
  .privacy-policy-container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
  }
  
  h1, h2 {
    color: #333;
  }
  
  p, ul {
    font-size: 16px;
    line-height: 1.6;
  }
  
  section {
    margin-bottom: 20px;
  }
  
  ul {
    list-style-type: disc;
    padding-left: 20px;
  }
  </style>
  