import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import * as echarts from "echarts";

interface LineProps {
  avgGpaArray: { AvgGpa: number; Term: string }[];
}

const Line: React.FC<LineProps> = ({ avgGpaArray }) => {
  useEffect(() => {
    console.log("avgGpaArray:", avgGpaArray);
    const lineChartDom = document.getElementById("line");
    if (lineChartDom) {
      const myChart = echarts.init(lineChartDom);

      // ตรวจสอบข้อมูลก่อนใช้งาน
      const terms = avgGpaArray.map((item) => item.Term || "N/A");
      const avgGpas = avgGpaArray.map((item) => item.AvgGpa ?? 0);

      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (terms.length === 0 || avgGpas.length === 0) {
        console.error("ไม่มีข้อมูลสำหรับแสดงกราฟ");
        return;
      }

      const option = {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
            type: "category",
            data: terms.map((term) => `ภาคการศึกษาที่ ${term}`), // Custom label
            axisLabel: {
              interval: 0, // แสดงข้อความทุกค่าในแกน x
              rotate: 30,  // หมุนข้อความ 30 องศา เพื่อไม่ให้ข้อความซ้อนกัน
              fontSize: 12, // กำหนดขนาดตัวอักษร
              fontFamily: '"Kanit", sans-serif',
            },
            axisTick: {
              alignWithLabel: true, // จัดระเบียบเส้น tick ให้ตรงกับ label
            },
          },
        yAxis: {
          type: "value",
          min: 0,
          max: 4, // ค่าขั้นต่ำ/ขั้นสูงสำหรับ GPA
        },
        series: [
          {
            data: avgGpas,
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#F26522",
            },
            itemStyle: {
                color: "#FF0000", // สีของจุด
                borderColor: "#FFFFFF", // สีขอบของจุด
                borderWidth: 2,
              },
          },
        ],
      };

      // ตั้งค่า option และ resize chart หากหน้าจอเปลี่ยนขนาด
      myChart.setOption(option);

      // ล้าง event และ chart เมื่อ component ถูก unmount
      return () => {
        myChart.dispose();
      };
    }
  }, [avgGpaArray]);

  return (
    <Card className="flex w-[50%] mt-5 mb-5 ml-5 font-normal flex-col justify-center items-center h-[500px]">
      <div className="font-normal mt-5 text-center">
        <span>ผลการเรียนเฉลี่ยในแต่ละภาคการศึกษา</span>
      </div>
      <div
        id="line"
        style={{ width: "100%", height: "70%" }}
        className="font-normal"
      ></div>
    </Card>
  );
};

export default Line;
