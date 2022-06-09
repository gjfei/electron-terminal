<template>
  <pre v-for="(message, idx) in messages" :key="idx" v-html="message" />
  <el-input v-model="command" @keydown.enter="onWrite" />
  <el-button type="primary" @click="init">init</el-button>
</template>

<script setup>
import { ref } from 'vue';
import { ipcRenderer } from 'electron';
import compiler from '@/asni-compiler-core';

const command = ref('');
const messages = ref([]);

const init = () => {
  ipcRenderer.on('terminal-output', (event, message) => {
    console.log({ message });
    messages.value.push(compiler(message));
  });
  ipcRenderer.send('init-terminal');
};

const onWrite = () => {
  ipcRenderer.send('terminal-write', `${command.value} \r\n`);
  command.value = '';
};
</script>

<style scoped lang="scss"></style>
