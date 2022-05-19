<template>
  <pre v-for="(message, idx) in messages" :key="idx" v-html="message" />
  <el-input v-model="command" @keydown.enter="onWrite" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ipcRenderer } from 'electron';
import compiler from '@/asni-compiler-core';

const command = ref('');
const messages = ref([]);
onMounted(() => {
  ipcRenderer.on('terminal-output', (event, message) => {
    console.log({ message });
    messages.value.push(compiler(message));
  });
  ipcRenderer.send('init-terminal');
});

const onWrite = () => {
  ipcRenderer.send('terminal-write', `${command.value} \n`);
  command.value = '';
};
</script>

<style scoped lang="scss"></style>
