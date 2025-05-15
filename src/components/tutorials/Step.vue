<template>
  <div class="shadow p-6 rounded mx-auto">
    <Button>Hello World</Button>
    <Input></Input>
    <Tiptap client:visible />
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Tiptap from "@/components/tiptap/Editor.vue"

</script>
