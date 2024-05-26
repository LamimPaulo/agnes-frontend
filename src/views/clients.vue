<template>
  <div class="container mt-4">
    <h2>Clientes</h2>
    <button class="btn btn-primary my-3" @click="showAddForm">Adicionar Cliente</button>

    <div v-if="showForm" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ editMode ? 'Editar Cliente' : 'Adicionar Cliente' }}</h5>
        <form @submit.prevent="saveClient">
          <div class="mb-3">
            <label for="clientName" class="form-label">Nome</label>
            <input type="text" class="form-control" id="clientName" v-model="clientForm.name" required>
          </div>
          <div class="mb-3">
            <label for="clientEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="clientEmail" v-model="clientForm.email" required>
          </div>
          <button type="submit" class="btn btn-primary">{{ editMode ? 'Salvar Alterações' : 'Adicionar' }}</button>
          <button type="button" class="btn btn-secondary" @click="cancelForm">Cancelar</button>
        </form>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editClient(client)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteClient(client.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'ClientsPage',
  setup() {
    const clients = ref([]);
    const showForm = ref(false);
    const clientForm = ref({ id: null, name: '', email: '' });
    const editMode = ref(false);

    const fetchClients = async () => {
      try {
        const response = await axios.get('/clients');
        clients.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    const saveClient = async () => {
      try {
        if (editMode.value) {
          await axios.put(`/clients/${clientForm.value.id}`, clientForm.value);
        } else {
          await axios.post('/clients', clientForm.value);
        }
        fetchClients();
        showForm.value = false;
        resetForm();
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
      }
    };

    const deleteClient = async (clientId) => {
      try {
        await axios.delete(`/clients/${clientId}`);
        fetchClients();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    };

    const showAddForm = () => {
      showForm.value = true;
      editMode.value = false;
      resetForm();
    };

    const cancelForm = () => {
      showForm.value = false;
      resetForm();
    };

    const resetForm = () => {
      clientForm.value = { id: null, name: '', email: '' };
    };

    const editClient = (client) => {
      clientForm.value = { ...client };
      showForm.value = true;
      editMode.value = true;
    };

    onMounted(fetchClients);

    return {
      clients,
      showForm,
      clientForm,
      editMode,
      showAddForm,
      cancelForm,
      saveClient,
      deleteClient,
      editClient,
    };
  },
};
</script>

<style scoped>
/* Estilos específicos para Clients.vue */
</style>
