import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/utils/constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Finish splash after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0E1A', '#000814']}
        style={styles.gradient}
      >
        {/* Starfield background effect */}
        <View style={styles.stars}>
          {[...Array(50)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: Math.random() * height,
                  left: Math.random() * width,
                  opacity: Math.random() * 0.8 + 0.2,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Image */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                shadowOpacity: glowOpacity,
              },
            ]}
          >
            <Image
              source={require('@/assets/rezzonix_logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Animated bottom line */}
          <Animated.View
            style={[
              styles.bottomLine,
              {
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: glowAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: glowAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: glowAnim,
                },
              ]}
            />
          </View>

          <Text style={styles.initText}>INITIALIZING SYSTEM...</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  logoContainer: {
    width: width * 0.8,
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  bottomLine: {
    width: width * 0.6,
    height: 2,
    backgroundColor: COLORS.primary,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  initText: {
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 2,
    fontWeight: '600',
    marginTop: 10,
  },
});
