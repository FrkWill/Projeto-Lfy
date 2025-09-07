<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Painel - Produtos</h2>
      <!-- Botoes -->
      <div>
        <button class="btn btn-outline-primary me-2" @click="downloadCSV">
          Export CSV
        </button>
        <button class="btn btn-outline-primary me-2" @click="downloadXLSX">
          Export XLSX
        </button>
        <button class="btn btn-outline-danger" @click="logout">
          Logout
        </button>
      </div>
    </div>

    <!-- Filtro e tabela -->
    <div class="mb-3" style="text-align: -webkit-right;">
      <input v-model="search" type="text" class="form-control" placeholder="Filtrar" style="width: fit-content;" />
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr style="text-align: center;">
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredProducts" :key="p.id">
            <td>{{ p.id }}</td>
            <td><input v-model="p.name" @blur="save(p)" class="form-control" /></td>
            <td><input v-model="p.sku" @blur="save(p)" class="form-control" /></td>
            <td><input v-model.number="p.price" @blur="save(p)" class="form-control" /></td>
            <td><input v-model.number="p.stock" @blur="save(p)" class="form-control" /></td>
            <td style="text-align: center;">
              <button @click="revert(p)" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-arrow-rotate-left" style="color: #ffffff;"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="saving" class="mt-3 text-info">Salvando...</div>
    <div v-if="message" class="mt-3 text-success">{{ message }}</div>
  </div>
</template>

<script>
import api from '../services/api';
import Papa from 'papaparse';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';

export default {
  data(){ 
    return { 
      products: [], 
      original: {}, 
      saving: false, 
      message: '', 
      search: ''  // aqui vai o valor do filtro
    } 
  },
  async created() {
    await this.load();
  },
  computed: {
    filteredProducts() {
      if (!this.search) return this.products;
      const term = this.search.toLowerCase();
      return this.products.filter(p =>
        String(p.name).toLowerCase().includes(term) ||
        String(p.sku).toLowerCase().includes(term) ||
        String(p.price).toLowerCase().includes(term)
      );
    }
  },
  methods: {
    // Carrega produtos
    async load(){
      const res = await api.get('/products');
      this.products = res.data;
      this.original = JSON.parse(JSON.stringify(this.products));
    },
    // Salva produto editado
    async save(item){
      this.saving = true;
      try {
        const updates = { name: item.name, sku: item.sku, price: item.price, stock: item.stock };
        await api.put(`/products/${item.id}`, updates);
        this.message = 'Salvo';
        setTimeout(()=> this.message = '', 2000);
      } catch(err) {
        console.error(err);
        this.message = 'Erro ao salvar';
      } finally {
        this.saving = false;
      }
    },
    // Reverte alterações
    revert(item) {
      const orig = this.original.find(o => o.id === item.id);
      if (orig) {
        Object.assign(item, JSON.parse(JSON.stringify(orig)));
      }
    },
    // Exporta CSV e XLSX
    downloadCSV() {
      const csv = Papa.unparse(this.products);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'products.csv');
    },
    downloadXLSX() {
      const ws = XLSX.utils.json_to_sheet(this.products)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Products')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        'products.xlsx'
      )
    },
    // Logout usuario
    async logout() {
      await api.post('/auth/logout');
      window.location.reload();
    }
  }
};
</script>
