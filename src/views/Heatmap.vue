<template>
    <div id="heatmap">
        <div 
        class="svgar" 
        ref="svgar" 
        id="svgar" 
        v-html="svg"
        @mousemove="onMove">
            
        </div>
        <div class="db">
            {{firebase}}
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
import { db } from './../firebase';
import Svgar, { Create, Update, Locate } from 'svgar';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import SvgarPath from 'svgar/dist/models/SvgarPath';
import SvgarSlab from 'svgar/dist/models/SvgarSlab';

interface PathReference {
    id: string,
    xMin: number,
    yMin: number,
    xMax: number,
    yMax: number
}

export default Vue.extend({
    name: "heatmap-component",
    data() {
        return {
            cube: {} as SvgarCube,
            paths: [] as PathReference[],
            w: 0,
            h: 0,
            prev: 0,
            firebase: {},
        }
    },
    created() {    
        this.cube = Create().svgar.cube("heatmap").then.build();

        db.ref().on("child_added", doc => {
            this.firebase = doc.toJSON() || {};
        });

    },
    mounted() {
        let el = (<Element>this.$refs.svgar);
        this.w = el ? el.clientWidth : 0;
        this.h = el ? el.clientHeight : 0;

        let slab = Create().svgar.slab("cells").then.build();
        Update().svgar.cube(this.cube).camera.extentsTo(0, 0, this.w, this.h);
        Update().svgar.cube(this.cube).slabs.to(this.makeGrid(this.w, this.h, 25));
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
        makeGrid(width: number, height: number, size: number): SvgarSlab[] {
            let slabs: SvgarSlab[] = [];

            for(let i = 0; i * size < width; i += 1) {

                for(let j = 0; j * size < height; j += 1) {
                    let p: number[] = [
                        i * size,
                        j * size,
                        (i + 1) * size,
                        j * size,
                        (i + 1) * size,
                        (j + 1) * size,
                        i * size,
                        (j + 1) * size
                    ];

                    let slab = new SvgarSlab(`HM${i}${j}`);

                    let sq = new Svgar.Builder.Polyline(p[0], p[1])
                    .lineTo(p[2], p[3])
                    .lineTo(p[4], p[5])
                    .lineTo(p[6], p[7])
                    .close();

                    let path = sq.build();

                    slab.setAllGeometry([path]);
                    slab.setAllStyles([
                        {
                            name: "default",
                            attributes: {
                                "stroke": "red",
                                "stroke-width": "0.5px",
                                "fill": "red",
                                "opacity": "0"
                            }
                        }
                    ]);
                    slabs.push(slab);

                    this.paths.push({
                        id: slab.getId(),
                        xMin: p[0],
                        yMin: p[1],
                        xMax: p[4],
                        yMax: p[5]
                    });

                }

            }

            return slabs;
        },
        onMove(event: MouseEvent): void {
            
            let t = Date.now();
            if (t - this.prev < 50) {
                return;
            }

            const box = (<Element>this.$refs.svgar).getBoundingClientRect();
            let x = event.pageX - box.left;
            let y = this.h - (event.pageY - box.top);

            //console.log(`${x}, ${y}`);

            let target = this.paths.find(p => p.yMax > y && p.yMin < y && p.xMax > x && p.xMin < x);

            let cell = Locate().svgar.slab.withId(target ? target.id : "").in.svgar.cube(this.cube);

            if(cell) {
                let o = cell.getAllStyles().find(x => x.name == "default");
                let op = o ? +o.attributes["opacity"] + 0.05 : 0;
                console.log(op);
                Update().svgar.slab(cell).styles.to([
                    {
                        name: "default",
                        attributes: {
                            "stroke": "red",
                            "sroke-width": "0.5px",
                            "fill": "red",
                            "opacity": op.toString(),
                        }
                    }
                ])
            }

            this.prev = t;
        }
    }
})
</script>