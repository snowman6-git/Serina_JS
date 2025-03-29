<script setup>
defineProps({
  
  user: {
    type: String,
    required: false,
  },

  date: {
    type: String,
    required: false,
  },
  
  chat: {
    type: String,
    required: false,
  },

})
</script>

<template>
  <div id="chat">
    <table border="0" id="writer_info">
      <tr>
        <td rowspan="2">
          <div id="profile" style="width: 3rem; height: 3rem; border-radius: 50%; box-sizing: border-box; border: 2px solid white; margin-right: 0.25rem;"></div>
        </td>
      
        <td id="chat_head">
          <p>{{ user }}</p>
          <p class="date">{{ date }}</p>
        </td>
      
      </tr>

      <tr>

        <td style="">{{ chat }}</td>

      </tr>
    </table>

  </div>
</template>
  
<style scoped>
#chat_head{
  display: flex; 
  flex-direction: row; 
  gap: 0.25rem;
  align-items: end;
}
.date{
  font-size: 0.75rem;
  opacity: 0.5;
  text-align:center;
}

</style>