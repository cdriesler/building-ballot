<template>
    <div id="heatmap">
        <div class="svgar" ref="svgar" id="svgar" v-html="svg">
            
        </div>
    </div>
</template>

<style scoped>
#heatmap {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.svgar {
    width: calc(100vw - 30px);
    max-width: 800px;
    height: calc(100vw - 30px);
    max-height: 800px;

    outline: 2px solid black;

    margin-top: 15px;
    box-sizing: border-box;
}

</style>

<script lang="ts">
import Vue from 'vue'
import Svgar, { Create, Update, Locate } from 'svgar';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import SvgarPath from 'svgar/dist/models/SvgarPath';

export default Vue.extend({
    name: "heatmap",
    data() {
        return {
            cube: {} as SvgarCube,
            w: 0,
            h: 0,
        }
    },
    created() {    
        this.cube = Create().svgar.cube("heatmap").then.build();
    },
    mounted() {
        let el = (<Element>this.$refs.svgar);
        this.w = el ? el.clientWidth : 0;
        this.h = el ? el.clientHeight : 0;

        let slab = Create().svgar.slab("cells").then.build();
        slab.setAllGeometry(this.makeGrid(this.w, this.h, 25));
        Update().svgar.slab(slab).styles.to([
            {
                name: "default",
                attributes: {
                    "stroke": "red",
                    "stroke-width": "0.5px",
                    "fill": "none"
                }
            }
        ]);
        Update().svgar.cube(this.cube).camera.extentsTo(0, 0, this.w, this.h);
        Update().svgar.cube(this.cube).slabs.to([slab]);
    },
    computed: {
        svg(): string {
            if (this.w == 0) {
                return "";
            }

            return this.cube.compile(this.w, this.h);
        }
    },
    methods: {
        makeGrid(width: number, height: number, size: number): SvgarPath[] {
            let paths: SvgarPath[] = [];

            for(let i = 0; i * size < width; i += 1) {

                for(let j = 0; j * size < height; j += 1) {
                    let sq = new Svgar.Builder.Polyline(i * size, j * size)
                    .lineTo((i + 1) * size, j * size)
                    .lineTo((i + 1) * size, (j + 1) * size)
                    .lineTo(i * size, (j + 1) * size)
                    .close();

                    paths.push(sq.build())
                }

            }

            return paths;
        }
    }
})
</script>