<template>
  <div>
    <h1>Your Shortlist</h1>
    <NuxtLink to="/search">Back to search</NuxtLink>
    <button @click="clear">Clear Shortlist</button>
    <button @click="share">Share</button>
    <ul>
      <li v-for="p in items" :key="p.id">
        <NuxtLink :to="`/places/${p.id}`">{{ p.name }}</NuxtLink>
        <button @click="remove(p.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Shortlist from "~/src/services/shortlistService";

const items = ref<any[]>([]);

function load() {
  items.value = Shortlist.list();
}

function remove(id: string) {
  Shortlist.remove(id);
  load();
}

function clear() {
  Shortlist.clear();
  load();
}

function share() {
  const payload = JSON.stringify(items.value, null, 2);
  if ((navigator as any).share) {
    (navigator as any).share({ title: "My shortlist", text: payload });
  } else {
    // fallback: copy to clipboard
    navigator.clipboard?.writeText(payload);
    alert("Shortlist copied to clipboard");
  }
}

onMounted(load);
</script>
