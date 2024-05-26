<template>
  <div class="container mt-4">
    <h2>Times</h2>
    <button class="btn btn-primary my-3" @click="showAddForm">Adicionar Time</button>

    <div v-if="showForm" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ editMode ? 'Editar Time' : 'Adicionar Time' }}</h5>
        <form @submit.prevent="saveTeam">
          <div class="mb-3">
            <label for="teamName" class="form-label">Nome</label>
            <input type="text" class="form-control" id="teamName" v-model="teamForm.name" required>
          </div>
          <button type="submit" class="btn btn-primary">{{ editMode ? 'Salvar Alterações' : 'Adicionar' }}</button>
          <button type="button" class="btn btn-secondary" @click="cancelForm">Cancelar</button>
        </form>
      </div>
    </div>

    <div v-if="showProjectsForm" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Gerenciar Projetos para o Time: {{ currentTeam.name }}</h5>
        <form @submit.prevent="updateTeamProjects">
          <div class="mb-3">
            <label for="projects" class="form-label">Projetos</label>
            <select multiple class="form-control" id="projects" v-model="selectedProjects">
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Salvar Projetos</button>
          <button type="button" class="btn btn-secondary" @click="cancelProjectsForm">Cancelar</button>
        </form>
      </div>
    </div>

    <div v-if="showMembersForm" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Gerenciar Membros para o Time: {{ currentTeam.name }}</h5>
        <form @submit.prevent="updateTeamMembers">
          <div class="mb-3">
            <label for="members" class="form-label">Membros</label>
            <select multiple class="form-control" id="members" v-model="selectedMembers">
              <option v-for="worker in workers" :key="worker.id" :value="worker.id">
                {{ worker.firstName }} {{ worker.lastName }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Salvar Membros</button>
          <button type="button" class="btn btn-secondary" @click="cancelMembersForm">Cancelar</button>
        </form>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Projetos</th>
          <th>Membros</th>
          <th>Manage</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in teams" :key="team.id">
          <td>{{ team.id }}</td>
          <td>{{ team.name }}</td>
          <td>
            <span class="badge bg-info text-dark" v-for="project in team.projects" :key="project.id">
              {{ project.name }}
            </span>
          </td>
          <td>
            <span class="badge bg-info text-dark" v-for="worker in team.workers" :key="worker.id">
              {{ worker.firstName }} {{ worker.lastName }}
            </span>
          </td>
          <td>
            <button class="btn btn-info btn-sm mt-0 mb-0 m-1" @click="manageProjects(team)">Projetos</button>
            <button class="btn btn-info btn-sm mt-0 mb-0 m-1" @click="manageMembers(team)">Membros</button>
          </td>
          <td>
            <button class="btn btn-warning btn-sm mt-0 mb-0 m-1" @click="editTeam(team)">Editar</button>
            <button class="btn btn-danger btn-sm mt-0 mb-0 m-1" @click="deleteTeam(team.id)">Excluir</button>
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
  name: 'TeamsPage',
  setup() {
    const teams = ref([]);
    const projects = ref([]);
    const workers = ref([]);
    const showForm = ref(false);
    const showProjectsForm = ref(false);
    const showMembersForm = ref(false);
    const teamForm = ref({ id: null, name: '' });
    const currentTeam = ref(null);
    const selectedProjects = ref([]);
    const selectedMembers = ref([]);
    const editMode = ref(false);

    const fetchTeams = async () => {
      try {
        const response = await axios.get('/teams');
        teams.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar times:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get('/projects');
        projects.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    const fetchWorkers = async () => {
      try {
        const response = await axios.get('/workers');
        workers.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar membros:', error);
      }
    };

    const saveTeam = async () => {
      try {
        if (editMode.value) {
          await axios.put(`/teams/${teamForm.value.id}`, teamForm.value);
        } else {
          await axios.post('/teams', teamForm.value);
        }
        fetchTeams();
        showForm.value = false;
        resetForm();
      } catch (error) {
        console.error('Erro ao salvar time:', error);
      }
    };

    const updateTeamProjects = async () => {
      try {
        await axios.put(`/teams/${currentTeam.value.id}/projects`, selectedProjects.value);
        fetchTeams();
        showProjectsForm.value = false;
      } catch (error) {
        console.error('Erro ao atualizar projetos do time:', error);
      }
    };

    const updateTeamMembers = async () => {
      try {
        await axios.put(`/teams/${currentTeam.value.id}/workers`, selectedMembers.value);
        fetchTeams();
        showMembersForm.value = false;
      } catch (error) {
        console.error('Erro ao atualizar membros do time:', error);
      }
    };

    const deleteTeam = async (teamId) => {
      try {
        await axios.delete(`/teams/${teamId}`);
        fetchTeams();
      } catch (error) {
        console.error('Erro ao excluir time:', error);
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
      teamForm.value = { id: null, name: '' };
    };

    const editTeam = (team) => {
      teamForm.value = { ...team };
      showForm.value = true;
      editMode.value = true;
    };

    const manageProjects = (team) => {
      currentTeam.value = team;
      selectedProjects.value = team.projects ? team.projects.map(project => project.id) : [];
      showProjectsForm.value = true;
    };

    const cancelProjectsForm = () => {
      showProjectsForm.value = false;
    };

    const manageMembers = (team) => {
      currentTeam.value = team;
      selectedMembers.value = team.workers ? team.workers.map(worker => worker.id) : [];
      showMembersForm.value = true;
    };

    const cancelMembersForm = () => {
      showMembersForm.value = false;
    };

    onMounted(() => {
      fetchTeams();
      fetchProjects();
      fetchWorkers();
    });

    return {
      teams,
      projects,
      workers,
      showForm,
      showProjectsForm,
      showMembersForm,
      teamForm,
      currentTeam,
      selectedProjects,
      selectedMembers,
      editMode,
      showAddForm,
      cancelForm,
      saveTeam,
      updateTeamProjects,
      updateTeamMembers,
      deleteTeam,
      editTeam,
      manageProjects,
      cancelProjectsForm,
      manageMembers,
      cancelMembersForm,
    };
  },
};
</script>
