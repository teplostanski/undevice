<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
import { undevice } from '../../../src/index'

const { lang } = useData()
const ru = computed(() => lang.value.startsWith('ru'))
const samples = {
  iPhone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
  Android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
  Desktop:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  curl: 'curl/8.0',
  Googlebot: 'Googlebot/2.1',
}
const ua = ref('')
const browserUa = ref('')
onMounted(() => {
  browserUa.value = navigator.userAgent
  ua.value = browserUa.value
})
const { detect } = undevice({
  isRawClient: ['curl', 'wget'],
  isCrawler: (ua: string) => /googlebot/i.test(ua),
})
const result = computed(() => detect({ userAgent: ua.value }))
const active = computed(() =>
  Object.entries(result.value)
    .filter(([, value]) => value)
    .map(([key]) => key),
)
</script>

<template>
  <section class="playground">
    <label for="user-agent">User-Agent</label>
    <textarea id="user-agent" v-model="ua" spellcheck="false" />
    <div class="playground-presets">
      <button type="button" @click="ua = browserUa">{{ ru ? 'Мой User-Agent' : 'My User-Agent' }}</button>
      <button v-for="(value, name) in samples" :key="name" type="button" @click="ua = value">{{ name }}</button>
      <button type="button" @click="ua = ''">{{ ru ? 'Очистить' : 'Clear' }}</button>
    </div>
    <p>{{ ru ? 'Флаги со значением true' : 'Flags with a true value' }}</p>
    <div class="flag-list" aria-live="polite"><code v-for="flag in active" :key="flag">{{ flag }}</code></div>
    <details><summary>{{ ru ? 'Полный результат' : 'Full result' }}</summary><pre>{{ JSON.stringify(result, null, 2) }}</pre></details>
  </section>
</template>
