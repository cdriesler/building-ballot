<template>
<div>
    <model-gltf :src="filePath"></model-gltf>  
    <button @click="pickModel('option1')">Option 1</button>
    <button @click="pickModel('option2')">Option 2</button>
    <button @click="pickModel('option3')">Option 3</button>
</div>
</template> 

<script>
    import { ModelGltf } from 'vue-3d-model'

    export default {
        components: {
            ModelGltf
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

