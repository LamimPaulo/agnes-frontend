<template>
  <div class="container mt-4">
    <h2>Trabalhadores</h2>
    <button class="btn btn-primary my-3" @click="showAddForm">Adicionar Trabalhador</button>

    <div v-if="showForm" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ editMode ? 'Editar Trabalhador' : 'Adicionar Trabalhador' }}</h5>
        <form @submit.prevent="saveWorker">
          <div class="mb-3">
            <label for="workerName" class="form-label">Nome</label>
            <input type="text" class="form-control" id="workerName" v-model="workerForm.firstName" required>
          </div>
          <div class="mb-3">
            <label for="workerLastName" class="form-label">Sobrenome</label>
            <input type="text" class="form-control" id="workerLastName" v-model="workerForm.lastName" required>
          </div>
          <div class="mb-3">
            <label for="workerEmail" class="form-label">Funcão</label>
            <input type="text" class="form-control" id="workerEmail" v-model="workerForm.role" required>
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
          <th>Sobrenome</th>
          <th>Funcão</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="worker in workers" :key="worker.id">
          <td>{{ worker.id }}</td>
          <td>{{ worker.firstName }}</td>
          <td>{{ worker.lastName }}</td>
          <td>{{ worker.role }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editWorker(worker)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteWorker(worker.id)">Excluir</button>
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
  name: 'WorkersPage',
  setup() {
    const workers = ref([]);
    const showForm = ref(false);
    const workerForm = ref({ id: null, firstName: '',lastName: '', role: '' });
    const editMode = ref(false);

    const fetchWorkers = async () => {
      try {
        const response = await axios.get('/workers');
        workers.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar trabalhadores:', error);
      }
    };

    const saveWorker = async () => {
      try {
        if (editMode.value) {
          await axios.put(`/workers/${workerForm.value.id}`, workerForm.value);
        } else {
          await axios.post('/workers', workerForm.value);
        }
        fetchWorkers();
        showForm.value = false;
        resetForm();
      } catch (error) {
        console.error('Erro ao salvar trabalhador:', error);
      }
    };

    const deleteWorker = async (workerId) => {
      try {
        await axios.delete(`/workers/${workerId}`);
        fetchWorkers();
      } catch (error) {
        console.error('Erro ao excluir trabalhador:', error);
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
      workerForm.value = { id: null, firstName: '', lastName: '', role: '' };
    };

    const editWorker = (worker) => {
      workerForm.value = { ...worker };
      showForm.value = true;
      editMode.value = true;
    };

    onMounted(fetchWorkers);

    return {
      workers,
      showForm,
      workerForm,
      editMode,
      showAddForm,
      cancelForm,
      saveWorker,
      deleteWorker,
      editWorker,
    };
  },
};
</script>
