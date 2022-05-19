<template>
  <div v-html="result"></div>
</template>

<script setup>
import chalk from 'chalk';
import compiler from '@/asni-compiler-core';

const result = compiler(
  `${chalk.bgRed.blue('Hello, world!')}/${chalk.bgRed.blue('Hello, world!')}`
);
</script>

<style scoped lang="scss"></style>
