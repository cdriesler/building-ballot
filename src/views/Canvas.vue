<template>
<div id="main">
    <div class="sidebar">
        <!-- <img width="300px" src="./../assets/map.jpg" /> -->
        <div class="heatmap">
        <heatmap :options="modelName"></heatmap>
        </div>  

        <vote-total @pick="pickModelA" :name="'Option A'" :pct="pctA"></vote-total>
        <vote-total @pick="pickModelB" :name="'Option B'" :pct="pctB"></vote-total>
        <vote-total @pick="pickModelC" :name="'Option C'" :pct="pctC"></vote-total>
    </div>

    <div class="viewer">
        <model-gltf :src="filePath"></model-gltf> 
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

.pct:hover {
    cursor: pointer;
}

.sidebar {
    height: 100%;
    width: 300px;
    margin-left: 15px;

    border-radius: 15px;

    background: grey;
}

.viewer {
    height: 100%;
    flex-grow: 1;
}

.heatmap {
    width: 300px;
    height: 300px;
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
    import { db } from './../firebase';

    export default {
        components: {
            ModelGltf,
            Heatmap,
            VoteTotal,
        },
        data() {
            return {
                modelName: "option1",
                a: 1,
                b: 1,
                c: 1,
                interval: 50,
                voters: [],
            }
        },
        mounted() {
            db.ref("users/").on("value", data => {
                this.parseVote(data.val());
            });

            db.ref().on("child_added", data => {
                this.parseVote(data.val());
            });

            db.ref().on("child_changed", data => {
                this.parseVote(data.val());
            });
        },
        computed: {
            filePath() {
                return `./${this.modelName}.gltf`;
            },
            pctA() {
                return this.a / (this.a + this.b + this.c);
            },
            pctB() {
                return this.b / (this.a + this.b + this.c);
            },
            pctC() {
                return this.c / (this.a + this.b + this.c);
            }
        },
        methods: {
            pickModel(name) {
                this.modelName = name;
            },
            pickModelA() {
                this.modelName = "option1";
            },
            pickModelB() {
                this.modelName = "option2";
            },
            pickModelC() {
                this.modelName = "option3";
            },
            step() {
                let r = Math.random();
                this.interval = r * 20;

                if ( r < 0.33) {
                    this.a = this.a + 1;
                }
                else if ( r < 0.66) {
                    this.b = this.b + 1;
                }
                else {
                    this.c = this.c + 1;
                }
            },
            parseVote(data) {
                this.voters = [];
                this.a = 1;
                this.b = 1;
                this.c = 1;

                Object.keys(data).forEach(x => {
                    Object.keys(data[x]).forEach(y => {
                        this.voters.push( {
                            name: y,
                            vote: +data[x][y]["num"],
                        });
                    })
                });

                this.voters.forEach(vote => {
                    let v = vote.vote;

                    //console.log(v);

                    if (v == 0) {
                        this.a = this.a + 1;
                    }
                    else if (v == 1) {
                        this.b = this.b + 1;
                    }
                    else {
                        this.c = this.c + 1;
                    }

                    //console.log(`${this.a}/${this.b}/${this.c}`)
                });
            }
        }
    }
</script>

