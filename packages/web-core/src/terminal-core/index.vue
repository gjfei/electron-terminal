<template>
  <pre v-html="messages" />
  <el-input v-model="command" @keydown.enter="onWrite" />
  <el-button type="primary" @click="init">init</el-button>
  <hr />
  <div>{{ title }}</div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue';
import { ipcRenderer } from 'electron';
import { Compiler } from '../asni-compiler-core';

const title = ref('');

const command = ref('cd C:/Users/Administrator/Desktop/demo');
const messages = ref<string>();

const compiler = new Compiler({
  setTitle: (val) => {
    title.value = val;
  },
});

const onTerminalOutPut = (event, message: string) => {
  console.log({ message });
  const codes = compiler.write(message).map((rowItem) => {
    return `<div style="height:1em;">${rowItem
      .map((item) => {
        const { styles = [], value } = item;
        return `<span style="${styles.join(';')};">${value}</span>`;
      })
      .join('')}</div>`;
  });
  messages.value = codes.join('');
};

onUnmounted(() => {
  ipcRenderer.off('terminal-output', onTerminalOutPut);
  ipcRenderer.send('terminal-kill');
});

const init = async () => {
  ipcRenderer.off('terminal-output', onTerminalOutPut);
  ipcRenderer.on('terminal-output', onTerminalOutPut);
  ipcRenderer.send('init-terminal');
};

const onWrite = () => {
  ipcRenderer.send('terminal-write', `${command.value} \r`);
  command.value = '';
};
</script>

<style scoped lang="scss">
pre {
  background-color: #000000;
  color: #cccccc;
  margin: 0;
}
</style>
