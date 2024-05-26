<template>
    <div class="container mt-4">
      <h2>Gerenciar Projetos</h2>
      <div class="mb-3">
        <label for="projectSelect" class="form-label">Selecione um Projeto</label>
        <select class="form-control" id="projectSelect" v-model="selectedProjectId" @change="fetchTasks">
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }} - Cliente: {{ project.client.name }} Status: {{ project.status  }}
          </option>
        </select>
      </div>
  
      <div v-if="selectedProjectId" class="mt-4">
        <h3>Tarefas para o Projeto: {{ currentProjectName }}</h3>
        <button class="btn btn-primary mb-3" @click="showTaskForm = true">Adicionar Tarefa</button>
  
        <div v-if="showTaskForm" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ editMode ? 'Editar Tarefa' : 'Adicionar Tarefa' }}</h5>
            <form @submit.prevent="saveTask">
              <div class="mb-3">
                <label for="taskTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="taskTitle" v-model="taskForm.title" required>
              </div>
              <div class="mb-3">
                <label for="taskDescription" class="form-label">Descrição</label>
                <textarea class="form-control" id="taskDescription" v-model="taskForm.description"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">{{ editMode ? 'Salvar Alterações' : 'Adicionar' }}</button>
              <button type="button" class="btn btn-secondary" @click="cancelTaskForm">Cancelar</button>
            </form>
          </div>
        </div>
  
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Atribuído</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>{{ task.assignedWorkerName }}</td>
              <td>
                <button class="btn btn-info btn-sm" @click="showDelegateTaskForm(task)">Delegar</button>
                <button class="btn btn-warning btn-sm" @click="editTask(task)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteTask(task.id)">Excluir</button>
                <!-- Button to open the task details modal -->
                <button class="btn btn-info btn-sm" @click="openTaskDetailsModal(task)">Detalhes</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Delegate Task Modal -->
      <div v-if="showDelegateModal" class="modal show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Delegar Tarefa</h5>
              <button type="button" class="btn-close" @click="showDelegateModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="delegateTask">
                <div class="mb-3">
                  <label for="workerSelect" class="form-label">Selecione um Membro</label>
                  <select class="form-control" id="workerSelect" v-model="selectedWorkerId" required>
                    <option v-for="worker in teamMembers" :key="worker.id" :value="worker.id">
                      {{ worker.firstName }} {{ worker.lastName }} - {{ worker.role }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Delegar</button>
                <button type="button" class="btn btn-secondary" @click="showDelegateModal = false">Cancelar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Task Details Modal -->
      <TaskDetailsModal :selectedTask="selectedTask" v-if="showTaskDetailsModal" @close="closeTaskDetailsModal" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import TaskDetailsModal from '@/components/TaskDetailsModal.vue'; // Import the modal component
  
  export default {
    name: 'ProjectManagementPage',
    components: {
      TaskDetailsModal // Register the modal component
    },
    setup() {
      const projects = ref([]);
      const tasks = ref([]);
      const selectedProjectId = ref(null);
      const currentProjectName = ref('');
      const showTaskForm = ref(false);
      const taskForm = ref({ id: null, title: '', description: '' });
      const editMode = ref(false);
      const showDelegateModal = ref(false);
      const selectedTaskId = ref(null);
      const selectedWorkerId = ref(null);
      const teamMembers = ref([]);
      const selectedTask = ref(null);
      const showTaskDetailsModal = ref(false); 
  
      const fetchProjects = async () => {
        try {
          const response = await axios.get('/projects');
          projects.value = response.data;
        } catch (error) {
          console.error('Erro ao buscar projetos:', error);
        }
      };
  
      const fetchTasks = async () => {
        if (selectedProjectId.value) {
          try {
            const response = await axios.get(`/projects/${selectedProjectId.value}/tasks`);
            tasks.value = response.data;
            const selectedProject = projects.value.find(project => project.id === selectedProjectId.value);
            currentProjectName.value = selectedProject ? selectedProject.name : '';
            fetchTeamMembers(selectedProjectId.value);
          } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
          }
        }
      };
  
      const fetchTeamMembers = async (projectId) => {
        try {
          const response = await axios.get(`/projects/${projectId}/team`);
          teamMembers.value = response.data.flatMap(worker => worker.teams.flatMap(team => team.workers));
        } catch (error) {
          console.error('Erro ao buscar membros da equipe:', error);
        }
      };
  
      const saveTask = async () => {
        if (editMode.value) {
          try {
            await axios.put(`/projects/tasks/${taskForm.value.id}`, taskForm.value);
            fetchTasks();
            showTaskForm.value = false;
          } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
          }
        } else {
          try {
            await axios.post(`/projects/${selectedProjectId.value}/tasks`, taskForm.value);
            fetchTasks();
            showTaskForm.value = false;
          } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
          }
        }
      };
  
      const editTask = (task) => {
        taskForm.value = { ...task };
        showTaskForm.value = true;
        editMode.value = true;
      };
  
      const deleteTask = async (taskId) => {
        try {
          await axios.delete(`/projects/tasks/${taskId}`);
          fetchTasks();
        } catch (error) {
          console.error('Erro ao excluir tarefa:', error);
        }
      };
  
      const showDelegateTaskForm = (task) => {
        selectedTaskId.value = task.id;
        showDelegateModal.value = true;
      };
  
      const delegateTask = async () => {
        try {
          await axios.put(`/projects/tasks/${selectedTaskId.value}/delegate`, null, {
            params: { workerId: selectedWorkerId.value }
          });
          fetchTasks();
          showDelegateModal.value = false;
        } catch (error) {
          console.error('Erro ao delegar tarefa:', error);
        }
      };
  
      const cancelTaskForm = () => {
        taskForm.value = { id: null, title: '', description: '' };
        showTaskForm.value = false;
        editMode.value = false;
      };
  
      const openTaskDetailsModal = (task) => {
        selectedTask.value = task;
        showTaskDetailsModal.value = true;
      };
  
      const closeTaskDetailsModal = () => {
        selectedTask.value = null;
        showTaskDetailsModal.value = false;
      };
  
      onMounted(() => {
        fetchProjects();
      });
  
      return {
        projects,
        tasks,
        selectedProjectId,
        currentProjectName,
        showTaskForm,
        taskForm,
        editMode,
        showDelegateModal,
        selectedTaskId,
        selectedWorkerId,
        teamMembers,
        fetchProjects,
        fetchTasks,
        saveTask,
        editTask,
        deleteTask,
        showDelegateTaskForm,
        delegateTask,
        cancelTaskForm,
        openTaskDetailsModal,
        closeTaskDetailsModal,
        selectedTask,
        showTaskDetailsModal
      };
    }
  };
  </script>
  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal.show {
    display: block;
  }
  </style>
  
  