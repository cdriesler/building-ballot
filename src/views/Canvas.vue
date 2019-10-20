<template>
<div id="main">
    <div class="diagram">
        <heatmap :options="modelName"></heatmap>
    </div>
    <model-gltf :src="filePath"></model-gltf>  
    <button @click="pickModel('option1')">Option 1</button>
    <button @click="pickModel('option2')">Option 2</button>
    <button @click="pickModel('option3')">Option 3</button>

</div>
</template> 

<style>
.main {
    width: 100%;
    height: 100%;
}

.diagram {
    position: absolute;
    left: 50px;
    top: 50px;
    width: 250px;
    max-width: 250px;
    height: 250px;
    max-height: 250px;
    z-index: 10;

    padding: 0;
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

