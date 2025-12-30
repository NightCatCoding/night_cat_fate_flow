<script setup lang="ts">
defineOptions({name: 'NAmbientBg'})

interface Props {
  // 是否啟用動態效果（如轉盤旋轉時）
  animated?: boolean
  // 主色調強度
  intensity?: 'low' | 'medium' | 'high'
}

withDefaults(defineProps<Props>(), {
  animated: false,
  intensity: 'medium',
})

// 強度映射
const intensityMap = {
  low: {
    primary: 'bg-cat-eye/[0.04]',
    secondary: 'bg-accent-warm/[0.03]',
    primaryAnimated: 'bg-cat-eye/[0.08]',
    secondaryAnimated: 'bg-accent-warm/[0.05]',
  },
  medium: {
    primary: 'bg-cat-eye/[0.07]',
    secondary: 'bg-accent-warm/[0.05]',
    primaryAnimated: 'bg-cat-eye/[0.12]',
    secondaryAnimated: 'bg-accent-warm/[0.08]',
  },
  high: {
    primary: 'bg-cat-eye/[0.10]',
    secondary: 'bg-accent-warm/[0.07]',
    primaryAnimated: 'bg-cat-eye/[0.15]',
    secondaryAnimated: 'bg-accent-warm/[0.10]',
  },
}
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden">
    <!-- 左上角光暈 -->
    <div
        :class="[
        'absolute top-[-20%] left-[-10%] w-[50%] h-[50%]',
        'rounded-full blur-[120px] transition-all duration-1000',
        animated 
          ? intensityMap[intensity].primaryAnimated
          : intensityMap[intensity].primary
      ]"
    />

    <!-- 右下角暖色光暈 -->
    <div
        :class="[
        'absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%]',
        'rounded-full blur-[120px] transition-all duration-1000',
        animated
          ? intensityMap[intensity].secondaryAnimated
          : intensityMap[intensity].secondary
      ]"
    />

    <!-- 噪點紋理 -->
    <div class="noise-overlay"/>
  </div>
</template>
