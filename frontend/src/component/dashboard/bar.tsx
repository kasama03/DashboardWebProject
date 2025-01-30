import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import * as echarts from "echarts";

interface BarProps {
  clo: number[];          // กำหนดประเภทเป็น array ของ number
  studentAll: number[];   // กำหนดประเภทเป็น array ของ number
  totalPass: number[];    // กำหนดประเภทเป็น array ของ number
}

const Bar: React.FC<BarProps> = ({ clo, studentAll, totalPass }) => {
  useEffect(() => {
    const barChartDom = document.getElementById("bar");
    if (barChartDom) {
      const myChart = echarts.init(barChartDom);

      // จัดการข้อมูล series โดยใช้ข้อมูล clo, studentAll และ totalPass
      const series = [
        {
          data: totalPass,
          type: "bar",
          stack: "pass_fail",
          name: "ผ่าน (%)",
          itemStyle: {
            color: "#F26522", // สีส้มเข้ม
          },
        },
        {
          data: studentAll.map(
            (_, index) => Math.max(100 - totalPass[index], 0)
          ),
          type: "bar",
          stack: "pass_fail",
          name: "ไม่ผ่าน (%)",
          itemStyle: {
            color: "#2196F3", 
          },
        },
      ];

      const stackInfo: {
        [key: string]: { stackStart: number[]; stackEnd: number[] };
      } = {};

      for (let i = 0; i < series[0].data.length; ++i) {
        for (let j = 0; j < series.length; ++j) {
          const stackName = series[j].stack;
          if (!stackName) continue;
          if (!stackInfo[stackName]) {
            stackInfo[stackName] = {
              stackStart: [],
              stackEnd: [],
            };
          }
          const info = stackInfo[stackName];
          const data = series[j].data[i];
          if (data) {
            if (info.stackStart[i] == null) {
              info.stackStart[i] = j;
            }
            info.stackEnd[i] = j;
          }
        }
      }

      for (let i = 0; i < series.length; ++i) {
        const data = series[i].data as
          | number[]
          | { value: number; itemStyle: object }[]; 
        const info = stackInfo[series[i].stack];
        for (let j = 0; j < series[i].data.length; ++j) {
          const isEnd = info.stackEnd[j] === i;
          const topBorder = isEnd ? 20 : 0;
          const bottomBorder = 0;
          data[j] = {
            value: data[j] as number,
            itemStyle: {
              borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder],
            },
          };
        }
      }

      const option: echarts.EChartsOption = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: {
          data: ["ผ่าน (%)", "ไม่ผ่าน (%)"],
          bottom: "0%", // ตำแหน่ง legend อยู่ด้านล่าง
        },
        grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
        xAxis: {
          type: "category",
          data: clo.map((CloNo) => `CLO ${CloNo}`),
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: "{value}" },
          max: 100,
        },
        series: series as any,
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [clo, studentAll, totalPass]);

  return (
    <Card className="flex w-[50%] mt-5 mb-5 ml-5 font-normal flex-col justify-center items-center h-[500px]">
      <div className="font-normal mt-5 text-center">
        <span>CLO : Course Learning Outcome</span>
      </div>
      <div
        id="bar"
        style={{ width: "80%", height: "70%" }}
        className="font-normal"
      ></div>
    </Card>
  );
};

export default Bar;
