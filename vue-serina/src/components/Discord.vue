<script setup>
import ChatBox from './ChatBox.vue'
import { ref } from 'vue';
import axios from 'axios';


async function data_call(){
  try {
    const response = await axios.get('http://localhost:3000/report?uid=412863872127729687');
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

data_call()

const chat_data = ref([
  { user: "testuser", date: "2025-03-25 18:21:07", chat: "테스트 1번" },
  { user: "testuser", date: "2025-03-25 18:21:07", chat: "테스트 1번" },
  { user: "testuser", date: "2025-03-25 18:21:07", chat: "테스트 1번" },
  { user: "testuser", date: "2025-03-25 18:21:07", chat: "테스트 1번" },
]);

</script>

<template>
  <div id="panel">
  
  <div id="chat" style="width: 100%;" v-for="(component, index) in chat_data" :key="index">
    <ChatBox :user="component.user" :date="component.date" :chat="component.chat"/>
  </div>

  </div>
</template>
  
<style scoped>

#panel{
  padding: 1rem;
  width: 100%; height: 100vh;
  box-sizing: border-box;

  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 1rem;
}
</style>