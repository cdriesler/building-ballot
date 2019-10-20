<template>
<div>
    <model-gltf :src="filePath"></model-gltf>  
    <button @click="pickModel('option1')">Option 1</button>
    <button @click="pickModel('option2')">Option 2</button>
    <button @click="pickModel('option3')">Option 3</button>
    <div class="heatmap">
        <heatmap></heatmap>
    </div>
</div>
</template> 

<style>
.heatmap {
    position: absolute;
    left: 15;
    top: 15;
    width: 250px;
    height: 250px;
    z-index: 10;
}
</style>

<script>
    import { ModelGltf } from 'vue-3d-model'
    import Heatmap from './Heatmap.vue';

    export default {
        components: {
            ModelGltf,
            Heatmap
        },
        data() {
            return {
                modelName: "option1"
            }
        },
        computed: {
            filePath() {
                return `./${this.modelName}.gltf`
            }
        },
        methods: {
            pickModel(name) {
                this.modelName = name;
            }
        }
    }
</script>

