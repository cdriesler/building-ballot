<template>
<div id="main">
    <div class="sidebar">
        <button @click="pickModel('option1')">Option 1</button>
        <button @click="pickModel('option2')">Option 2</button>
        <button @click="pickModel('option3')">Option 3</button>

        <vote-total :name="'test'" :pct="0.3"></vote-total>
    </div>

    <div class="viewer">
        <model-gltf :src="filePath"></model-gltf> 
    </div>

    <div class="heatmap">
        <heatmap :options="modelName"></heatmap>
    </div>  
</div>
</template> 

<style>
#main {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
}

.sidebar {
    height: 100%;
    width: 300px;

    background: grey;
}

.viewer {
    height: 100%;
    flex-grow: 1;
}

.heatmap {
    position: absolute;
    right: 15px;
    top: 200px;

    width: 250px;
    height: 250px;
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
    import VoteTotal from './../components/VoteTotal.vue';

    export default {
        components: {
            ModelGltf,
            Heatmap,
            VoteTotal,
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

