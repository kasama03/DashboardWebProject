import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import * as echarts from "echarts";

interface PieProps {
  gradeData: { value: number; name: string }[];
}

const Pie: React.FC<PieProps> = ({ gradeData }) => {
  useEffect(() => {
    const chartDom = document.getElementById("pie");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      // กำหนดชื่อที่แตกต่างกันเองสำหรับแต่ละส่วน
      const customNames = [
        "A",
        "B+",
        "B",
        "C+",
        "C",
        "D+",
        "D",
        "F",
        "M",
        "I",
        "S",
        "U",
        "P",
        "W",
      ];

      const transformedData = customNames.map((name, index) => {
        const data = gradeData[index] || { value: 0, name }; // ถ้าไม่มีค่าให้กำหนด value = 0
        return {
          value: data.value,
          name,
        };
      });

      const option: echarts.EChartsOption = {
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left", data: customNames },
        series: [
          {
            name: "ผลการเรียน",
            type: "pie",
            radius: "50%",
            data: transformedData.filter((data) => data.value > 0), // ใช้ข้อมูลที่ถูกกรอง
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              color: (params) => {
                const colors = [
                  "#F8E3A1" /* Light Yellow */,
                  "#F7E09E" /* Soft Yellow */,
                  "#F3B674" /* Warm Amber */,
                  "#E87A00" /* Deep Orange */,
                  "#FF7F00" /* Vivid Orange */,
                  "#FF9B47" /* Strong Orange */,
                  "#FF9F2E" /* Rich Amber */,
                  "#F26522" /* New Orange (เพิ่มสีนี้) */,
                  "#E65500" /* Dark Red-Orange */,
                  "#D94C1E" /* Dark Tomato */,
                  "#E67A1A" /* Burnt Orange */,
                  "#FF9F2E" /* Rich Amber */,
                  "#E6A800" /* Deep YellowGold */,
                  "#E6E600" /* Golden Yellow */,
                  "#FFCC00" /* Bright Gold */,
                ];
                return colors[params.dataIndex % colors.length];
              },
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{b}: {d}%", // แสดงชื่อที่กำหนดเองและเปอร์เซ็นต์
              fontFamily: '"Kanit", sans-serif',
            },
          },
        ],
      };

      myChart.setOption(option);
    }
  }, [gradeData]);

  return (
    <Card className="flex w-[50%] mt-5 mb-5 font-normal flex-col justify-center items-center h-[500px]">
      <div className="font-normal mt-5 text-center">
        <span>จำนวนนักศึกษาที่ได้ผลการเรียนในแต่ละระดับ</span>
      </div>
      <div
        id="pie"
        style={{ width: "80%", height: "70%", marginTop: "20px", left: "40px" }}
        className="font-normal"
      ></div>
    </Card>
  );
};

export default Pie;
