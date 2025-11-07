<template>
  <div>
    <button @click="$router.back()">Back</button>
    <div v-if="loading">Loading...</div>
    <div v-if="data">
      <h1>{{ data.place.name }}</h1>
      <p>{{ data.place.address }}</p>
      <p>Category: {{ data.place.category }}</p>
      <p>{{ data.place.short_description }}</p>

      <button @click="toggleShortlist">
        {{ inShortlist ? "Remove from" : "Add to" }} Shortlist
      </button>

      <h3>Events</h3>
      <ul>
        <li v-for="e in data.events" :key="e.id">
          <a v-if="e.source_url" :href="e.source_url" target="_blank">{{
            e.title
          }}</a>
          <span v-else>{{ e.title }}</span>
          <p>{{ e.summary }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Shortlist from "~/src/services/shortlistService";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id || "");
const data = ref<any>(null);
const loading = ref(false);
const inShortlist = ref(false);

async function load() {
  loading.value = true;
  data.value = await $fetch(`/api/places/${encodeURIComponent(id)}`);
  loading.value = false;
  inShortlist.value = Shortlist.isInShortlist(data.value.place.id);
}

function toggleShortlist() {
  if (!data.value) return;
  if (Shortlist.isInShortlist(data.value.place.id)) {
    Shortlist.remove(data.value.place.id);
    inShortlist.value = false;
  } else {
    Shortlist.add(data.value.place);
    inShortlist.value = true;
  }
}

onMounted(load);
</script>
