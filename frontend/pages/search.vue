<template>
  <div>
    <h1>Search Date Suggestions</h1>
    <input v-model="q" placeholder="Enter location" />
    <button @click="run">Search</button>

    <div v-if="loading">Loading...</div>

    <div>
      <NuxtLink to="/shortlist">View Shortlist</NuxtLink>
      <ul v-if="results">
        <li v-for="rec in results.recommendations" :key="rec.place.id">
          <h3>
            <NuxtLink :to="`/places/${rec.place.id}`">{{
              rec.place.name
            }}</NuxtLink>
            ({{ rec.place.category }})
          </h3>
          <p>{{ rec.place.short_description }}</p>
          <p>Distance: {{ rec.place.distance_from_query }}m</p>
          <button @click="toggleShortlist(rec.place)">
            {{ isShortlisted(rec.place.id) ? "Remove" : "Shortlist" }}
          </button>
          <div v-if="rec.events && rec.events.length">
            <strong>Events:</strong>
            <ul>
              <li v-for="e in rec.events" :key="e.id">
                {{ e.title }} — {{ e.summary }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Shortlist from "~/src/services/shortlistService";

const q = ref("서울시 광진구 화양동");
const results = ref(null as any);
const loading = ref(false);

async function run() {
  loading.value = true;
  const res = await $fetch("/api/search?q=" + encodeURIComponent(q.value));
  results.value = res;
  loading.value = false;
}

function toggleShortlist(place: any) {
  if (Shortlist.isInShortlist(place.id)) {
    Shortlist.remove(place.id);
  } else {
    Shortlist.add(place);
  }
}

function isShortlisted(id: string) {
  return Shortlist.isInShortlist(id);
}

// auto-run with default
run();
</script>
