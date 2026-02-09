<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
import {useAMap} from "@/component/amap/hook.ts";

const mapContainer = ref<HTMLDivElement | null>(null);
const mapInstance = ref<any>(null);

onMounted(async () => {
  if (!mapContainer.value) {
    console.error("mapContainer.value is missing");
    return;
  }

  mapInstance.value = await useAMap({
    container: mapContainer.value,
    ad: "汕头市",
    adcode: "440513",
  });
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy();
  }
});

</script>

<template>
  <div ref="mapContainer" style="height: 100%"></div>
</template>
