<script lang="ts" setup>
function s(){
    alert("yes");
    return "s"
}
</script>

<template lang="pug">
div Foo
button.p-3.px-6.pt-2.bg-orange-400(@click="s()" style="color: white; font-weight: 700; border-radius: 32px;") Save

</template>

<style scoped></style>
