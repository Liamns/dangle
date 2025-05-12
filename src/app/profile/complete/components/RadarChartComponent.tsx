"use client";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Colors } from "../../../../shared/consts/colors";
import styles from "../page.module.scss";

export interface RadarChartComponentProps {
  data: any[];
  resetKey: boolean;
}

export default function RadarChartComponent({
  data,
  resetKey,
}: RadarChartComponentProps) {
  return (
    <div className={styles.radarContainerWrapper}>
      <div className={styles.radarContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={data}
            key={`radar-chart-${resetKey}`}
          >
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
              dataKey="subject"
              tick={(props) => {
                const { x, y, textAnchor, payload } = props;

                // Map colors to traits
                const colorMap: Record<string, string> = {
                  영리: "#7f4c2f",
                  사교: "#FF8BC1",
                  활발: "#FFDB6D",
                  독립: "#F29F70",
                  차분: "#8CC8DA",
                };

                const value = String(payload.value);
                const fillColor =
                  value in colorMap ? colorMap[value] : "#FDC94A";

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor={textAnchor}
                      fill={fillColor}
                      fontSize="12px"
                      fontWeight="bold"
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <PolarRadiusAxis
              domain={[0, 12]}
              angle={18}
              tick={false}
              tickCount={6}
            />
            <Radar
              name="score"
              dataKey="A"
              stroke={Colors.secondary}
              fill={Colors.secondary}
              fillOpacity={0.6}
              animationDuration={400}
              animationEasing="ease-out"
              animationBegin={800}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
