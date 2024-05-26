<template>
  <div>
    <header class="bg-dark text-white p-4">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- <h1 class="text-lg fw-bold">Sistema de Gerenciamento</h1> -->
        <img  class="text-lg" src="./assets/logo.png" width="25px">
        <nav>
          <ul class="d-flex gap-4">
            <li><router-link to="/" class="text-white text-decoration-none">Home</router-link></li>
            <li><router-link to="/management/projects" class="text-white text-decoration-none">Administrar Projetos</router-link></li>
            <!-- <li><router-link to="/teams" class="text-white text-decoration-none">Equipes</router-link></li>
            <li><router-link to="/workers" class="text-white text-decoration-none">Trabalhadores</router-link></li> -->
          </ul>
        </nav>
      </div>
    </header>

    <div class="d-flex">
      <aside class="bg-light p-4" style="width: 250px;">
        <nav>
          <ul class="list-unstyled">
            <li><router-link to="/clients" class="btn btn-light mb-2 w-100 text-start">Clientes</router-link></li>
            <li><router-link to="/projects" class="btn btn-light mb-2 w-100 text-start">Projetos</router-link></li>
            <li><router-link to="/workers" class="btn btn-light mb-2 w-100 text-start">Trabalhadores</router-link></li>
            <li><router-link to="/teams" class="btn btn-light mb-2 w-100 text-start">Equipes</router-link></li>
          </ul>
        </nav>
      </aside>

      <main class="p-4 flex-grow-1">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
a {
  text-decoration: none;
  color: white;
}
a:hover {
  text-decoration: underline;
}
</style>
