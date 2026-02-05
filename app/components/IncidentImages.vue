<script setup lang="ts">
</script>

<template>
    <div class="incident-images">
        <div class="images-container">
            <NuxtImg src="/images/incident1.png" alt="Symptom Matrix"
                class="incident-image image-back" format="webp" quality="80"
                loading="lazy" />
            <NuxtImg src="/images/incident2.png" alt="Hypothesis List"
                class="incident-image image-front" format="webp" quality="80"
                loading="lazy" />
        </div>
    </div>
</template>

<style scoped>
.incident-images {
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;
    overflow: hidden;
}

.images-container {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
}

.incident-image {
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.image-back {
    width: 130%;
    top: -15%;
    left: -20%;
    transform: rotateY(8deg) rotateX(2deg);
    z-index: 1;
}

.image-front {
    width: 120%;
    bottom: -20%;
    right: -15%;
    transform: rotateY(8deg) rotateX(2deg);
    z-index: 2;
}
</style>
