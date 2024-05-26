<template>
    <div class="modal" v-if="selectedTask">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Task Details</h5>
            <button type="button" class="close" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Title:</strong> {{ selectedTask.title }}</p>
            <p><strong>Description:</strong> {{ selectedTask.description }}</p>
            <p v-if="selectedTask.assignedWorker"><strong>Assigned Worker:</strong> {{ selectedTask.assignedWorker.firstName }} {{ selectedTask.assignedWorker.lastName }}</p>
            <button class="btn btn-secondary" @click="closeModal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedTask: Object
    },
    methods: {
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-dialog {
    margin: 10% auto;
    width: 60%;
    max-width: 800px;
  }
  
  .modal-content {
    background-color: #fff;
    border-radius: 5px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  </style>
  