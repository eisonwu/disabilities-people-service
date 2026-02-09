<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import AMap from "@/component/amap/index.vue"
import {ElMessage} from "element-plus";
import {load} from "@amap/amap-jsapi-loader";
import {getMapPoints} from "@/api";
import type {MapPoint} from "@/api";

const DISTRICT_ADCODE = "440513";
const DISTRICT_CENTER: [number, number] = [116.62, 23.26];
const BORDER_STROKE_COLOR = "#2563eb";
const BORDER_STROKE_WEIGHT = 4;
//
// const mapRef = ref<HTMLElement | null>(null);
// const mapError = ref("");
const filterAbnormal = ref(false);
// let map: { destroy?: () => void; resize?: () => void; invalidateSize?: () => void; add: (m: unknown) => void; setFitView: (opts?: unknown) => void } | null = null;
// let resizeObserver: ResizeObserver | null = null;
//
// function parseBoundary(boundary: string): [number, number][] {
//     return boundary.split(";").map((s) => {
//         const [lng, lat] = s.split(",").map(Number);
//         return [lng, lat];
//     });
// }
//
// async function initMap(points: MapPoint[]) {
//     const key = import.meta.env.VITE_AMAP_KEY;
//     if (!key || key === "your_amap_key_here") {
//         mapError.value = "请配置高德地图 Key：在项目根目录创建 .env 并设置 VITE_AMAP_KEY（可参考 .env.example）";
//         return;
//     }
//
//     if (!mapRef.value) return;
//
//     try {
//         const AMap = await load({
//             key,
//             version: "2.0",
//             plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.DistrictSearch"],
//         });
//
//         map = new AMap.Map(mapRef.value, {
//             zoom: 12,
//             center: DISTRICT_CENTER,
//             viewMode: "2D",
//         });
//
//         const mapInstance = map as { add: (m: unknown) => void; setFitView: (opts?: unknown) => void };
//
//         const districtSearch = new AMap.DistrictSearch({
//             extensions: "all",
//             level: "district",
//         });
//
//         districtSearch.search(DISTRICT_ADCODE, (status: string, result: { districtList?: { boundaries?: string[]; center?: { lng: number; lat: number } }[] }) => {
//             if (status !== "complete" || !result?.districtList?.[0]) return;
//             const district = result.districtList[0];
//             const boundaries = district.boundaries;
//             if (boundaries?.length) {
//                 boundaries.forEach((boundaryStr: string) => {
//                     const path = parseBoundary(boundaryStr);
//                     const polygon = new AMap.Polygon({
//                         path,
//                         strokeColor: BORDER_STROKE_COLOR,
//                         strokeWeight: BORDER_STROKE_WEIGHT,
//                         fillColor: "transparent",
//                         fillOpacity: 0,
//                     });
//                     mapInstance.add(polygon);
//                 });
//             }
//             const center = district.center;
//             if (center && map) {
//                 (map as AMap.Map).setCenter([center.lng, center.lat]);
//                 map?.setFitView?.();
//             }
//         });
//
//         points.forEach((p) => {
//             const marker = new AMap.Marker({
//                 position: [p.lng, p.lat],
//                 title: p.name,
//             });
//             mapInstance.add(marker);
//             marker.on("click", () => {
//                 ElMessage.info(`${p.name}（${p.online ? "在线" : "离线"})`);
//             });
//         });
//
//         if (mapRef.value) {
//             const onResize = () => (map as { resize?: () => void; invalidateSize?: () => void })?.resize?.() ?? (map as { invalidateSize?: () => void })?.invalidateSize?.();
//             resizeObserver = new ResizeObserver(onResize);
//             resizeObserver.observe(mapRef.value);
//         }
//     } catch (e) {
//         mapError.value = e instanceof Error ? e.message : "地图加载失败";
//     }
// }
//
// onMounted(async () => {
//     const points = await getMapPoints();
//     await initMap(points);
// });
//
// onBeforeUnmount(() => {
//     resizeObserver?.disconnect();
//     resizeObserver = null;
//     if (map?.destroy) map.destroy();
//     map = null;
// });
</script>

<template>
  <div class="monitor-map-page">
    <div class="toolbar">
      <el-form inline>
        <el-form-item label="异常设备">
          <el-switch v-model="filterAbnormal"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="map-container">
      <AMap/>
    </div>
  </div>
</template>
