import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/utils/constants';

interface ResonanceVisualizerProps {
  size?: number;
  frequency: number;
}

export const ResonanceVisualizer: React.FC<ResonanceVisualizerProps> = ({
  size = 200,
  frequency = 528,
}) => {
  const rings = [1, 2, 3, 4];
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {rings.map((ring, index) => {
          const radius = (center / rings.length) * ring;
          return (
            <Circle
              key={ring}
              cx={center}
              cy={center}
              r={radius}
              stroke={COLORS.primary}
              strokeWidth={2}
              fill="none"
              opacity={1 - index * 0.2}
              strokeDasharray="5,5"
            />
          );
        })}
        <Circle
          cx={center}
          cy={center}
          r={center * 0.3}
          fill={COLORS.primary}
          opacity={0.3}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
