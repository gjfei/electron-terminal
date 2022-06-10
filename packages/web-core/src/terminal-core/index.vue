<template>
  <pre v-for="(message, idx) in messages" :key="idx" v-html="message" />
  <el-input v-model="command" @keydown.enter="onWrite" />
  <el-button type="primary" @click="init">init</el-button>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue';
import { ipcRenderer } from 'electron';
import compiler from '../asni-compiler-core';

const command = ref('');
const messages = ref<string[]>([]);

const onTerminalOutPut = (event, message: string) => {
  console.log({ message });
  messages.value.push(compiler(message));
};

onUnmounted(() => {
  ipcRenderer.off('terminal-output', onTerminalOutPut);
  ipcRenderer.send('terminal-kill');
});

const init = () => {
  ipcRenderer.off('terminal-output', onTerminalOutPut);
  ipcRenderer.on('terminal-output', onTerminalOutPut);
  ipcRenderer.send('init-terminal');
};

const onWrite = () => {
  ipcRenderer.send('terminal-write', `${command.value} \r\n`);
  command.value = '';
};
</script>

<style scoped lang="scss"></style>
