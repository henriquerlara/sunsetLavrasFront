<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Cadastro</h1>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="state.name" @blur="validateField('name')" />
          <span v-if="state.errors.name" class="error">{{ state.errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="state.email" @blur="validateField('email')" />
          <span v-if="state.errors.email" class="error">{{ state.errors.email }}</span>
        </div>
        <div class="form-group">
          <label for="senha">Senha</label>
          <input type="password" id="senha" v-model="state.senha" @blur="validateField('senha')" />
          <span v-if="state.errors.senha" class="error">{{ state.errors.senha }}</span>
        </div>
        <div class="form-group">
          <label for="cpf">CPF</label>
          <input type="text" id="cpf" v-model="state.cpf" @input="applyCpfMask" @blur="validateField('cpf')" />
          <span v-if="state.errors.cpf" class="error">{{ state.errors.cpf }}</span>
        </div>
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" v-model="state.telefone" @input="applyPhoneMask" @blur="validateField('telefone')" />
          <span v-if="state.errors.telefone" class="error">{{ state.errors.telefone }}</span>
        </div>
        <div class="form-group consent">
          <input type="checkbox" id="consent" v-model="state.consent" />
          <label for="consent">Eu li e concordo com os <a href="/terms" target="_blank">Termos de Uso</a> e a <a href="/privacy" target="_blank">Política de Privacidade</a></label>
          <span v-if="state.errors.consent" class="error">{{ state.errors.consent }}</span>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <router-link to="/login">Faça seu login</router-link></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import axios from 'axios';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { validateCPF } from '../services/validateCPF'; // Importe a função de validação de CPF

export default defineComponent({
  name: 'Register',
  setup() {
    const router = useRouter();

    const state = reactive({
      name: '',
      email: '',
      senha: '',
      cpf: '',
      telefone: '',
      consent: false,
      errors: {
        name: '',
        email: '',
        senha: '',
        cpf: '',
        telefone: '',
        consent: ''
      } as Record<string, string>
    });

    const schema = yup.object().shape({
      name: yup.string().min(2, 'O nome deve ter pelo menos 2 caracteres').required('Nome é obrigatório'),
      email: yup.string().email('Email inválido').required('Email é obrigatório'),
      senha: yup.string().min(8, 'A senha deve ter pelo menos 8 caracteres').required('Senha é obrigatória'),
      cpf: yup
        .string()
        .required('CPF é obrigatório')
        .test('is-valid-cpf', 'CPF inválido', (value) => {
          const cleanCpf = value?.replace(/\D/g, '');
          if (!cleanCpf || cleanCpf.length < 11) {
            return false; // Se o CPF não tiver 11 dígitos, é considerado inválido
          }
          return validateCPF(cleanCpf);
        }),
      telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'O telefone deve estar no formato (XX) XXXXX-XXXX').required('Telefone é obrigatório'),
      consent: yup.boolean().oneOf([true], 'Você deve aceitar os Termos de Uso e a Política de Privacidade').required('Consentimento é obrigatório')
    });

    const validateField = async (field: string) => {
      try {
        await schema.validateAt(field, state);
        state.errors[field] = '';
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          state.errors[field] = err.message;
        }
      }
    };

    const validate = async () => {
      try {
        await schema.validate({ ...state }, { abortEarly: false });
        state.errors = { name: '', email: '', senha: '', cpf: '', telefone: '', consent: '' };
        return true;
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const newErrors: Record<string, string> = { name: '', email: '', senha: '', cpf: '', telefone: '', consent: '' };
          err.inner.forEach((error) => {
            if (error.path) {
              newErrors[error.path] = error.message;
            }
          });
          state.errors = newErrors;
        }
        return false;
      }
    };

    const registerUser = async () => {
      if (!(await validate())) {
        return;
      }

      try {
        console.log('Registrando usuário com os dados:', {
          nome: state.name,
          email: state.email,
          senha: state.senha,
          cpf: state.cpf,
          telefone: state.telefone,
        });

        const response = await axios.post('http://localhost:3000/users', {
          nome: state.name,
          email: state.email,
          senha: state.senha,
          cpf: state.cpf,
          telefone: state.telefone,
        });

        alert('Cadastro realizado com sucesso!');
        console.log('Resposta da API:', response.data);
        router.push('/login');
      } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        alert('Erro ao realizar cadastro. Por favor, tente novamente.');
      }
    };

    const applyCpfMask = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      const cpfParts = value.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
      if (cpfParts) {
        input.value = !cpfParts[2] ? cpfParts[1] : `${cpfParts[1]}.${cpfParts[2]}${cpfParts[3] ? '.' + cpfParts[3] : ''}${cpfParts[4] ? '-' + cpfParts[4] : ''}`;
        state.cpf = input.value;
      }
    };

    const applyPhoneMask = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      const phoneParts = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      if (phoneParts) {
        input.value = !phoneParts[2] ? phoneParts[1] : `(${phoneParts[1]}) ${phoneParts[2]}${phoneParts[3] ? '-' + phoneParts[3] : ''}`;
        state.telefone = input.value;
      }
    };

    return {
      state,
      registerUser,
      validateField,
      applyCpfMask,
      applyPhoneMask,
    };
  }
});
</script>


<style scoped>

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #4300a2, #ff5858);
}

.register-box {
  background: white;
  margin: 30px;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 28px;
  color: #f857a6;
}

.form-group {
  margin-bottom: 0.7rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.consent {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.consent input {
  margin-right: 0.5rem;
}

button {
  background-color: #f857a6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 1rem;
}

button:hover {
  background-color: #ff5858;
}

p {
  margin-top: 1.5rem;
  font-size: 14px;
}

router-link {
  color: #f857a6;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
