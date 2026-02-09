import AMapLoader from "@amap/amap-jsapi-loader";
import { getMapPoints } from "@/api";
import type { MapPoint } from "@/api/types";

export interface MapOptions {
    container: HTMLDivElement;
    ad: string;
    adcode: string;
}

/** IndexCluster 点数据格式：需包含 lnglat，以及用于聚合的索引字段 */
interface IndexClusterPoint {
    lnglat: [number, number];
    district: string;
    zone: string;
    name: string;
    abnormal?: boolean;
}

function toIndexClusterPoints(list: MapPoint[]): IndexClusterPoint[] {
    return list.map((p, i) => ({
        lnglat: [p.lng, p.lat],
        district: "汕头",
        zone: `z${i}`,
        name: p.name,
        abnormal: p.abnormal,
    }));
}

export async function useAMap(options: MapOptions) {
    const appKey = import.meta.env.VITE_AMAP_KEY;
    const appSecret = import.meta.env.VITE_APP_SECRET;

    if (!appKey || !appSecret) {
        console.error("[AMap] app key is missing");
        return;
    }

    window["_AMapSecurityConfig"] = {
        securityJsCode: appSecret,
    };

    const AMap = await AMapLoader.load({
        key: appKey,
        version: "2.0",
    });

    const map = new AMap.Map(options.container, {
        mapStyle: "amap://styles/whitesmoke",
        viewMode: "2D",
        zoom: 11,
        resizeEnable: true,
    });

    // 按 adcode 默认定位到该行政区
    AMap.plugin("AMap.DistrictSearch", () => {
        const districtSearch = new AMap.DistrictSearch({ extensions: "all", level: "district" });
        districtSearch.search(options.adcode, (status: string, result: { districtList?: { center?: { lng: number; lat: number }; boundaries?: string[] }[] }) => {
            if (status !== "complete" || !result?.districtList?.[0]) return;
            const district = result.districtList[0];
            if (district.center) {
                map.setCenter([district.center.lng, district.center.lat]);
            }
            const boundaries = district.boundaries;
            if (boundaries?.length) {
                const tempPolygons: { add: () => void; remove: () => void }[] = [];
                boundaries.forEach((str: string) => {
                    const path = str.split(";").map((s) => {
                        const [lng, lat] = s.split(",").map(Number);
                        return [lng, lat];
                    });
                    const polygon = new AMap.Polygon({ path });
                    tempPolygons.push(polygon);
                    map.add(polygon);
                });
                map.setFitView(tempPolygons, false, [20, 20, 20, 20]);
                tempPolygons.forEach((p) => map.remove(p));
            }
        });
    });

    AMap.plugin(["AMap.Scale", "AMap.ToolBar"], () => {
        const scale = new AMap.Scale();
        const toolbar = new AMap.ToolBar();
        map.addControl(scale);
        map.addControl(toolbar);
    });

    // AMap.plugin("AMap.Weather", () => {
    //     const weather = new AMap.Weather();
    //     weather.getLive(options.adcode, (err: Error, data: unknown) => {
    //         if (err) console.warn("[AMap] weather", err);
    //     });
    // });

    AMap.plugin("AMap.DistrictLayer", () => {
        const districtLayer = new AMap.DistrictLayer.Province({
            adcode: options.adcode,
            depth: 2,
            styles: {
                "city-stroke": "red",
                "county-stroke": "#7dd3fc",
                "stroke-width": 3,
                fill: () => "transparent",
            },
        });
        districtLayer.setMap(map);
    });

    const rawPoints = await getMapPoints();
    const points = toIndexClusterPoints(rawPoints);

    AMap.plugin("AMap.IndexCluster", () => {
        const clusterIndexSet = {
            district: { minZoom: 2, maxZoom: 10 },
            zone: { minZoom: 10, maxZoom: 22 },
        };
        const clusterColors = ["rgba(8,60,156,.85)", "rgba(66,130,198,.85)", "rgba(107,174,214,.85)", "rgba(78,200,211,.85)"];
        const clusterBorderColors = ["rgb(8,60,156)", "rgb(66,130,198)", "rgb(107,174,214)", "rgb(78,200,211)"];
        const renderClusterMarker = (context: {
            marker: { setContent: (el: string | HTMLElement) => void; setAnchor: (anchor: string) => void };
            count: number;
            clusterData?: IndexClusterPoint[];
            data?: IndexClusterPoint[];
            index?: { mainKey?: string };
        }) => {
            const count = context.count;
            const isSingle = count === 1;
            const first = context.clusterData?.[0] ?? context.data?.[0];
            const abnormal = isSingle && first?.abnormal;
            const name = isSingle ? (first?.name ?? "") : "";
            const marker = context.marker;

            if (isSingle) {
                const bg = abnormal ? "#dc2626" : "#2563eb";
                const borderColor = abnormal ? "#b91c1c" : "#1d4ed8";
                const div = document.createElement("div");
                div.className = "amap-cluster amap-cluster--single";
                div.style.cssText = [
                    "display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:16px;",
                    "background:linear-gradient(180deg,#fff 0%,#f1f5f9 100%);",
                    "border:1px solid " + borderColor + ";box-shadow:0 2px 8px rgba(0,0,0,.15);",
                    "font-size:12px;color:#334155;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;",
                ].join(" ");
                const dot = document.createElement("span");
                dot.style.cssText = "width:10px;height:10px;border-radius:50%;background:" + bg + ";border:2px solid #fff;box-shadow:0 0 0 1px " + borderColor + ";flex-shrink:0;";
                div.appendChild(dot);
                if (name) {
                    const label = document.createElement("span");
                    label.textContent = name;
                    label.style.fontWeight = "500";
                    div.appendChild(label);
                }
                marker.setContent(div);
                marker.setAnchor("center");
                return;
            }

            const level = count <= 5 ? 0 : count <= 20 ? 1 : count <= 60 ? 2 : 3;
            const bgColor = clusterColors[level];
            const borderColor = clusterBorderColors[level];
            const size = Math.round(36 + Math.pow(Math.min(count / points.length, 1), 0.3) * 44);
            const div = document.createElement("div");
            div.className = "amap-cluster";
            div.style.cssText = [
                "display:flex;flex-direction:column;align-items:center;justify-content:center;",
                "width:" + size + "px;height:" + size + "px;border-radius:50%;",
                "background:" + bgColor + ";border:2px solid " + borderColor + ";",
                "color:#fff;font-size:13px;font-weight:bold;box-shadow:0 2px 10px rgba(0,0,0,.25);box-sizing:border-box;",
            ].join(" ");
            div.textContent = String(count);
            marker.setContent(div);
            marker.setAnchor("center");
        };
        const indexCluster = new AMap.IndexCluster(map, points, {
            clusterIndexSet,
            renderClusterMarker,
        });
    });

    return {
        map,
        destroy() {
            map.destroy();
        },
    };
}