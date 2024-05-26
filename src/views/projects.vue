<template>
  <div class="container mt-4">
    <h2>Projetos</h2>
    <button class="btn btn-primary my-3" @click="showAddForm">Adicionar Projeto</button>

    <div v-if="showForm" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ editMode ? 'Editar Projeto' : 'Adicionar Projeto' }}</h5>
        <form @submit.prevent="saveProject">
          <div class="mb-3">
            <label for="projectName" class="form-label">Nome</label>
            <input type="text" class="form-control" id="projectName" v-model="projectForm.name" required>
          </div>
          <div class="mb-3">
            <label for="projectClient" class="form-label">Cliente</label>
            <select class="form-select" id="projectClient" v-model="projectForm.clientId" required>
              <option v-for="client in clients" :value="client.id" :key="client.id">{{ client.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select class="form-select" id="status" v-model="projectForm.status" required>
              <option v-for="status in projectStatuses" :key="status.value" :value="status.value">{{ status.description }}</option>
            </select>
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
          <th>Cliente</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.id }}</td>
          <td>{{ project.name }}</td>
          <td>{{ project.client }}</td>
          <td>{{ project.status }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editProject(project)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteProject(project.id)">Excluir</button>
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
  name: 'ProjectsPage',
  setup() {
    const projects = ref([]);
    const clients = ref([]);
    const showForm = ref(false);
    const projectForm = ref({ id: null, name: '', clientId: null, status: null });
    const editMode = ref(false);
    const projectStatuses = ref([])

    const fetchProjects = async () => {
      try {
        const response = await axios.get('/projects');
        projects.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('/clients');
        clients.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    const saveProject = async () => {
      try {
        if (editMode.value) {
          await axios.put(`/projects/${projectForm.value.id}`, projectForm.value);
        } else {
          await axios.post('/projects', projectForm.value);
        }
        fetchProjects();
        showForm.value = false;
        resetForm();
      } catch (error) {
        console.error('Erro ao salvar projeto:', error);
      }
    };

    const deleteProject = async (projectId) => {
      try {
        await axios.delete(`/projects/${projectId}`);
        fetchProjects();
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`/projects/listStatus`);
        projectStatuses.value = response.data
      } catch (error) {
        console.error('Erro ao buscar os status:', error);
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
      projectForm.value = { id: null, name: '', clientId: null, status: null};
    };

    const editProject = (project) => {
      
      projectForm.value = { ...project };
      showForm.value = true;
      editMode.value = true;
    };

    const getClientName = (clientId) => {
      const client = clients.value.find(client => client.id === clientId);
      return client ? client.name : 'Unknown Client';
    };

    onMounted(() => {
      fetchProjects();
      fetchClients();
      fetchStatuses();
    });

    return {
      projects,
      clients,
      showForm,
      projectForm,
      projectStatuses,
      editMode,
      showAddForm,
      cancelForm,
      saveProject,
      deleteProject,
      editProject,
      getClientName,
    };
  },
};
</script>

<style scoped>
/* Specific styles for Projects.vue */
</style>
